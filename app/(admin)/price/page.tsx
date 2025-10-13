import prisma from '@/lib/prisma'
import { MainPanel } from './_components/main-panel'

export default async function Page() {
  const colors = await prisma.color.findMany()
  const mats = await prisma.mat.findMany()

  return <MainPanel colors={colors} mats={mats} />
}
