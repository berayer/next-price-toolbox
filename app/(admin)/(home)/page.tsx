import prisma from '@/lib/prisma'
import NTable from '@/components/custom/n-table'
import { createColumnHelper } from '@tanstack/react-table'
import type { Color, Mat, MatColor } from '@/generated/prisma'
import BoardTable from '@/app/(admin)/(home)/board-table'

export default async function Home() {
  const data = await prisma.matColor.findMany({ include: { mat: true, color: true } })

  return (
    <div className="p-4">
      <BoardTable data={data} />
    </div>
  )
}
