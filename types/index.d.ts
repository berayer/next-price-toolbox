interface BoardTableData {
  id: string
  mat: import('@/generated/prisma').Mat
  spec: string
  thick: string
  p1?: number
  p2?: number
  p3?: number
  p4?: number
}
