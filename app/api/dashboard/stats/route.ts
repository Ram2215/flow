import {db} from "@/db"
import {orders} from "@/db/orders-schema"
import {customer} from "@/db/customer_schema"
import { orderItems } from "@/db/orders-schema"
import {sql} from "drizzle-orm"
import {NextResponse} from "next/server"

export async function GET(){
    const [gross]=await db.select({total:sql<number>`coalesce(sum(${orders.total}),0)`}).from(orders);

    const revenuebydate=await db.select({date:orders.date,revenue:sql<number>`sum(${orders.total})`}).from(orders).groupBy(orders.date).orderBy(orders.date)

    const [ordercount]=await db.select({count:sql<number>`count(*)`}).from(orders)

    const [customercount]=await db.select({count:sql<number>`count(*)`}).from(customer)

    const result=await db.select({category:orderItems.category,total:sql<number>`sum(${orderItems.qty})`,}).from(orderItems).groupBy(orderItems.category).orderBy(sql`sum(${orderItems.qty}) desc`)

    const categorydata=result.map((item)=>({
        category:item.category,
        total:Number(item.total),
    }))

    return NextResponse.json({grossrevenue:gross.total,revenuebydate,totalorders:ordercount.count,totalcustomers:customercount.count,categorydata})
}
