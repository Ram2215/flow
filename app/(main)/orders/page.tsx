import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { Search,Filter,Plus} from "lucide-react";

export default function order(){
  return(
    <div className="flex-1 min-h-screen bg-[#0f172a] p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-white font-bold">Orders</h1>
        <div className="flex item-center gap-3">
          <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-1/2 text-zinc-500"/>
          <Input
           placeholder="Enter Name..."
           className="h-9 w-56 rounded-lg border border-zinc-500 bg-[#0f172a] placeholder-zinc-500 text-sm text-white focus:border-zinc-500 focus:ring-zinc-500 pl-10 pl-8"/>
           </div>
           <Button
           className="h-9 rounded-lg bg-transparent text-white cursor-pointer hover:bg-zinc-800 hover:text-white">
           <Filter/>Filter
           </Button>
           <Button
           className="h-9 rounded-lg text-white cursor-pointer bg-[#a78bfa]">
           <Plus/>
           Create
           </Button>
        </div>
      </div>

    </div>

  )
}


