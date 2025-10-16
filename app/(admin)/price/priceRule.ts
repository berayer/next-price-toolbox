import { createRule, fnc } from '@/lib/imes'
import { Color } from '@/generated/prisma'

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

/**
 * PT91系列
 * @param ruleId
 * @param rule
 * @param colors
 */
async function rule5(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)
  await topGroup.rule(fnc('名称', '包含', 'PT91'))
  await topGroup.rule(fnc('基材', '等于', rule.mat))

  const group = await topGroup.group('或者')
  for (const color of colors) {
    await group.rule(fnc('花色', '等于', color.fullName))
  }
}

/**
 * KM34-1系列
 * @param ruleId
 * @param rule
 * @param colors
 */
async function rule6(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)

  const nameGroup = await topGroup.group('或者')
  await nameGroup.rule(fnc('名称', '包含', 'KM34_1'))
  await nameGroup.rule(fnc('名称', '包含', 'PT80_1'))

  const groupInMat = await topGroup.group('包含物料')
  const matGroup = await groupInMat.group('并且')
  await matGroup.rule(fnc('基材', '等于', rule.mat))

  const groupIn = await topGroup.group('包含物料')
  const colorGroup = await groupIn.group('或者')

  for (const color of colors) {
    await colorGroup.rule(fnc('花色', '等于', color.fullName))
  }
}

/**
 * KM34A-1系列
 * @param ruleId
 * @param rule
 * @param colors
 */
async function rule7(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)

  const nameGroup = await topGroup.group('或者')
  await nameGroup.rule(fnc('名称', '包含', 'KM34A_1'))
  await nameGroup.rule(fnc('名称', '包含', 'PT80A_1'))

  const groupInMat = await topGroup.group('包含物料')
  const matGroup = await groupInMat.group('并且')
  await matGroup.rule(fnc('基材', '等于', rule.mat))

  const groupIn = await topGroup.group('包含物料')
  const colorGroup = await groupIn.group('或者')

  for (const color of colors) {
    await colorGroup.rule(fnc('花色', '等于', color.fullName))
  }
}

/**
 * KM34B-1系列
 * @param ruleId
 * @param rule
 * @param colors
 */
async function rule8(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)

  const nameGroup = await topGroup.group('或者')
  await nameGroup.rule(fnc('名称', '包含', 'KM34B_1'))
  await nameGroup.rule(fnc('名称', '包含', 'PT80B_1'))

  const groupInMat = await topGroup.group('包含物料')
  const matGroup = await groupInMat.group('并且')
  await matGroup.rule(fnc('基材', '等于', rule.mat))

  const groupIn = await topGroup.group('包含物料')
  const colorGroup = await groupIn.group('或者')

  for (const color of colors) {
    await colorGroup.rule(fnc('花色', '等于', color.fullName))
  }
}

/**
 * KM34C-1系列
 * @param ruleId
 * @param rule
 * @param colors
 */
async function rule9(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)

  const nameGroup = await topGroup.group('或者')
  await nameGroup.rule(fnc('名称', '包含', 'KM34C_1'))
  await nameGroup.rule(fnc('名称', '包含', 'PT80C_1'))

  const groupInMat = await topGroup.group('包含物料')
  const matGroup = await groupInMat.group('并且')
  await matGroup.rule(fnc('基材', '等于', rule.mat))

  const groupInColor = await topGroup.group('包含物料')
  const colorGroup = await groupInColor.group('或者')

  for (const color of colors) {
    await colorGroup.rule(fnc('花色', '等于', color.fullName))
  }
}

/**
 * KM43系列
 * @param ruleId
 * @param rule
 * @param colors
 */
async function rule10(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)

  await topGroup.rule(fnc('厚', '等于', rule.thick))
  await topGroup.rule(fnc('基材', '等于', rule.mat))

  const nameGroup = await topGroup.group('或者')
  await nameGroup.rule(fnc('名称', '包含', 'KM43_1'))
  await nameGroup.rule(fnc('名称', '包含', 'KM43A_1'))
  await nameGroup.rule(fnc('名称', '包含', 'KMC43_1'))
  await nameGroup.rule(fnc('名称', '包含', 'KMC43A_1'))

  const colorGroup = await topGroup.group('或者')

  for (const color of colors) {
    await colorGroup.rule(fnc('花色', '等于', color.fullName))
  }
}

/**
 * KM431系列
 * @param ruleId
 * @param rule
 * @param colors
 */
async function rule11(ruleId: number, rule: Rule, colors: Color[]) {
  const topGroup = await createRule('并且', ruleId)

  await topGroup.rule(fnc('厚', '等于', rule.thick))
  await topGroup.rule(fnc('基材', '等于', rule.mat))

  const nameGroup = await topGroup.group('或者')
  await nameGroup.rule(fnc('名称', '包含', 'KM43[123]_1'))
  await nameGroup.rule(fnc('名称', '包含', 'KM43[123]A_1'))
  await nameGroup.rule(fnc('名称', '包含', 'KMC43[123]_1'))
  await nameGroup.rule(fnc('名称', '包含', 'KMC43[123]A_1'))

  const colorGroup = await topGroup.group('或者')

  for (const color of colors) {
    await colorGroup.rule(fnc('花色', '等于', color.fullName))
  }
}

const ruleTemplate: {
  [key: number]: (a: number, b: Rule, c: Color[]) => Promise<void>
} = {
  1: rule1,
  2: rule2,
  3: rule3,
  4: rule4,
  5: rule5,
  6: rule6,
  7: rule7,
  8: rule8,
  9: rule9,
  10: rule10,
  11: rule11,
}

export { ruleTemplate }
