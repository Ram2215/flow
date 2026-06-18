import { db } from "@/db";
import { customer } from "@/db/customer_schema";
import { NextResponse } from "next/server";

export async function GET(){
  const customers=await db.select().from(customer);
  return NextResponse.json(customers);
}

export async function POST(req:Request){
  // const body=await req.json();
  // const {name,email,country}=body;
  // if(!name || !email || !country){
  //   return NextResponse.json({error:"Missing required fields"}, {status:400});
  // }

  // const [created]= await db.insert(customer).values({name,email,country}).returning();
  // return NextResponse.json(created);
  
  const customers = await req.json();

  const created = await db
            .insert(customer)
            .values(customers)
            .returning();

        return NextResponse.json(created);

}
