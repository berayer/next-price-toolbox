'use client'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { XIcon } from 'lucide-react'
import type { Color } from '@/generated/prisma'
import { useState } from 'react'
import { differenceWith } from 'es-toolkit'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ColorSelectProps {
  colors: Color[]
  selectColors: Color[]
  setSelectedColor: (color: Color[]) => void
}

export function ColorSelect({ colors, selectColors, setSelectedColor }: ColorSelectProps) {
  const [value, setValue] = useState('')

  const options = !value
    ? []
    : differenceWith(colors, selectColors, (a, b) => a.id === b.id)
        .filter((it) => it.fullName.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.code.localeCompare(b.code))

  // 处理输入框回车事件
  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (options.length === 1) {
        setSelectedColor([...selectColors, options[0]])
        setValue('')
      }
    }
  }

  // 排序
  selectColors.sort((a, b) => a.code.localeCompare(b.code))

  return (
    <div className="w-xs space-y-2">
      <div className="flex gap-2">
        <div className="relative">
          <InputGroup className="w-[250px]">
            <InputGroupInput
              placeholder="请选择花色"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyUp={handleEnter}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" className={cn(!value && 'hidden')} onClick={() => setValue('')}>
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {value && (
            <Command className="absolute top-12 z-10 h-fit max-h-[300px] rounded-md border shadow-md outline-hidden">
              <CommandList>
                <CommandEmpty>无数据</CommandEmpty>
                <CommandGroup>
                  {options.map((color) => (
                    <CommandItem key={color.id} onSelect={() => setSelectedColor([...selectColors, color])}>
                      {`${color.code}\t${color.name}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </div>
        <Button variant="outline" disabled={!selectColors.length} onClick={() => setSelectedColor([])}>
          清除
        </Button>
      </div>
      {/* 选择花色展示表格 */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            <TableRow>
              <TableHead>序号</TableHead>
              <TableHead>编码</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectColors.map((it, idx) => (
              <TableRow key={it.id}>
                <TableCell className="py-0">{idx + 1}</TableCell>
                <TableCell className="py-0">{it.code}</TableCell>
                <TableCell className="py-0">{it.name}</TableCell>
                <TableCell className="py-0">
                  <Button
                    variant="link"
                    className="text-destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedColor(selectColors.filter((color) => color.id !== it.id))
                    }}
                  >
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {selectColors.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center">
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
