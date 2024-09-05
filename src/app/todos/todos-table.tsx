'use client'
import { Button } from "@/components/ui/button"
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
import { ViewIcon } from "lucide-react"

export function TodosTable({data, callback} : {data: any, callback: any}) {
  return (
    <div className="w-1/2 mt-0.5 border rounded-md">
      <Table>
        <TableCaption>任务列表</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>用户ID</TableHead>
            <TableHead>任务</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="w-1/6" >操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.user_id}</TableCell>
              <TableCell>{c.task}</TableCell>
              <TableCell>{c.is_complete ? "Completed" : "Pending"}</TableCell>
              <TableCell>
                <Button variant={'ghost'} size="icon" onClick={() => callback(c.id)}>
                 <ViewIcon className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
          : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )
        }
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  )
}

