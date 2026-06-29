import {ColumnDef} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {Pencil,Trash2} from "lucide-react"

export type order={
    date:string,
    order_id:string,
    customer:string,
    country:string,
    total:number,
    id:number
}

export const columns:ColumnDef<order>[]=[
    {
        accessorKey:"date",
        header:"Date"
    },
    {
        accessorKey:"order_id",
        header:"Order Id"
    },
    {
        accessorKey:"customer",
        header:"Customer"
    },
    {
        accessorKey:"country",
        header:"Country"
    },
    {
        accessorKey:"total",
        header:"Total"
    },
    {
        id:"actions",
        header:"actions",
        cell:({row})=>{
            const order=row.original;
            return(

                <div className="flex gap-2">
                    {/* <Button onClick={()={some logic}} */}
                
                <Button onClick={async()=>{
                    if(!confirm("Delete this order?")) return;
                    const res=await fetch(`/api/order/${order.order_id}`,{
                        method:"DELETE",
                        
                    });
                    if(res.ok){
                        window.location.reload()
                    }

                }}>
                    <Trash2 className="size-4"/>
                </Button>
            </div>
            )

        }

    }
    
]