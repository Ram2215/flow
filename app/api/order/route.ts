import {orders} from "@/db/orders-schema"
import {db} from "@/db"
import { NextResponse } from "next/server"

export async function GET(){
    const res=await db.select().from(orders)
    return NextResponse.json(res)

}
