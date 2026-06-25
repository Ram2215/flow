import {ColumnDef,flexRender,getCoreRowModel,useReactTable} from "@tanstack/react-table";
import{Table,TableBody,TableHeader,TableHead,TableRow,TableCell} from "@/components/ui/table"

interface Datatableprops<Tdata,Tvalue>{
    columns:ColumnDef<Tdata,Tvalue>[]
    data:Tdata[];
}

export function DataTable<Tdata,Tvalue>({
    columns,
    data,
}:Datatableprops<Tdata,Tvalue>){
    const table=useReactTable({
        data,
        columns,
        getCoreRowModel:getCoreRowModel(),
    });
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
                            <TableRow key={row.id}>
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