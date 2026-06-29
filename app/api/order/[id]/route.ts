import {db} from "@/db"
import {orders, orderItems} from "@/db/orders-schema"
import {eq} from "drizzle-orm"
import { NextResponse } from "next/server"

type Params=Promise<{id:string}>

export async function GET(_req: Request, context: { params: Params }) {
    const { id } = await context.params
    const [order] = await db.select().from(orders).where(eq(orders.order_id, id))
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const items = await db.select().from(orderItems).where(eq(orderItems.order_id, id))

    return NextResponse.json({ ...order, items })
}

export async function PATCH(req: Request, context: { params: Params }) {
    const { id } = await context.params
    const body = await req.json()
    const { customer, email, country, total, items } = body

    const [updated] = await db.update(orders)
        .set({
            ...(customer && { customer }),
            ...(email != null && { email }),
            ...(country && { country }),
            ...(total != null && { total }),
        })
        .where(eq(orders.order_id, id))
        .returning()

    if (items) {
        await db.delete(orderItems).where(eq(orderItems.order_id, id))
        if (items.length > 0) {
            await db.insert(orderItems).values(
                items.map((item: any) => ({
                    order_id: id,
                    product_name: item.name,
                    brand: item.brand,
                    category: item.category,
                    price: item.price,
                    qty: item.qty,
                }))
            )
        }
    }

    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, context: { params: Params }) {
    const { id } = await context.params
    await db.delete(orders).where(eq(orders.order_id, id))
    return NextResponse.json({ Success: true })
}
