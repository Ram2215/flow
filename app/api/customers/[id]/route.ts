import { NextRequest,NextResponse } from "next/server";
import { db } from "@/db"
import {customer} from "@/db/customer_schema";
import { eq } from "drizzle-orm"


type Params = Promise<{id:string}>

export async function DELETE(_req:NextRequest,context:{params:Params}){
    const {id}=await context.params
    const num=Number(id)
    if(!Number.isInteger(num)){
        return NextResponse.json (
            {error:"Invalid id"},
            {status:400}
        )
    }
    await db.delete(customer).where(eq(customer.id,num))
    return NextResponse.json(
        {success:"true"}
    )

}

export async function PATCH(req:NextRequest,context:{params:Params}){
    const {id}=await context.params
    const num=Number(id)
    if(!Number.isInteger(num)){
        return NextResponse.json(
            {Error:"invalid"},
            {status:400}
        )
    }
    const body=await req.json()
    const {name,email,country}=body
    const [updated]=await db.update(customer).set({...name && {name},...(email && {email}),...(country && {country}),})
    .where(eq(customer.id,num)).returning();
     return NextResponse.json(updated);
}