'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Mat } from '@/generated/prisma'
import { formatDate } from '@/lib/utils'
import { AddDialogButton } from './addDialogButton'

export function MatTable({ mats }: { mats: Mat[] }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        {/* todo : 添加按钮 */}
        <AddDialogButton />
      </div>
      <Table className="border">
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[50px] text-center">序号</TableHead>
            <TableHead className="text-center">名称</TableHead>
            <TableHead className="text-center">编码</TableHead>
            <TableHead className="w-[200px]">创建时间</TableHead>
            <TableHead className="w-[200px]">更新时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mats.map((mat, idx) => (
            <TableRow key={mat.id}>
              <TableCell className="w-[50px] text-center">{idx + 1}</TableCell>
              <TableCell className="text-center">{mat.name}</TableCell>
              <TableCell className="text-center">{mat.code}</TableCell>
              <TableCell className="w-[200px]">{formatDate(mat.createdAt)}</TableCell>
              <TableCell className="w-[200px]">{formatDate(mat.updatedAt)}</TableCell>
            </TableRow>
          ))}
          {mats.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
