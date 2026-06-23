"use client"
import {useState,useEffect} from "react";
import { Search,Plus,Pencil,Trash2 } from "lucide-react";
import {Button} from "@/components/ui/button"
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



export default function category(){
    type cate={
        id:number,
        name:string
    }
    type product={
      id:number,
      name:string,
      brand:string,
      category:string,
      price:number,
      stock:number,
    }
    const [cat,setcat]=useState<cate[]>([])
    const [dialogclick,setdialogclick]=useState(false);
    const [catname,setcatname]=useState("")
    const [prod,setprod]=useState<product[]>([])
    const [search,setsearch]=useState("")
    const [editid,seteditid]=useState<number | null>(null)
 

    useEffect(()=>{fetch("/api/category")
      .then((r)=>r.json())
      .then(setcat);},[])

    useEffect(()=>{fetch("/api/product")
      .then((r)=>r.json())
      .then(setprod);

    },[])


    const handlesubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        const res=await fetch("/api/category",{
            method:"POST",
            headers:{"content-type":"application/json"},  
            body:JSON.stringify(
                {
                    name:catname,
                }
            )           
        })
        if(res.ok){
          const newcat=await res.json();
          setcat((prev)=>[...prev,newcat])
          setcatname("");
          setdialogclick(false)
        }
    }
    const handledel=async(id:Number)=>{
      const ok=confirm("Are you sure you want to delete this category?")
      if(!ok) return;
      const res=await fetch(`/api/category/${id}`,{
        method:"DELETE"
      },)
      if(res.ok){
        setcat((prev)=>prev.filter((cat)=>cat.id!==id))
      }

    }
    const handleeditclick=(cates:cate)=>{
      seteditid(cates.id);
      setcatname(cates.name)
      setdialogclick(true)
    }
    const handleedit=async(e:React.FormEvent)=>{
      e.preventDefault()
      const res=await fetch(`/api/category/${editid}`,{
        method:"PATCH",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(
          {name:catname}
        )
      })
      if(res.ok){
        const updated=await res.json()
        setcat((prev)=>prev.map((b)=>b.id === editid ? updated:b))
        seteditid(null)
        setcatname("")
        setdialogclick(false)
      }
    }

    

    const filtercat=cat.filter((cate)=>cate.name.toLowerCase().includes(search.toLowerCase()))

    return(
        <div suppressHydrationWarning className="flex-1 min-h-screen bg-[#0f172a] p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Categories</h1>
                <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
                    <input
                    placeholder ="Enter Category..."
                    className ="h-9 w-64 rounded-lg border border-zinc-500 pl-10 pr-8 focus:border-zinc-500 focus:ring-zinc-500 text-small text-white" 
                    onChange={(e)=>setsearch(e.target.value)}
                    value={search}
                    />
                </div>
                <Button
                variant="outline"
                className="h-9 rounded-lg bg-[#a78bfa] hover:bg-[#a78bfa]/90 cursor-pointer text-white"
                onClick={()=>setdialogclick(true)}
                >
                <Plus/>
                  Create

                </Button>
               </div> 
            </div>
            <div className="pt-10">
            <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow className="text-white">
          <TableHead className="w-[100px]">No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Product</TableHead>
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
        {filtercat.map((i)=>{return(
        <TableRow key={i.id} className="text-white">
            <TableCell>{i.id}</TableCell>
            <TableCell>{i.name}</TableCell>
            <TableCell>
              {prod.filter((pro)=>pro.category===i.name).length}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-[#0f172a] rounded-lg" onClick={()=>{handleeditclick(i)}}>
                  <Pencil className="h-4 w-4"/>
                </Button>
                <Button size="sm" variant="destructive" className="rounded-lg" onClick={()=>{handledel(i.id)}}>
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </TableCell>
        </TableRow>)})}
      </TableBody>
    </Table>
      </div>
      <Dialog open={dialogclick} onOpenChange={setdialogclick}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Category</DialogTitle>
            <DialogDescription>
              Create Category
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input  
              placeholder="Enter Category name"
              onChange={(e)=>setcatname(e.target.value)}
              value={catname}/>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={editid?handleedit:handlesubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
   </div>

    )
}
