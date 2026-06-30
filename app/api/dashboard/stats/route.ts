import {db} from "@/db"
import {orders} from "@/db/orders-schema"
import {customer} from "@/db/customer_schema"
import { orderItems } from "@/db/orders-schema"
import {desc, sql, sum} from "drizzle-orm"
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

    const topcust=await db.select({id:customer.id,name:customer.name,email:customer.email,country:customer.country,total:sql<number>`sum(${orders.total})`,}).from(orders).innerJoin(customer,sql`${orders.customer}=${customer.name}`).groupBy(customer.id,customer.name,customer.email,customer.country).orderBy(sql`sum(${orders.total}) desc`).limit(3)

    const topprod=await db.select({name:orderItems.product_name,totalqty:sql<number>`sum(${orderItems.qty})`}).from(orderItems).groupBy(orderItems.product_name).orderBy(sql`sum(${orderItems.qty}) desc`).limit(3)

    return NextResponse.json({grossrevenue:gross.total,revenuebydate,totalorders:ordercount.count,totalcustomers:customercount.count,categorydata,topcustomers:topcust.map(c=>({...c,totalspent:Number(c.total)}))
      ,topprod:topprod.map(c=>({...c,totalqty:Number(c.totalqty)}))
      })
}
