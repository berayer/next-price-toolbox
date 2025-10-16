'use client'

import { ColorSelect } from './color-select'
import type { Color, Mat, MatColorPriceType } from '@/generated/prisma'
import { useState } from 'react'
import { BoardTable } from './board-table'
import { Button } from '@/components/ui/button'
import { saveNewPrice } from '../action'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { PriceTable } from './price-table'

interface MainPanelProps {
  colors: Color[]
  mats: Mat[]
  priceTypes: MatColorPriceType[]
}

export function MainPanel({ colors, mats, priceTypes }: MainPanelProps) {
  const [selectColors, setSelectedColor] = useState<Color[]>([])
  const [boardPrices, setBoardPrices] = useState<BoardTableData[]>([])
  const [loading, setLoading] = useState(false)
  const [curBoard, setCurBoard] = useState<BoardTableData | null>(null)

  async function handSave() {
    console.log(selectColors)
    console.log(boardPrices)

    if (!selectColors.length || !boardPrices.length) {
      return
    }

    setLoading(true)
    await saveNewPrice(selectColors, boardPrices)
    toast.success('保存成功')
    setSelectedColor([])
    setBoardPrices([])
    setCurBoard(null)
    setLoading(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex">
        <Button onClick={handSave} disabled={loading}>
          {loading && <Spinner />}应用
        </Button>
      </div>
      <div className="flex h-full gap-4">
        {/*花色选择器*/}
        <ColorSelect {...{ colors, selectColors, setSelectedColor }} />
        {/*板材选择器*/}
        <BoardTable {...{ mats, boardPrices, setBoardPrices, setCurBoard }} />
        {/*价格录入组件*/}
        <PriceTable {...{ curBoard, priceTypes }} />
      </div>
    </div>
  )
}
