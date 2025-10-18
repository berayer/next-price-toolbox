'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Color, Mat, MatColor } from '@/generated/prisma'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { formatDate } from '@/lib/utils'
import { startTransition, useActionState, useEffect } from 'react'
import { getBoardPriceById } from '@/app/(admin)/(home)/action'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BoardTableProps {
  data: Array<MatColor & { mat: Mat } & { color: Color }>
}

const columnHelper = createColumnHelper<MatColor & { mat: Mat } & { color: Color }>()

const columns = [
  columnHelper.accessor('mat.name', { header: '材质' }),
  columnHelper.accessor('color.code', { header: '颜色编码' }),
  columnHelper.accessor('color.name', { header: '颜色名称' }),
  columnHelper.accessor('thick', { header: '厚度' }),
  columnHelper.accessor('spec', { header: '规格' }),
  columnHelper.accessor('minDog', { header: '最小计价量' }),
  columnHelper.accessor('createdAt', { header: '创建时间', cell: (info) => formatDate(info.getValue()) }),
]

export default function BoardTable({ data }: BoardTableProps) {
  const [state, invokeAction, _] = useActionState(getBoardPriceById, null)

  useEffect(() => {}, [state])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
  })

  function handleSelect(id: number) {
    startTransition(() => invokeAction(id))
  }

  return (
    <div className="flex gap-4">
      <div>
        <ScrollArea className="max-h-[800px] rounded-md border">
          <Table>
            <TableHeader className="bg-muted sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => {
                      row.toggleSelected(true)
                      handleSelect(row.original.id)
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div>
        <div className="overflow-hidden rounded-md border">
          <Table className="w-2xs">
            <TableHeader>
              <TableRow>
                <TableHead>类型</TableHead>
                <TableHead>单价</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state ? (
                state
                  .sort((a, b) => a.priceType.id - b.priceType.id)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.priceType.name}</TableCell>
                      <TableCell className="border-l">{row.price}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-12 text-center">
                    请选择板材
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
