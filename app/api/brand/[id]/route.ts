import {db} from "@/db"
import {brand} from "@/db/brand-schema"
import { NextResponse } from "next/server"
import {eq} from "drizzle-orm";

type Params=Promise<{id:string}>

export async function PATCH(req:Request,context:{params:Params}){
    const {id}=await context.params
    const num=Number(id)
    if(!Number.isInteger(num)){
        return NextResponse.json(
            {Error:"Invalid"},
            {status:400}
        )
    }
    const body=await req.json()
    const {name}=body
    const [updated]=await db.update(brand).set({...name && {name}}).where (eq(brand.id,num)).returning();
    return NextResponse.json(updated)

}
export async function DELETE(_req:Request,context:{params:Params}){
    const {id}=await context.params
    const num=Number(id)
    if(!Number.isInteger(num)){
        return NextResponse.json(
            {Error:"Invalid"},
            {status:400}
        )
    }
    await db.delete(brand).where(eq(brand.id,num))
    return NextResponse.json(
        {Success:true}
    )
}