'use server'

import prisma from '@/lib/prisma'

export async function getBoardPriceById(_: any, id: number) {
  return prisma.matColorPrice.findMany({
    where: { matColorId: id },
    select: {
      id: true,
      price: true,
      priceType: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}
