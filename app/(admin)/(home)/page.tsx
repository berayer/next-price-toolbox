import prisma from '@/lib/prisma'
import BoardTable from '@/app/(admin)/(home)/board-table'

export default async function Home() {
  const data = await prisma.matColor.findMany({ include: { mat: true, color: true } })

  return (
    <div className="p-4">
      <BoardTable data={data} />
    </div>
  )
}
