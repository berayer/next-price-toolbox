import type { config } from 'mssql'
import * as MSSQL from 'mssql'

const sqlConfig: config = {
  server: process.env.IMES_HOST,
  database: process.env.IMES_DATABASE,
  user: process.env.IMES_USER,
  password: process.env.IMES_PASSWORD,
  connectionTimeout: 5000,
  pool: {
    min: 0,
    max: 2,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}
/** 关闭连接池 */
async function close() {
  // @ts-expect-error 关闭所有连接池
  await MSSQL.close()
}
/** 数据插入 */
async function sql_insert(sql: string) {
  // console.log(sql)
  const pool = await MSSQL.connect(sqlConfig)
  const result = await pool.query(sql + `;select @@identity as id`)
  return result.recordset[0].id as number
}
type GroupType = '并且' | '或者' | '包含物料'
const GroupTypeValue = {
  并且: 1,
  或者: 2,
  包含物料: 3,
} as const
/** 插入分组条件 */
async function insert_searchFilter_group(groupType: GroupType, refId: number, pid?: number) {
  const gt = GroupTypeValue[groupType]
  if (!gt) throw new Error('组类型不正确')
  const sql = `insert into A_SearchFilter (ParentId, SearchFilterType, RefId, IsGroup, GroupOperator) values (${
    pid ? pid : null
  }, 2, ${refId}, 1, ${gt});`
  return await sql_insert(sql)
}

type SearchFilter = {
  ParentId: number
  RefId: number
  FieldCaption: string
  FieldName: string
  FieldType: number
  SearchOperator: number
  Value: string
  ValueDisplayText: string
}

async function insert_searchFilter_rule(ru: SearchFilter) {
  const sql = `insert into A_SearchFilter (ParentId, SearchFilterType, RefId, IsGroup, FieldCaption, FieldName, FieldType, SearchOperator, Value, ValueDisplayText) values (${ru.ParentId}, 2, ${ru.RefId}, 0, N'${ru.FieldCaption}', N'${ru.FieldName}', ${ru.FieldType}, ${ru.SearchOperator}, N'${ru.Value}', N'${ru.ValueDisplayText}');`
  return await sql_insert(sql)
}

/** 报价模式 */
const PriceModel = {
  按数量: 1,
  按面积: 2,
  按长度: 3,
  按表达式: 9,
} as const

const Unit = {
  个: '个',
  付: '付',
  件: '件',
  副: '副',
  块: '块',
  套: '套',
  对: '对',
  平方: '平方',
  张: '张',
  扇: '扇',
  支: '支',
  条: '条',
  根: '根',
  片: '片',
  米: '米',
} as const

export type UnitType = keyof typeof Unit

async function createPriceRule(r: PriceSolutionRuleEz) {
  const it: PriceSolutionRule = {
    PriceSolutionId: r.PriceSolutionId,
    Name: r.Name,
    MatchPriority: r.MatchPriority ? r.MatchPriority : 100,
    PriceMode: PriceModel[r.PriceMode],
    Price: r.Price,
    Remark: r.Remark ? r.Remark : '',
    PriceSolutionRuleTypeId: r.PriceSolutionRuleTypeId,
    Unit: Unit[r.Unit],
    MinDosage: r.MinDosage ? r.MinDosage : null,
    Expression: r.Expression ? r.Expression : '',
  }
  return await insert_price_rule(it)
}

type PriceSolutionRuleEz = {
  PriceSolutionId: number
  Name: string
  MatchPriority?: number
  PriceMode: keyof typeof PriceModel
  Price: number
  Remark?: string
  PriceSolutionRuleTypeId: number
  Unit: keyof typeof Unit
  MinDosage?: number
  Expression?: string
}

type PriceSolutionRule = {
  PriceSolutionId: number
  Name: string
  MatchPriority: number
  PriceMode: number
  Price: number
  Remark: string
  PriceSolutionRuleTypeId: number
  Unit: string
  MinDosage: number | null
  Expression: string
}
async function insert_price_rule(ru: PriceSolutionRule) {
  const sql = `insert into A_PriceSolutionRule (PriceSolutionId, Name, MatchPriority, PriceGetWay, PriceMode, Price, Remark, PriceSolutionRuleTypeId, Unit, MinDosage, Expression, CabinetTypeId) values (${
    ru.PriceSolutionId
  }, N'${ru.Name}', ${ru.MatchPriority}, 1, ${ru.PriceMode}, ${ru.Price}, N'${ru.Remark}', ${
    ru.PriceSolutionRuleTypeId
  }, N'${ru.Unit}', ${ru.MinDosage ? ru.MinDosage : null}, N'${ru.Expression}', 0);`
  return await sql_insert(sql)
}

/** 字符串类型 */
const Type1 = {
  等于: { type: 1, val: '' as string },
  不等于: { type: 7, val: '' as string },
  包含: { type: 2, val: '' as string },
  不包含: { type: 8, val: '' as string },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
  前包含: { type: 11, val: '' as string },
  后包含: { type: 12, val: '' as string },
} as const

/** 数字类型 */
const Type3 = {
  等于: { type: 1, val: 0 as number },
  不等于: { type: 7, val: 0 as number },
  大于: { type: 3, val: 0 as number },
  大于等于: { type: 4, val: 0 as number },
  小于: { type: 5, val: 0 as number },
  小于等于: { type: 6, val: 0 as number },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
} as const

/** 订单类型 */
const OrderType = {
  常规单: 1,
  售后增补单: 3,
  样品单: 4,
  物料单: 5,
  工程单: 6,
  饰品单: 7,
  板式配套: 8,
  售后改补单: 9,
  活动家具: 10,
  内部更改单: 11,
} as const
const Type4_OrderType = {
  等于: { type: 1, val: OrderType },
  不等于: { type: 7, val: OrderType },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
} as const

// 是否父级
const IsParent = {
  是: 1,
  否: 0,
} as const
const Type4_IsParent = {
  等于: { type: 1, val: IsParent },
  不等于: { type: 7, val: IsParent },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
} as const

// 计料分类
const SplitType = {
  原单材料: 0,
  柜身: 1,
  五金: 2,
  组件: 3,
  掩门: 4,
  组件门: 5,
  单元柜: 6,
  附加材料: 7,
  移门: 8,
  线条: 9,
  背景板: 10,
  外购: 11,
  配套成品: 12,
} as const
const Type4_SplitType = {
  等于: { type: 1, val: SplitType },
  不等于: { type: 7, val: SplitType },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
} as const

const DealerType = {
  '皇朝定制+经销商': 2,
  拎包项目: 4,
  内部工程: 5,
  内部计划: 6,
  大家居: 7,
  '皇朝定制+整装': 8,
  营销中心: 9,
  内部直营: 10,
  皇朝定制与整装: 11,
  政补资金托管: 12,
} as const

const Type4_DealerType = {
  等于: { type: 1, val: DealerType },
  不等于: { type: 7, val: DealerType },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
} as const

const OrderCategory = {
  家具: 1,
  橱柜: 2,
  木门: 3,
} as const
const Type4_OrderCategory = {
  等于: { type: 1, val: OrderCategory },
  不等于: { type: 7, val: OrderCategory },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
} as const

const PromotionActivity = {
  B0209特价申请折扣: 56,
  B0910特价申请折扣: 57,
  B823自选花色政策申请折扣: 58,
  '2024年“金享品质·满分家': 59,
  B0953特价申请折扣: 60,
  '2024年“焕新家·迎双节”': 61,
  B0993特价申请折扣: 62,
  皇朝定制2025年第一季度政策: 63,
} as const
const Type4_PromotionActivity = {
  等于: { type: 1, val: PromotionActivity },
  不等于: { type: 7, val: PromotionActivity },
  等于空: { type: 9, val: null },
  不等于空: { type: 10, val: null },
} as const

const Field = {
  花色: { caption: '花色', name: 'OGD.Color', type: 1, operator: Type1 },

  长: { caption: '长', name: 'OGD.Length', type: 3, operator: Type3 },

  宽: { caption: '宽', name: 'OGD.Width', type: 3, operator: Type3 },

  计料分类: { caption: '计料分类', name: 'OGD.SplitType', type: 4, operator: Type4_SplitType },

  分类: { caption: '分类', name: 'OGD.TypeName', type: 1, operator: Type1 },

  基材: { caption: '基材', name: 'OGD.MaterialTypeInfo', type: 1, operator: Type1 },

  厚: { caption: '厚', name: 'OGD.Height', type: 3, operator: Type3 },

  名称: { caption: '名称', name: 'OGD.Name', type: 1, operator: Type1 },

  是否父级: { caption: '是否父级', name: 'OGD.IsParent', type: 4, operator: Type4_IsParent },

  五金规格: { caption: '五金规格', name: 'OGD.Spec', type: 1, operator: Type1 },

  编码: { caption: '编码', name: 'OGD.Code', type: 1, operator: Type1 },

  花色2: { caption: '花色2', name: 'OGD.ColorB', type: 1, operator: Type1 },

  订单类型: { caption: '订单类型', name: 'O.OrderType', type: 4, operator: Type4_OrderType },

  信息4: { caption: '信息4', name: 'OGD.Info4', type: 1, operator: Type1 },

  经销商类型: { caption: '经销商类型', name: 'D.DealerTypeId', type: 4, operator: Type4_DealerType },

  信息3: { caption: '信息3', name: 'OGD.Info3', type: 1, operator: Type1 },

  产品类型: { caption: '产品类型', name: 'O.ProductCategoryId', type: 4, operator: Type4_OrderCategory },

  促销活动: { caption: '促销活动', name: 'O.PromotionActivityId', type: 4, operator: Type4_PromotionActivity },

  经销商编码: { caption: '经销商编码', name: 'D.DealerNo', type: 1, operator: Type1 },

  订单号: { caption: '订单号', name: 'O.OrderNo', type: 1, operator: Type1 },
} as const

type FieldType = typeof Field

type FncReturn = {
  FieldCaption: string
  FieldName: string
  FieldType: number
  SearchOperator: number
  Value: string
  ValueDisplayText: string
}
function fnc<K extends keyof FieldType, T extends keyof FieldType[K]['operator']>(
  a: K,
  b: T,
  // @ts-ignore
  c: FieldType[K]['operator'][T]['val'] extends Record<string, any>
    ? // @ts-ignore
      keyof FieldType[K]['operator'][T]['val']
    : // @ts-ignore
      FieldType[K]['operator'][T]['val'],
): FncReturn {
  return {
    FieldCaption: Field[a].caption,
    FieldName: Field[a].name,
    FieldType: Field[a].type,
    // @ts-ignore
    SearchOperator: Field[a].operator[b].type,
    // @ts-ignore
    Value: Field[a].type === 4 ? Field[a].operator[b].val[c] : c,
    ValueDisplayText: (c || '') as string,
  }
}

async function createRule(type: GroupType, refId: number, pid?: number) {
  const groupId = await insert_searchFilter_group(type, refId, pid)

  async function group(tp: GroupType) {
    return await createRule(tp, refId, groupId)
  }

  async function rule(r: FncReturn) {
    const sf: SearchFilter = {
      ParentId: groupId,
      RefId: refId,
      ...r,
    }
    await insert_searchFilter_rule(sf)
  }

  return {
    group,
    rule,
  }
}

async function selectRuleByNameAndPrice(typeId: number, name: string, price: number): Promise<number | undefined> {
  const sql = `select Id from A_PriceSolutionRule where PriceSolutionRuleTypeId = ${typeId} and Name = N'${name}' and Price = ${price};`
  const pool = await MSSQL.connect(sqlConfig)
  const result = (await pool.query(sql)).recordset[0]
  return result?.Id
}

async function deletePriceRule(ruleId: number) {
  const sql = `
  delete from A_PriceSolutionRule where Id = ${ruleId};
  delete from A_SearchFilter where SearchFilterType = 2 and RefId = ${ruleId};
  `
  const pool = await MSSQL.connect(sqlConfig)
  await pool.query(sql)
}

export { createPriceRule, createRule, fnc, close, selectRuleByNameAndPrice, deletePriceRule }

/* Example
async function main() {
  const ruleId = await createPriceRule({
    // 报价方案ID
    PriceSolutionId: 15,
    // 分类目录ID
    PriceSolutionRuleTypeId: 154,
    Name: '平板门-颗粒板',
    Unit: '平方',
    PriceMode: '按面积',
    Price: 120
  })

  const topGroup = await createRule('并且', ruleId)
  await topGroup.rule(fnc('名称', '等于', '平板门'))
  await topGroup.rule(fnc('厚', '等于', 18))
  await topGroup.rule(fnc('计料分类', '等于', '柜身'))

  const group1 = await topGroup.group('或者')
  await group1.rule(fnc('花色', '等于', '暖白801'))

  const group2 = await group1.group('并且')
  await group2.rule(fnc('信息3', '包含', '纯色'))
  await group2.rule(fnc('分类', '前包含', 'KM_D_CG'))
}
*/
