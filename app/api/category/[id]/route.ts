import {db} from "@/db"
import {category} from "@/db/category-schema"
import {eq} from "drizzle-orm"
import {NextResponse} from "next/server"

type Params=Promise<{id:string}>

export async function DELETE(_req:Request,context:{params:Params}){
    const {id}=await context.params
    const num=Number(id)
    if(!Number.isInteger(num)){
        return NextResponse.json(
            {Error:"Invalid"},
            {status:400}
        )
    }
    await db.delete(category).where(eq(category.id,num))
    return NextResponse.json({
        Success:true
    })

}
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
    const[updated]=await db.update(category).set({...name && {name}}).where(eq(category.id,num)).returning();
    return NextResponse.json(updated);
}