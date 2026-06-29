"use client"
import {useState,useEffect} from "react"
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card"
import { XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,AreaChart,Area,PieChart,Pie,Cell,Legend } from "recharts";

 
export default function DashboardPage() {
  
  type grossrev={
    grossrevenue:number,
    revenuebydate:{date:string,revenue:number}[],
    totalorders:number,
    totalcustomers:number,
    categorydata:{
      category:string,
      total:number,
    }[]
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
      <div className="grid grid-cols-3 gap-4">
        <Card className=" w-fit rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
          <CardHeader>
            <CardTitle className="w-56 text-2xl text-muted-foreground">Gross Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="w-56 text-2xl font-bold text-black">Rs.{data.grossrevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      
      <Card className="w-56 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-muted-foreground">
            Total orders
          </CardTitle>
          <CardContent>
            <p className="text-2xl font-bold text-black text-2xl">{data.totalorders.toLocaleString()}</p>
          </CardContent>
        </CardHeader>
      </Card>

      <Card className="w-64 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
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

      <Card className="mt-4 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
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

      <Card className="mt-4 rounded-xl border border-zinc-700 bg-[#1e293b] text-white shadow-lg">
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
  );
}
