import prisma from '@/lib/prisma'
import { ColorTable } from './_components/table'

export default async function Page() {
  const colors = await prisma.color.findMany()

  return (
    <div className="p-4">
      <ColorTable colors={colors} />
    </div>
  )
}
