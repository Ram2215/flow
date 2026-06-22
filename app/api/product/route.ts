import {db} from "@/db"
import {product} from "@/db/product-schema"
import { NextResponse } from "next/server"

export async function GET(){
    const res=await db.select().from(product);
    return NextResponse.json(res);

}

export async function POST(req:Request){
    const prod=await req.json();
    const [create]=await db.insert(product).values({brand:prod.selectbran,category:prod.selectcate,price:prod.price,stock:prod.stock,name:prod.name}).returning()
    return NextResponse.json(create);
}