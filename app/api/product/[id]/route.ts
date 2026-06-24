import {db} from "@/db"
import {eq} from "drizzle-orm"
import {product} from "@/db/product-schema"
import {NextResponse} from "next/server"
import { success } from "better-auth"

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
    const{name,brand,category,price,stock}=body
    const [updated]=await db.update(product).set({
        ...(name && {name}),
        ...(brand && {brand}),
        ...(category && {category}),
        ...(price!=null && {price}),
        ...(stock!=null && {stock}),
    }).where(eq(product.id,num)).returning()
    return NextResponse.json(updated)

}
export async function DELETE(req:Request,context:{params:Params}){
    const {id}= await context.params
    const num=Number(id)
    if(!Number.isInteger(num)){
        return NextResponse.json(
            {Error:"Invalid"},
            {status:400}
        )
    }
    await db.delete(product).where(eq(product.id,num));
    return NextResponse.json(
        {success:true},
        {status:200}
    )
    
}
