'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MatColorPriceType } from '@/generated/prisma'
import { Input } from '@/components/ui/input'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { InfoIcon } from 'lucide-react'

interface PriceTableProps {
  curBoard: BoardTableData | null
  priceTypes: MatColorPriceType[]
}

export function PriceTable({ curBoard, priceTypes }: PriceTableProps) {
  function handleInput(type: number, value: string) {
    if (!value) return
    curBoard!.prices.set(type, Number(value))
  }

  return (
    <div>
      <div className="h-11">
        {!curBoard
          ? '请选择板件'
          : `${curBoard.mat.name}-${curBoard.thick}-${curBoard.spec}${curBoard.minDog ? '\t' + curBoard.minDog : ''}`}
      </div>
      <div className="w-2xs overflow-hidden border">
        <Table key={curBoard?.id}>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-center">报价类型</TableHead>
              <TableHead className="border-l text-center">单价</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!curBoard ? (
              <TableRow>
                <TableCell colSpan={2} className="h-16 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              priceTypes.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="flex items-center gap-2">
                    {it.name}
                    {it.remark && <HoverInfo description={it.remark} />}
                  </TableCell>
                  <TableCell className="border-l">
                    <Input
                      type="number"
                      defaultValue={curBoard.prices.get(it.id)}
                      className="h-6 rounded-none border-none text-center shadow-none"
                      onBlur={(e) => handleInput(it.id, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function HoverInfo({ description }: { description: string }) {
  return (
    <HoverCard openDelay={500} closeDelay={500}>
      <HoverCardTrigger asChild>
        <InfoIcon className="size-4 cursor-pointer" />
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit flex-col gap-1 p-2 text-sm">
        {description.split('/').map((line, idx) => (
          <span key={idx}>{line}</span>
        ))}
      </HoverCardContent>
    </HoverCard>
  )
}
