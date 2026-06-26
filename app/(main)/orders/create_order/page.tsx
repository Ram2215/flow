"use client"
import { useEffect, useState } from "react"
import { Trash2, Pencil, Loader2, Mail, MapPin, Plus, Package,X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function CreateOrderPage() {
  const router = useRouter()
  const [customer, setcustomer] = useState<{
    id: number
    name: string
    email: string
    country: string
  } | null>(null)
  type product={
    id : number,
    name : string,
    brand : string,
    category : string,
    price : string,
    stock : number
  }
  type lineitem = product & {qty:number}
  const [loading, setLoading] = useState(true)
  const [products,setproducts]=useState<product[]>([])
  const [items,setitems]=useState<lineitem[]>([])
  const [productpick,setproductpick]=useState(false)
  useEffect(() => {
    const saved = localStorage.getItem("selectedcustomer")
    if (saved) {
      try {
        setcustomer(JSON.parse(saved))
      } catch { /* ignore */ }
    }
    setLoading(false)

    fetch("/api/product").then((r)=>r.json()).then(setproducts)
  }, [])
   const productselect=(pro:product)=>{
       setitems((prev)=>[...prev,{...pro,qty:1}])
       setproductpick(false)
   }
   const remitem=(index:number)=>{
       setitems((prev)=>prev.filter((_,i)=>i!==index))
   }
   const total=items.reduce((sum,item)=>sum + parseFloat(item.price) * item.qty,0)


  return (
    <div className="flex-1 min-h-screen bg-[#0f172a] p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-white font-bold">Order</h1>
        <Button className="rounded-lg border text-white" variant="destructive">
          <Trash2 />
          Delete
        </Button>
      </div>

      <Separator className="my-4 mt-5" />

      {/* Top Section: Customer + Summary */}
      <div className="mt-8 flex gap-6">
        <div className="flex-1">
          <Card className="bg-[#1e293b] border-zinc-700 text-white shadow-lg rounded-xl">
            <CardHeader>
              <div className="flex w-full items-center justify-between">
                <CardTitle className="text-lg font-semibold">Customer</CardTitle>
                <Button
                  variant="ghost"
                  className="h-8 gap-1 text-zinc-400 hover:text-white"
                  onClick={() => router.push("/orders/create")}
                >
                  <Pencil className="size-4" />
                  Change
                </Button>
              </div>
            </CardHeader>
            <Separator className="mx-6 w-[calc(100%-3rem)] bg-zinc-700" />
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-zinc-400" />
                </div>
              ) : customer ? (
                <div className="flex items-start gap-4">
                  <Avatar className="size-16">
                    <AvatarFallback className="text-lg">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-white">{customer.name}</p>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mail className="size-4" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <MapPin className="size-4" />
                      <span className="text-sm">{customer.country}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-zinc-500">No customer selected</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="bg-[#1e293b] border-zinc-700 text-white shadow-lg rounded-xl">
            <CardHeader>
              <div className="flex w-full items-center justify-between">
                <CardTitle className="text-lg font-semibold">Summary</CardTitle>
                <Badge variant="outline" className="text-zinc-400 border-zinc-600">
                  Draft
                </Badge>
              </div>
            </CardHeader>
            <Separator className="mx-6 w-[calc(100%-3rem)] bg-zinc-700" />
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-center">
                <span className="shrink-0 text-sm text-zinc-400">Items</span>
                <div className="mx-2 min-w-[20px] flex-1 self-center border-b border-dotted border-zinc-600" />
                <span className="shrink-0 font-medium text-white"></span>
              </div>
              <div className="flex items-center">
                <span className="shrink-0 text-sm text-zinc-400">Total</span>
                <div className="mx-2 min-w-[20px] flex-1 self-center border-b border-dotted border-zinc-600" />
                <span className="shrink-0 font-medium text-white">Rs.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Items Section - full width */}
      <Card className="mt-6 bg-[#1e293b] border-zinc-700 text-white shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-lg font-semibold">Items</CardTitle>
            <Button
              variant="outline"
              className="h-8 gap-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white border-0"
              onClick={()=>setproductpick(true)}
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </CardHeader>
        <Separator className="mx-6 w-[calc(100%-3rem)] bg-zinc-700" />
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700">
                <TableHead className="text-zinc-400">Product</TableHead>
                <TableHead className="text-zinc-400">Brand</TableHead>
                <TableHead className="text-zinc-400">Category</TableHead>
                <TableHead className="text-right text-zinc-400">Qty</TableHead>
                <TableHead className="text-right text-zinc-400">Price</TableHead>
                <TableHead className="text-right text-zinc-400">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                productpick && (
                    <TableRow>
                        <TableCell colSpan={7} className="px-2 py-2">
                            <Combobox onValueChange={(value)=>{
                                const p=products.find((prod)=> prod.name === value)
                                if(p) productselect(p)
                            }}>
                                <ComboboxInput placeholder="search product..." className="bg-zinc-800 border-zinc-600 text-white"/>
                                <ComboboxContent>
                                    <ComboboxEmpty>No products found</ComboboxEmpty>
                                    <ComboboxList>
                                        {
                                            products.map((prod)=>(
                                                <ComboboxItem key={prod.id} value={prod.name}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{prod.name}</span>
                                                        <span className="text-xs text-zinc-500">Rs.{prod.price}</span>
                                                    </div>
                                                </ComboboxItem>
                                            ))
                                        }
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </TableCell>
                    </TableRow>
                )
              }
              {items.length > 0 ? items.map((item,index)=>(
                <TableRow key={item.id+"-"+index} className="border-zinc-700">
                    <TableCell className="text-white">{item.name}</TableCell>
                    <TableCell className="text-zinc-400">{item.brand}</TableCell>
                    <TableCell className="text-zinc-400">{item.category}</TableCell>
                    <TableCell className="text-right text-white">{item.qty}</TableCell>
                    <TableCell className="text-right text-white">Rs.{item.price}</TableCell>
                    <TableCell className="text-right text-white">
                        Rs.{(parseFloat(item.price) * item.qty).toFixed(2)}
                    </TableCell>
                    <TableCell>
                        <Button onClick={
                            ()=>remitem(index)
                        }>
                            <X className="size-4"/>
                        </Button>
                    </TableCell>
                </TableRow>
              )): ! productpick && (
                <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                        <Package className="size-10"/>
                        <span>Nothing here</span>
                        </div>

                    </TableCell>
                </TableRow>
              )
            
            }
            </TableBody>
          </Table>
        </CardContent>
      </Card>

     
    </div>
  )
}