'use client'

import { ColorSelect } from './color-select'
import type { Color, Mat } from '@/generated/prisma'
import { useState } from 'react'
import { BoardTable } from './board-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { saveNewPrice } from '../action'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

export function MainPanel({ colors, mats }: { colors: Color[]; mats: Mat[] }) {
  const [selectColors, setSelectedColor] = useState<Color[]>([])
  const [boardPrices, setBoardPrices] = useState<BoardTableData[]>([])
  const [loading, setLoading] = useState(false)

  async function handSave() {
    console.log(selectColors)
    console.log(boardPrices)

    if (!selectColors.length || !boardPrices.length) {
      return
    }

    setLoading(true)
    await saveNewPrice(selectColors, boardPrices)
    toast.success('保存成功')
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex">
        <Button onClick={handSave} disabled={loading}>
          {loading && <Spinner />}应用
        </Button>
      </div>
      <div className="flex gap-4">
        <ColorSelect {...{ colors, selectColors, setSelectedColor }} />
        <Separator orientation="vertical" />
        <BoardTable {...{ mats, boardPrices, setBoardPrices }} />
      </div>
    </div>
  )
}
