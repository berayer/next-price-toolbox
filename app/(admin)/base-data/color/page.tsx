import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { AddDialogButton } from './addDialogButton'
import { DeleteButton } from './deleteButton'
export default async function Page() {
  const colors = await prisma.color.findMany()

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <AddDialogButton />
      </div>
      <Table className="border">
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[50px] text-center">序号</TableHead>
            <TableHead>编码</TableHead>
            <TableHead>花色</TableHead>
            <TableHead>全称</TableHead>
            <TableHead className="w-[200px]">创建时间</TableHead>
            <TableHead className="w-[200px]">更新时间</TableHead>
            <TableHead className="w-[200px] text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((color, idx) => (
            <TableRow key={color.id}>
              <TableCell className="w-[50px] text-center">{idx + 1}</TableCell>
              <TableCell>{color.code}</TableCell>
              <TableCell>{color.name}</TableCell>
              <TableCell>{color.fullName}</TableCell>
              <TableCell className="w-[200px]">{formatDate(color.createdAt)}</TableCell>
              <TableCell className="w-[200px]">{formatDate(color.updatedAt)}</TableCell>
              <TableCell className="w-[200px] text-center">
                <DeleteButton item={color} />
              </TableCell>
            </TableRow>
          ))}
          {colors.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
