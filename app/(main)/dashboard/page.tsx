"use client"
import {useState,useEffect} from "react"
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card"
import { XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,AreaChart,Area,PieChart,Pie,Cell,Legend } from "recharts";
import { ArrowRight } from "lucide-react";
import {Button} from "@/components/ui/button"
import { useRouter } from "next/navigation"

 
export default function DashboardPage() {

  const router=useRouter()
  
  type grossrev={
    grossrevenue:number,
    revenuebydate:{date:string,revenue:number}[],
    totalorders:number,
    totalcustomers:number,
    categorydata:{
      category:string,
      total:number,
    }[],
    topcustomers:{id:number,name:string,email:string,country:string,total:number}[];
    topprod:{name:string,totalqty:number}[]
  }
  const[data,setdata]=useState<grossrev | null>(null)

  useEffect(()=>{fetch("api/dashboard/stats").then((r)=>r.json()).then(setdata)},[])

  if(!data) return(
    <div className="flex-1 bg-[#0f172a] min-h-screen p-8">
       <p className="text-white">Loading...</p>
    </div>
  )
  return (
    <div className="flex-1 bg-[#0f172a] min-h-screen p-8 space-y-6">
      <h1 className="pb-4 text-2xl font-bold text-white">Dashboard</h1>
      <div className="flex gap-6">
        <Card className="flex-1 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
          <CardHeader>
            <CardTitle className="w-56 text-2xl text-muted-foreground">Gross Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="w-full text-2xl font-bold text-black">Rs.{data.grossrevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      
       <Card className="flex-1 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-muted-foreground">
            Total orders
          </CardTitle>
        </CardHeader>
         <CardContent>
            <p className="text-2xl font-bold text-black text-2xl">{data.totalorders.toLocaleString()}</p>
         </CardContent>
       </Card>

       <Card className="flex-1 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-muted-foreground">
            Total Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-2xl font-bold text-black">{data.totalcustomers.toLocaleString()}</p>
        </CardContent>
       </Card>
      </div>
        
     
      <div className="mt-4 flex gap-6">
      <Card className="flex-1 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
        <CardHeader>
          <CardTitle>
            Revenue Over time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data.revenuebydate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                <XAxis dataKey={"date"} stroke="#94a3b8"/>
                <YAxis stroke="#94a3b8"/>
                <Tooltip/>
                <Area type="monotone" dataKey="revenue" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3}/>
              </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="flex-1 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
        <CardHeader>
          <CardTitle>Products ordered by category
          </CardTitle>
          
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
               <PieChart>
                <Pie
                data={data.categorydata}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={3}
                >
                  {data.categorydata.map((_,i)=>(
                    <Cell key={i} fill={["#818cf8", "#f472b6", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#a78bfa", "#fb923c"][i%8]} />
                  ))}

                </Pie>
                <Tooltip/>
                <Legend/>
               </PieChart>

          </ResponsiveContainer>
        </CardContent>
      </Card>
      </div>

      <div className="mt-6 flex gap-6">
      <Card className="flex-1 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-2xl text-muted-foreground">
      Top 3 Customers
    </CardTitle>

    <Button
      variant="ghost"
      className="flex items-center gap-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
      onClick={() => router.push("/customers")}
    >
      Customer
      <ArrowRight className="h-5 w-5" />
    </Button>
  </CardHeader>

  <CardContent className="space-y-4">
    {data.topcustomers.map((c, i) => (
      <div
        key={c.id}
        className="flex items-center justify-between rounded-lg bg-[#0f172a] px-5 py-4"
      >
        <div className="flex items-center gap-4">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              i === 0
                ? "bg-yellow-500 text-black"
                : i === 1
                ? "bg-zinc-400 text-black"
                : "bg-amber-700 text-white"
            }`}
          >
            {i + 1}
          </span>

          <div>
            <p className="font-medium text-white">{c.name}</p>
            <p className="text-xs text-zinc-400">
              {c.email} · {c.country}
            </p>
          </div>
        </div>

        <div>
          <p className="text-lg font-bold text-emerald-400">
            Rs.{c.total.toLocaleString()}
          </p>
        </div>
      </div>
    ))}
  </CardContent>
</Card>

      <Card className="flex-1 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
         <CardTitle className="text-2xl font-bold">
            Best Seller
         </CardTitle>
          <Button className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800" variant="ghost" onClick={()=>router.push("/warehouse/products")}> 
            <span className="flex items-center gap-2">
              Best Sellers
              <ArrowRight className="h-4 w-4"/>
            </span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
           {data.topprod.map((prod,index)=>(
            <div key={prod.name} className="flex items-center justify-between rounded-lg bg-[#0f172a] px-5 py-4">
              <div className="flex items-center gap-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${index===0? 'bg-yellow-500 text-black':index===1? 'bg-zinc-400 text-black': 'bg-amber-700 text-white'}`}>
                  {index+1}
                </span>
                <p className="font-medium text-white">{prod.name}</p>
              </div>
              <p className="text-lg font-bold text-emerald-400">{prod.totalqty}</p>
                  
            </div>
           ))}
        </CardContent>

      </Card>
      </div>
  
    </div>
  );
}
