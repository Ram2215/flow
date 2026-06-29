import {db} from "@/db";
import { category } from "@/db/category-schema";
import {NextResponse} from "next/server";
import { NextRequest } from "next/server";

export async function GET(){
    const res=await db.select().from(category);
    return NextResponse.json(res)

}

export async function POST(req:Request){
    const body=await req.json()
    if(!body.name.trim()){
        return(
            Response.json(
                {Error: "Name is required"},
                {status:400}   
            )       
        )
    }
    const [create]=await db.insert(category).values({name:body.name.trim()}).returning()
    return NextResponse.json(create)


}