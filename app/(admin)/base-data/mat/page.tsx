import prisma from '@/lib/prisma'
import { MatTable } from './table'

export default async function Page() {
  const mats = await prisma.mat.findMany()

  return <MatTable mats={mats} />
}
