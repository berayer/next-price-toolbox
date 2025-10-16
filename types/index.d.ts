interface BoardTableData {
  id: string
  mat: import('@/generated/prisma').Mat
  spec: string
  thick: string
  minDog?: string
  prices: Map<number, number>
}
