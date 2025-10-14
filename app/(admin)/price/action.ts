'use server'

import { Color } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { groupBy } from 'es-toolkit'
import { createPriceRule, createRule, fnc, selectRuleByNameAndPrice, close, deletePriceRule } from '@/lib/imes'

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
    (it) => `${it.matColor.matId}:${it.matColor.thick}:${it.matColor.thick}:${it.priceTypeId}:${it.price}`,
  )
  console.log(Object.keys(result).length)

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

    const name = `${priceType.name}-${mat.name}-${thick}-${spec}`

    const ruleId = await selectRuleByNameAndPrice(188, name, price)
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
      PriceSolutionId: 4,
      Name: name,
      PriceSolutionRuleTypeId: 188,
      PriceMode: priceType.id == 2 ? '按表达式' : '按面积',
      Price: price,
      Unit: priceType.id == 2 ? '米' : '平方',
      MatchPriority: 100 + (spec > 2700 ? 10 : 0) + (priceType.id == 2 ? -50 : 0),
      Expression: `${priceType.id == 2 ? EXP : ''}`,
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

    const ruleInfo: Rule = {
      spec,
      thick,
      mat: mat.name,
      price,
    }

    switch (priceType.id) {
      case 1:
        await rule1(refId, ruleInfo, cls)
        break
      case 2:
        await rule2(refId, ruleInfo, cls)
        break
      case 3:
        await rule3(refId, ruleInfo, cls)
        break
      case 4:
        await rule4(refId, ruleInfo, cls)
        break
      default:
        console.log('未知的规则类型')
        break
    }
  }
}

const EXP = `if (@宽度>@长度)

  set @报价量=@宽度/1000.0
else
  set @报价量=@长度/1000.0`

interface Rule {
  spec: number
  thick: number
  mat: string
  price: number
}

/** 平方 */
async function rule1(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)
  await topGroup.rule(fnc('厚', '等于', rule.thick))
  await topGroup.rule(fnc('基材', '等于', rule.mat))
  await topGroup.rule(fnc('长', '小于等于', rule.spec - 30))

  const group1 = await topGroup.group('或者')
  await group1.rule(fnc('分类', '前包含', 'GT'))
  await group1.rule(fnc('分类', '前包含', 'YM_XB_CG'))

  const group2 = await topGroup.group('或者')
  for (const color of colors) {
    await group2.rule(fnc('花色', '等于', color.fullName))
  }
}

/** 延米 */
async function rule2(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)
  await topGroup.rule(fnc('厚', '等于', rule.thick))
  await topGroup.rule(fnc('基材', '等于', rule.mat))
  await topGroup.rule(fnc('长', '小于等于', rule.spec - 30))

  const group1 = await topGroup.group('或者')
  await group1.rule(fnc('分类', '前包含', 'GT'))

  const group3 = await topGroup.group('或者')
  await group3.rule(fnc('长', '小于等于', 70))
  await group3.rule(fnc('宽', '小于等于', 70))

  const group2 = await topGroup.group('或者')
  for (const color of colors) {
    await group2.rule(fnc('花色', '等于', color.fullName))
  }
}

/** 门抽 */
async function rule3(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)
  await topGroup.rule(fnc('厚', '等于', rule.thick))
  await topGroup.rule(fnc('基材', '等于', rule.mat))
  await topGroup.rule(fnc('长', '小于等于', rule.spec - 30))

  const group1 = await topGroup.group('或者')
  await group1.rule(fnc('分类', '等于', 'KM_D_PBM'))
  await group1.rule(fnc('分类', '前包含', 'KM_D_X22'))
  await group1.rule(fnc('名称', '包含', 'KM56'))
  await group1.rule(fnc('名称', '包含', 'KMC56'))

  const group2 = await topGroup.group('或者')
  for (const color of colors) {
    await group2.rule(fnc('花色', '等于', color.fullName))
  }
}

/** 护墙 */
async function rule4(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)
  await topGroup.rule(fnc('厚', '等于', rule.thick))
  await topGroup.rule(fnc('基材', '等于', rule.mat))
  await topGroup.rule(fnc('长', '小于等于', rule.spec - 30))

  const group1 = await topGroup.group('或者')
  await group1.rule(fnc('编码', '等于', 'HQ_Bao'))
  await group1.rule(fnc('编码', '等于', 'HQ_Hou'))

  const group2 = await topGroup.group('或者')
  for (const color of colors) {
    await group2.rule(fnc('花色', '等于', color.fullName))
  }
}
