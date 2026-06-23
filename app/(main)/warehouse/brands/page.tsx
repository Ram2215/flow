"use client"
import {Search,Plus} from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field"
import {Pencil,Trash2} from "lucide-react";
 
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FormEvent, useEffect,useState } from "react"
import {Button} from "@/components/ui/button";
import { brand } from "@/db/brand-schema";

type bran={
    id:number,
    name:string,
    product:string,
    createdat:string
}
type product={
    id:number,
    name:string,
    category:string,
    brand:string,
    price:number,
    stock:number,
}

export default function TableDemo() {
    const [searchname,setsearchname]=useState("")
    const [Bran,setBran]=useState<bran[]>([]);
    const [buttonclick,setbuttonclick]=useState(false);
    const [brandname,setbrandname]=useState("");
    const [prod,setprod]=useState<product[]>([])
    const [editid,seteditid]=useState<number | null>(null);
    useEffect(()=>{fetch("/api/brand")
        .then((r)=>r.json())
        .then(setBran);},[])

    useEffect(()=>{fetch("/api/product")
      .then((r)=>r.json())
      .then(setprod)
    },[])

    const handlesubmit=async(e:React.FormEvent)=>{
      e.preventDefault()
      if(!brandname.trim()) return;
      const res=await fetch("/api/brand",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          name:brandname,
        })
      })
       if(res.ok){
        const newbrand=await res.json();
        setBran((prev)=>[...prev,newbrand])
        setbrandname("")
        setbuttonclick(false);
          
        }

    }
  const handledel=async(id:number)=>{
    const ok=confirm("Delete this brand?")
    if(!ok) return;
    const res=await fetch(`/api/brand/${id}`,{
      method:"DELETE",
    })
    if(res.ok){
      setBran((prev)=>prev.filter((Bran)=>Bran.id!==id))
    }

  }
  const handleeditclick=(brand:bran)=>{
    seteditid(brand.id);
    setbrandname(brand.name)
    setbuttonclick(true)
  }
  const handleedit=async(e:React.FormEvent)=>{
    e.preventDefault
    if (!brandname.trim()) return;
    const res=await fetch(`/api/brand/${editid}`,{
      method:"PATCH",
      headers:{"content-type":"application/json"},
      body:JSON.stringify(
        {name:brandname}
      )
    })
    if(res.ok){
      const updated=await res.json()
      setBran((prev)=>prev.map((b)=>b.id===editid? updated: b ))
    }
    seteditid(null);
    setbrandname("")
    setbuttonclick(false)
  }

    const filterbran=Bran.filter((brand)=>brand.name.toLowerCase().includes(searchname.toLowerCase()))

   

  return (<>
  {console.log(prod)}
  <div suppressHydrationWarning className="flex-1 bg-[#0f172a] min-h-screen p-8">
    <div className="flex item-center justify-between">
      <h1 className="text-white text-2xl font-bold">Brands</h1>
      <div className="flex item-center gap-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-1/2 text-zinc-500"/>
        <input
        placeholder="Name..."
        className="h-9 w-56 rounded-lg border border-zinc-500 bg-[#0f172a] text-small text-white placeholder-zinc-500 pl-10 pr-8 focus:border-zinc-500 focus:ring-zinc-500"
        onChange={(e)=>setsearchname(e.target.value)}
        value={searchname}/>
      </div>
      <Button 
      variant="outline"
      className="h-9 rounded-lg bg-[#a78bfa] text-white hover:bg-[#a78bfa]/90 cursor-pointer"
      onClick={()=>setbuttonclick(true)}>
      <Plus/>
        Create
      </Button>
      </div>
    </div>
   <div className="pt-20 pl-10 pr-10 ">
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow className="text-white">
          <TableHead className="w-[100px]">No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))} */}
        {filterbran.map((i)=>{
            return(<TableRow key={i.id} className="font-medium text-white">
                <TableCell>{i.id}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>
                  {prod.filter((pro)=>pro.brand===i.name).length}
                </TableCell>
                
                <TableCell >
                  <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-[#0f172a] rounded-large" onClick={()=>{handleeditclick(i)}}>
                    <Pencil className="h-4 w-4"/>
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-large" onClick={()=>handledel(i.id)}>
                  <Trash2 className="h-4 w-4"/>
                  </Button>
                 </div>
                </TableCell>
              

            </TableRow>
        )})}

      </TableBody>
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
    </div>
    </div>
    <Dialog open={buttonclick} onOpenChange={setbuttonclick}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Brand</DialogTitle>
            <DialogDescription>
             {editid? "Edit Brand":"Add Brand"}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input 
               placeholder="Enter Brand name..."
               value={brandname}
               onChange={(e)=>setbrandname(e.target.value)} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={editid? handleedit:handlesubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    </>
  )
}
