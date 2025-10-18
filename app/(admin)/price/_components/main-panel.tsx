'use client'

import { ColorSelect } from './color-select'
import type { Color, Mat, MatColorPriceType } from '@/generated/prisma'
import { useRef, useState } from 'react'
import { BoardTable } from './board-table'
import { Button } from '@/components/ui/button'
import { saveNewPrice } from '../action'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { PriceTable } from './price-table'
import { useDrop } from 'ahooks'
import { FileUploadButton } from '@/components/custom/file-upload-button'
import { FileList } from '@/app/(admin)/price/_components/file-list'

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
  const divRef = useRef<HTMLDivElement>(null)
  const [attachment, setAttachment] = useState<IdNameType[]>([])

  async function handSave() {
    if (!selectColors.length || !boardPrices.length) {
      return
    }

    setLoading(true)
    const ids = attachment.map((it) => it.id)
    await saveNewPrice(selectColors, boardPrices, ids)
    toast.success('保存成功')
    setSelectedColor([])
    setBoardPrices([])
    setCurBoard(null)
    setAttachment([])
    setLoading(false)
  }

  async function handleFileUpload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', { method: 'POST', body: formData })
    const { id, name } = await response.json()

    setAttachment((prevState) => {
      if (prevState.some((k) => k.id === id)) return prevState
      return [...prevState, { id, name }]
    })
  }

  useDrop(divRef, {
    onFiles: (files: File[]) => {
      files.forEach(async (file) => {
        await handleFileUpload(file)
      })
    },
  })

  return (
    <div ref={divRef} className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex gap-2">
        <FileList attachment={attachment} setAttachment={setAttachment} />
        <FileUploadButton onFileSelect={handleFileUpload}>上传附件</FileUploadButton>
        <Button onClick={handSave} disabled={loading || attachment.length === 0}>
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
