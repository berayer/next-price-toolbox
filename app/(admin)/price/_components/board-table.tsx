import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Mat } from '@/generated/prisma'
import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

interface BoardTableProps {
  mats: Mat[]
  boardPrices: BoardTableData[]
  setBoardPrices: (boardPrices: BoardTableData[]) => void
  setCurBoard: (curBoard: BoardTableData | null) => void
}

const columnHelper = createColumnHelper<BoardTableData>()

export function BoardTable({ mats, boardPrices, setBoardPrices, setCurBoard }: BoardTableProps) {
  const mat = useRef<Mat | null>(null)
  const specRef = useRef<HTMLInputElement | null>(null)
  const thickRef = useRef<HTMLInputElement | null>(null)
  const minDogRef = useRef<HTMLInputElement | null>(null)

  const columns = [
    columnHelper.display({
      id: 'selected',
      size: 35,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} aria-readonly />,
    }),
    columnHelper.accessor('mat.name', { header: '基材' }),
    columnHelper.accessor('thick', { header: '厚度' }),
    columnHelper.accessor('spec', { header: '规格' }),
    columnHelper.accessor('minDog', { header: '最小计价量' }),
    columnHelper.display({
      id: 'action',
      header: '操作',
      cell: ({ row }) => (
        <Button
          variant="link"
          className="text-destructive h-6"
          onClick={(e) => {
            e.stopPropagation()
            // 如果当前行已经被选中,则删除当前行
            row.getIsSelected() && setCurBoard(null)
            setBoardPrices(boardPrices.filter((item) => item.id !== row.original.id))
          }}
        >
          删除
        </Button>
      ),
    }),
  ]

  const table = useReactTable({
    data: boardPrices,
    columns,
    // 索引ID, 不要使用index
    getRowId: (row) => row.id,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    // onRowSelectionChange: setRowSelection,
  })

  function handleAddBoard() {
    if (mat.current && thickRef.current?.value && specRef.current?.value) {
      // 解决厚度为09的问题
      const thick = Number(thickRef.current.value)
      const key = mat.current.code + thick + specRef.current.value + minDogRef.current?.value
      if (boardPrices.some((it) => it.id === key)) {
        toast.error('已存在该板件!!!')
        return
      }
      // console.log(minDogRef.current?.value)
      setBoardPrices([
        ...boardPrices,
        {
          id: key,
          mat: mat.current,
          thick: thick.toString(),
          spec: specRef.current.value,
          minDog: minDogRef.current?.value,
          prices: new Map<number, number>(),
        },
      ])
    } else {
      toast.error('板件信息不完整!!!')
    }
  }

  return (
    <div className="flex w-[600px] flex-col gap-2">
      <form className="flex items-center gap-2">
        <Label>基材</Label>
        <Select onValueChange={(value) => (mat.current = mats.find((it) => it.id === Number(value)) || null)}>
          <SelectTrigger className="w-[100px]">
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
        <Input
          ref={thickRef}
          type="number"
          min={3}
          max={100}
          className="w-16"
          spellCheck={false}
          autoComplete="off"
          required
        />
        <Label>规格</Label>
        <Input
          ref={specRef}
          type="number"
          className="w-16"
          min={2400}
          max={2800}
          spellCheck={false}
          autoComplete="off"
          required
        />
        <Label>最小计价量</Label>
        <Input
          ref={minDogRef}
          type="number"
          min={0}
          max={3}
          step={0.001}
          className="w-16"
          spellCheck={false}
          autoComplete="off"
        />
        <Button formAction={handleAddBoard}>添加</Button>
      </form>
      <div className="overflow-hidden border">
        <Table>
          <TableHeader className="bg-muted">
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
                    setCurBoard(row.original)
                    // console.log(row.original)
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
