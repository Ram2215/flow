import {ColumnDef,flexRender,getCoreRowModel,useReactTable} from "@tanstack/react-table";
import{Table,TableBody,TableHeader,TableHead,TableRow,TableCell} from "@/components/ui/table"
import {useRouter} from "next/navigation"

interface Datatableprops<Tdata extends {order_id:string},Tvalue>{
    columns:ColumnDef<Tdata,Tvalue>[]
    data:Tdata[];
}

export function DataTable<Tdata extends {order_id:string},Tvalue>({
    columns,
    data,
}:Datatableprops<Tdata,Tvalue>){
    const table=useReactTable({
        data,
        columns,
        getCoreRowModel:getCoreRowModel(),
    });
    const router=useRouter()
    return(
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                   {table.getHeaderGroups().map((headerGroup)=>( 
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header)=>(
                            <TableHead key={header.id} className="text-white">
                                {header.isPlaceholder? null : flexRender(header.column.columnDef.header,
                                    header.getContext()
                                )
                                }
                            </TableHead>

                        ))}
                    </TableRow>
                   ))} 
                    </TableHeader> 
                    <TableBody>
                      {table.getRowModel().rows.length?(
                        table.getRowModel().rows.map((row)=>(
                            <TableRow key={row.id} className="cursor-pointer hover:bg-zinc-800/50"
                             onClick={()=>router.push(`orders/create_order?id=${row.original.order_id}`)}
                             >
                                {row.getVisibleCells().map((cell)=>
                                <TableCell key={cell.id} className="text-white">
                                   {flexRender(cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                   
                                </TableCell>
                            )}
                            </TableRow>
                        ))
                    ):(
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center h-20 text-white">
                              No results
                            </TableCell>
                        </TableRow>
                    )
                      }
                    </TableBody>
            </Table>

        </div>
    )
}