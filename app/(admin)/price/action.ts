'use server'

import { Color } from '@/generated/prisma'
import prisma from '@/lib/prisma'

export async function saveNewPrice(colors: Color[], boardPrices: BoardTableData[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  for (const bp of boardPrices) {
    for (const sc of colors) {
      // 检测板材是否存在

      let matColor = await prisma.matColor.findFirst({
        where: {
          colorId: sc.id,
          matId: bp.mat.id,
          spec: Number(bp.spec),
          thick: Number(bp.thick),
        },
      })

      // 板材如果不存在创建新板材
      if (!matColor) {
        console.log('创建新板材')
        matColor = await prisma.matColor.create({
          data: {
            colorId: sc.id,
            matId: bp.mat.id,
            spec: Number(bp.spec),
            thick: Number(bp.thick),
          },
        })
      }

      bp.p1 && (await updatePrice(1, matColor.id, bp.p1))
      bp.p2 && (await updatePrice(2, matColor.id, bp.p2))
      bp.p3 && (await updatePrice(3, matColor.id, bp.p3))
      bp.p4 && (await updatePrice(4, matColor.id, bp.p4))
    }
  }
}

export async function updatePrice(priceTypeId: number, matColorId: number, price: number) {
  const oldPrice = await prisma.matColorPrice.findFirst({
    where: {
      matColorId,
      priceTypeId,
    },
  })

  if (!oldPrice) {
    await prisma.matColorPrice.create({
      data: {
        matColorId,
        priceTypeId,
        price,
      },
    })
  } else {
    if (oldPrice.price === price) return

    await prisma.matColorPrice.update({
      where: {
        id: oldPrice.id,
      },
      data: {
        price,
      },
    })
    // 将所有的旧refId删除
    if (oldPrice.refId) {
      await prisma.matColorPrice.updateMany({
        where: {
          refId: oldPrice.refId,
        },
        data: {
          refId: null,
        },
      })
    }
  }
}
