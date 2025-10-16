import prisma from '@/lib/prisma'
import NTable from '@/components/custom/n-table'
import { createColumnHelper } from '@tanstack/react-table'
import type { Color, Mat, MatColor } from '@/generated/prisma'

const columnHelper = createColumnHelper<MatColor & { mat: Mat } & { color: Color }>()

const columns = [
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('mat.name', { header: '材质' }),
  columnHelper.accessor('color.fullName', { header: '颜色' }),
  columnHelper.accessor('thick', { header: '厚度' }),
  columnHelper.accessor('spec', { header: '规格' }),
  columnHelper.accessor('createdAt', { header: '创建时间' }),
]

export default async function Home() {
  const data = await prisma.matColor.findMany({ include: { mat: true, color: true } })

  return (
    <div>
      <NTable data={data} columns={columns} />
    </div>
  )
}
