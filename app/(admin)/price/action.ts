'use server'

import { Color } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { groupBy } from 'es-toolkit'
import { close, createPriceRule, deletePriceRule, selectRuleByNameAndPrice } from '@/lib/imes'
import { ruleTemplate } from './priceRule'

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
          minDog: bp.minDog ? Number(bp.minDog) : null,
        },
      })

      // 板材如果不存在创建新板材
      if (!matColor) {
        console.log('创建新板材', bp.mat.name, sc.fullName, bp.thick, bp.spec, bp.minDog)
        matColor = await prisma.matColor.create({
          data: {
            colorId: sc.id,
            matId: bp.mat.id,
            spec: Number(bp.spec),
            thick: Number(bp.thick),
            minDog: bp.minDog ? Number(bp.minDog) : undefined,
          },
        })
      }

      // 更新所有录入的价格
      for (const [k, v] of bp.prices) {
        await updatePrice(k, matColor.id, v)
      }
    }
  }

  await genNewPrice().finally(() => close())
}

async function updatePrice(priceTypeId: number, matColorId: number, price: number) {
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
      // 修改价格需要删除旧的规则
      await deletePriceRule(oldPrice.refId)
      console.log('删除旧的规则', oldPrice.refId)
    }
  }
}

async function genNewPrice() {
  const pce = await prisma.matColorPrice.findMany({
    where: {
      refId: null,
    },
    include: {
      matColor: true,
    },
  })

  const result = groupBy(
    pce,
    (it) =>
      `${it.matColor.matId}:${it.matColor.thick}:${it.matColor.spec}:${it.priceTypeId}:${it.price}:${it.matColor.minDog}`,
  )
  // console.log(Object.keys(result).length)

  const mats = await prisma.mat.findMany()
  const colors = await prisma.color.findMany()
  const priceTypes = await prisma.matColorPriceType.findMany()

  for (const it of Object.values(result)) {
    const mat = mats.find((m) => m.id === it[0].matColor.matId)!
    const spec = it[0].matColor.spec
    const thick = it[0].matColor.thick
    const priceType = priceTypes.find((pt) => pt.id === it[0].priceTypeId)!
    const price = it[0].price
    const cls = it.map((f) => {
      return colors.find((c) => c.id === f.matColor.colorId)!
    })

    // 厚度最少两位,不够前面补充0,方便对齐
    const name = `${priceType.name}-${mat.name}-${thick.toString().padStart(2, '0')}-${spec}`

    const ruleId = await selectRuleByNameAndPrice(priceType.ruleTypeId, name, price)
    // console.log('是否存在', ruleId)
    // 新增价格需要删除相同的规则
    if (ruleId) {
      await deletePriceRule(ruleId)
      const oldColors = await prisma.matColorPrice.findMany({
        where: {
          refId: ruleId,
        },
        include: {
          matColor: true,
        },
      })
      // 需要将原先旧的花色也添加进来
      const oCls = oldColors.map((f) => {
        return colors.find((c) => c.id === f.matColor.colorId)!
      })

      cls.push(...oCls)
    }

    console.log(ruleId ? '更新' : '创建', name, price)

    const refId = await createPriceRule({
      PriceSolutionId: 23,
      Name: name,
      PriceSolutionRuleTypeId: priceType.ruleTypeId,
      PriceMode: priceType.priceModel as any,
      Price: price,
      Unit: priceType.unit as any,
      MatchPriority: priceType.priority + (spec > 2700 ? 1 : 0),
      Expression: priceType.expression ?? undefined,
    })

    // 将所有的RefId绑定到价格上
    for (const item of it) {
      await prisma.matColorPrice.update({
        where: {
          id: item.id,
        },
        data: {
          refId,
        },
      })
    }

    // 特殊规则, 颗粒板的9厚度板件，基材叫免漆板，规则名称还是颗粒板
    const matName = mat.code == '2' && thick == 9 ? '免漆板' : mat.name

    const ruleInfo = {
      spec,
      thick,
      mat: matName,
      price,
    }

    // 根据规则模板插入SearchFilter规则
    if (ruleTemplate[priceType.id]) {
      await ruleTemplate[priceType.id](refId, ruleInfo, cls)
    } else {
      console.error('未定义的报价类型', priceType.id)
    }
  }
}
