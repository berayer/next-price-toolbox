import prisma from '@/lib/prisma'
import { MatTable } from './_components/table'

export default async function Page() {
  const mats = await prisma.mat.findMany()

  return (
    <div className="p-4">
      <MatTable mats={mats} />
    </div>
  )
}
