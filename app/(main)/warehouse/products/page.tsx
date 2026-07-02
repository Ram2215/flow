"use client"

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
import {useState,useEffect,useMemo} from "react"
import { ChevronLeft,ChevronRight,Search,Filter,Plus,Pencil,Trash2 } from "lucide-react"
import {Button} from "@/components/ui/button";
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
import {useRouter} from "next/navigation"


type pro={
    id:number,
    name:string,
    brand:string,
    category:string,
    price:number,
    stock:number
}
type brand={
  id:number,
  name:string
}
type category={
  id:number,
  name:string
}
const page_size=7;

export default function TableDemo() {

    const [showdata,setshowdata]=useState<pro[]>([])
    const [name,setname]=useState("")
    const [price,setprice]=useState("")
    const [stock,setstock]=useState("")
    const [page,setpage]=useState(1);
    const totalpage=Math.max(1,Math.ceil(showdata.length/page_size))
    const safepage=Math.min(page,totalpage);
    const start=(safepage-1)*page_size;
    const end=start+page_size;
    const pagedata=showdata.slice(start,end);
    const [clickprod,setclickprod]=useState(false)
    const [brands,setbrands]=useState<brand[]>([])
    const [cates,setcates]=useState<category[]>([])
    const [selectbran,setselectbran]=useState("")
    const [selectcate,setselectcate]=useState("")
    const [search,setsearch]=useState("")
    const [editid,seteditid]=useState<number | null>(null)

    useEffect(()=>{fetch("/api/product")
              .then((d)=>d.json())
              .then(setshowdata);},[])
    
    useEffect(()=>{fetch("/api/brand")
              .then((r)=>r.json())
              .then(setbrands);},[])

    useEffect(()=>{fetch("/api/category")
              .then((r)=>r.json())
              .then(setcates);
    },[])

   const handlesubmit=async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!name.trim() || !selectbran || !selectcate || !price.trim() || !stock.trim()) return;
    const res=await fetch("/api/product",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify(
        { name,selectbran,selectcate,price:Number(price),stock:Number(stock)}
             )
    })
    if(res.ok){
      const newname=await res.json()
      setshowdata((prev)=>[...prev,newname])
      setname("");
      setprice("")
      setstock("")
      setselectbran("")
      setselectcate("")
      setclickprod(false)
    }
    
   }
   const handleeditclick=(product:pro)=>{
    seteditid(product.id)
    setname(product.name)
    setselectbran(product.brand)
    setselectcate(product.category)
    setprice(product.price.toString())
    setstock(product.stock.toString())
    setclickprod(true)
   }
   
   const handleedit=async(e:React.FormEvent)=>{
    e.preventDefault()
    const res=await fetch(`/api/product/${editid}`,{
      method:"PATCH",
      headers:{"content-type":"application/json"},
      body:JSON.stringify(
        {
          name:name,
          brand:selectbran,
          category:selectcate,
          price:price,
          stock:stock
        }
      )
    })
    if(res.ok){
      const updated=await res.json()
      setshowdata((prev)=>prev.map((b)=>b.id===editid? updated:b))
    }
    seteditid(null)
    setname("")
    setselectbran("")
    setselectcate("")
    setprice("")
    setstock("")
    setclickprod(false)
   }
   
   const handledel=async(id:number)=>{
    const del=confirm("Are you sure want to delete this product?")
    if(!del) return;
    const res=await fetch(`/api/product/${id}`,{
      method:"DELETE"
    });
    console.log("Status:", res.status);
    console.log("OK:", res.ok);

    if(res.ok){
      const updated=await res.json()
      setshowdata((prev)=>prev.filter((d)=>d.id!==id))
     
    }
   }



    useEffect(() => {
      if (page > totalpage) setpage(totalpage)
    }, [totalpage, page])

    const getPageNumbers = () => {
      const pages: (number | "...")[] = []
      if (totalpage <= 7) {
        for (let i = 1; i <= totalpage; i++) pages.push(i)
      } else {
        pages.push(1)
        if (safepage > 3) pages.push("...")
        for (let i = Math.max(2, safepage - 1); i <= Math.min(totalpage - 1, safepage + 1); i++) pages.push(i)
        if (safepage < totalpage - 2) pages.push("...")
        pages.push(totalpage)
      }
      return pages
    }
    const profilter=showdata.filter((pro)=>pro.name.toLowerCase().includes(search.toLowerCase()))

  return (
     <div suppressHydrationWarning className="flex-1 bg-background min-h-screen p-8">
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Products</h1>

            <div className="flex item-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
                    <input
                    type="text"
                    placeholder="Name..."
                    className="h-9 w-56 rounded-lg border border-zinc-800 bg-background pl-10 pr-8 text-small text-white placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-zinc-600 transition colors"
                    onChange={(e)=>setsearch(e.target.value)}
                    value={search}
                    />
                </div>
                <Button
                    variant="outline"
                    className="relative h-9 rounded-lg border-zinc-700 bg-transparent text-foreground hover:bg-zinc-300 hover-text-white cursor-pointer " 
                 >
                    <Filter className="size-3 mr-2"/>
                    Filter
                </Button>
                <Button className="h-9 rounded-lg bg-[#a78bfa] text-white hover:bg-[#a78bfa]/90 cursor-pointer"
                onClick={()=>setclickprod(true)}>
                <Plus />
                    Create
                </Button>

            </div>
        </div>
    <div className="pt-20 pl-10 pr-10">
    <Table>
      <TableCaption>Product table</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-foreground">No</TableHead>
          <TableHead className="text-foreground">Name</TableHead>
          <TableHead className="text-foreground">Brand</TableHead>
          <TableHead className="text-foreground">Category</TableHead>
          <TableHead className="text-foreground">Price</TableHead>
          <TableHead className="text-foreground">Stock</TableHead>
          <TableHead className="text-foreground">Actions</TableHead>
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
        {
            profilter.map((d,index)=>{return(
                <TableRow key={d.id} className="text-foreground">
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.brand}</TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell>Rs.{d.price}</TableCell>
                    <TableCell>{d.stock}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button className="bg-background rounded-lg" size="sm" variant="outline" onClick={()=>{handleeditclick(d)}}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button className="bg-background rounded-lg" size="sm" variant="destructive" onClick={()=>handledel(d.id)}>
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </TableCell>
                </TableRow>
            )

            })
        }
        
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-zinc-400">
                Showing {showdata.length === 0 ? 0 : start + 1} to{" "}
                {Math.min(end, showdata.length)} of {showdata.length} results
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setpage(Math.max(1, safepage - 1))}
                  disabled={safepage === 1}
                  className="flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer">
                  <ChevronLeft className="size-4" />
                </button>
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`e${i}`} className="flex size-8 items-center justify-center text-sm text-zinc-500">...</span>
                  ) : (
                    <button key={p} onClick={() => setpage(p)}
                      className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors cursor-pointer ${
                        p === safepage ? "bg-[#a78bfa] text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}>
                      {p}
                    </button>
                  )
                )}
                <button onClick={() => setpage(Math.min(totalpage, safepage + 1))}
                  disabled={safepage === totalpage}
                  className="flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
   </div>
   <Dialog open={clickprod} onOpenChange={setclickprod}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Products</DialogTitle>
            <DialogDescription>
              editid?Edit product:create product
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input placeholder="Name..." value={name} onChange={(e)=>setname(e.target.value)}/>
            </Field>
            <Field>
              <Label>Brands</Label>
              <select
                value={selectbran}
                onChange={(e)=>setselectbran(e.target.value)}>
                <option value="">Select brand</option>
                {
                  brands.map((brand)=>
                    <option key={brand.id} value={brand.name}>{brand.name}</option>)
                }
              </select>
            </Field>
            <Field>
              <Label>Categories</Label>
              <select value={selectcate} onChange={(e)=>setselectcate(e.target.value)}>
                <option value="">Select Category</option>
                {
                  cates.map((cat)=><option key={cat.id} value={cat.name}>{cat.name}</option>)
                }
              </select>
            </Field>
            <Field>
              <Label>Price</Label>
              <Input placeholder="Rs." value={price} onChange={(e)=>setprice(e.target.value)}/>
            </Field>
            <Field>
              <Label>Stock</Label>
              <Input value={stock} onChange={(e)=>setstock(e.target.value)}/>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={editid? handleedit : handlesubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>

    </div>
  )
}
