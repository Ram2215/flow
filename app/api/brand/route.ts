import {db} from "@/db";
import {brand} from "@/db/brand-schema";
import { NextResponse } from "next/server";

export async function GET(){
    const res=await db.select().from(brand);
    return NextResponse.json(res);
}

export async function POST(req:Request){
    const body=await req.json()
    const [create]=await db.insert(brand).values(body).returning();
    return NextResponse.json(create)
}