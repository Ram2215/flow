import {orders, orderItems} from "@/db/orders-schema"
import {db} from "@/db"
import { NextResponse } from "next/server"
import {sql} from "drizzle-orm"

export async function GET(){
    const res=await db.select().from(orders)
    return NextResponse.json(res)

}
export async function POST(req:Request){
    const {customer, email, country, total, items}=await req.json()
    const last_order=await db.select({order_id:orders.order_id}).from(orders).orderBy(sql `${orders.id} desc`).limit(1);
    let nextnum=1
    if(last_order.length>0){
        const lastnum=parseInt(last_order[0].order_id.replace("ORD",""),10);
        nextnum=lastnum+1
    }
    const order_id=`ORD${String(nextnum).padStart(3,"0")}`;
    const [created]=await db.insert(orders).values({order_id,customer,email: email || "", country,total}).returning()

    if (items && items.length > 0) {
        await db.insert(orderItems).values(
            items.map((item: any) => ({
                order_id,
                product_name: item.name,
                brand: item.brand,
                category: item.category,
                price: item.price,
                qty: item.qty,
            }))
        )
    }

    return NextResponse.json(created)
}
