import {ColumnDef} from "@tanstack/react-table"

export type order={
    date:string,
    orderid:string,
    customer:string,
    country:string,
    total:number,
}

export const columns:ColumnDef<order>[]=[
    {
        accessorKey:"date",
        header:"Date"
    },
    {
        accessorKey:"orderid",
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
    }
    
]