import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Mat } from '@/generated/prisma'
import { useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { sortBy } from 'es-toolkit'

interface BoardTableProps {
  mats: Mat[]
  boardPrices: BoardTableData[]
  setBoardPrices: (boardPrices: BoardTableData[]) => void
}

export function BoardTable({ mats, boardPrices, setBoardPrices }: BoardTableProps) {
  const mat = useRef<Mat | null>(null)
  const specRef = useRef<HTMLInputElement | null>(null)
  const thickRef = useRef<HTMLInputElement | null>(null)

  const sortBoardPrices = sortBy(boardPrices, ['spec', 'thick'])

  function handleAddBoard() {
    if (mat.current && thickRef.current?.value && specRef.current?.value) {
      const key = mat.current.code + thickRef.current.value + specRef.current.value
      if (boardPrices.some((it) => it.id === key)) {
        toast.error('已存在该板件!!!')
        return
      }
      setBoardPrices([
        ...boardPrices,
        {
          id: key,
          mat: mat.current,
          thick: thickRef.current.value,
          spec: specRef.current.value,
        },
      ])
    } else {
      toast.error('板件信息不完整!!!')
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        <Label>基材</Label>
        <Select onValueChange={(value) => (mat.current = mats.find((it) => it.id === Number(value)) || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {mats.map((it) => (
                <SelectItem key={it.id} value={String(it.id)}>
                  {it.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Label>厚度</Label>
        <Input ref={thickRef} className="w-auto" spellCheck={false} autoComplete="off" />
        <Label>规格</Label>
        <Input ref={specRef} className="w-auto" spellCheck={false} autoComplete="off" />
        <Button onClick={handleAddBoard}>添加</Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            <TableRow>
              <TableHead>基材</TableHead>
              <TableHead>规格</TableHead>
              <TableHead>厚度</TableHead>
              <TableHead className="text-center">柜身</TableHead>
              <TableHead className="text-center">延米</TableHead>
              <TableHead className="text-center">门抽</TableHead>
              <TableHead className="text-center">护墙</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortBoardPrices.map((it) => (
              <TableRow key={it.id}>
                <TableCell className="py-0">{it.mat.name}</TableCell>
                <TableCell className="py-0">{it.spec}</TableCell>
                <TableCell className="py-0">{it.thick}</TableCell>

                <TableCell className="w-[100px] py-0">
                  <Input
                    type="number"
                    className="h-6 rounded-none border-none text-center shadow-none"
                    onChange={(e) => (it.p1 = Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-[100px] py-0">
                  <Input
                    type="number"
                    className="h-6 rounded-none border-none text-center shadow-none"
                    onChange={(e) => (it.p2 = Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-[100px] py-0">
                  <Input
                    type="number"
                    className="h-6 rounded-none border-none text-center shadow-none"
                    onChange={(e) => (it.p3 = Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-[100px] py-0">
                  <Input
                    type="number"
                    className="h-6 rounded-none border-none text-center shadow-none"
                    onChange={(e) => (it.p4 = Number(e.target.value))}
                  />
                </TableCell>

                <TableCell className="py-0">
                  <Button
                    variant="link"
                    className="text-destructive"
                    size="sm"
                    onClick={() => {
                      setBoardPrices(boardPrices.filter((color) => color.id !== it.id))
                    }}
                  >
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {boardPrices.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-16 text-center">
                  无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
