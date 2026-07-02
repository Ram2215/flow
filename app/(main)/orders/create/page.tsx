"use client"
import {useState,useEffect} from "react";
import {SendHorizontal} from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Undo2 } from "lucide-react";
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"


export default function create(){
    const router=useRouter()
    type customer={
        id : string,
        name : string,
        email : string,
        country : string,
    }
    const [selectedcustomer,setselectedcustomer]=useState<customer | null>(null)
     const [cust,setcust]=useState <customer[]>([])
    useEffect(()=>{fetch("/api/customers")
                .then((r)=>r.json()).then(setcust)
    },[])
     
    // const createorder=()=>{
    //   const order={
    //     customer,
    //     items,
    //     total,
    //   }
    // }
    return(
        <div className="flex-1 min-h-screen bg-background p-8">
            <div className="flex item-center justify-between">
                 <h1 className="text-2xl text-foreground font-bold">New Order</h1>
                 <Button className="h-9 rounded-lg-border border-zinc-500" onClick={()=>router.push("/orders")}>
                    <Undo2 className="text-white"/>
                    discard
                 </Button>
            </div>
           <div className="mt-10 flex justify-start">
  <Card className="w-[750px] min-h-[350px] rounded-xl border border-zinc-700 bg-card text-foreground shadow-lg">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold">
        Customer
      </CardTitle>

      <CardDescription className="text-zinc-400">
       
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form className="space-y-6">
        <div>
          <Combobox onValueChange={(value)=>{
              const c=cust.find((c)=> c.name === value)
              if(c) setselectedcustomer(c)
            }
          }>
      <ComboboxInput placeholder="Name" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {/* {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )} */}
          {cust.map((customer)=>(
              <ComboboxItem key={customer.id} value={customer.name} >
                {customer.name}
              </ComboboxItem>)
        )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>

        </div>

      </form>
      <div className="mt-5">
      <Button className="h-10 rounded-lg border bg-purple-600 hover:bg-purple-600 text-white" variant="outline"
       onClick={()=>{if(selectedcustomer){
        localStorage.setItem("selectedcustomer",JSON.stringify(selectedcustomer))
        router.push("/orders/create_order")
       }
      }}
          >
        <SendHorizontal/>
        Confirm</Button>
      </div>
    </CardContent>

    <CardFooter className="gap-3">
    </CardFooter>
  </Card>
</div>


</div>
       
    )
}