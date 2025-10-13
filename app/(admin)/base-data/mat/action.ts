'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createNewMat(_: any, formData: FormData) {
  // 模拟异步操作
  // await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get('name') as string
  const code = formData.get('code') as string

  if (!name || !code) {
    return { error: '名称和编码不能为空' }
  }

  const extName = await prisma.mat.findFirst({
    where: {
      name: name.trim(),
    },
  })

  if (extName) {
    return { error: '名称已存在' }
  }

  const extCode = await prisma.mat.findFirst({
    where: {
      code: code.trim(),
    },
  })

  if (extCode) {
    return { error: '编码已存在' }
  }

  await prisma.mat.create({
    data: {
      name: name.trim(),
      code: code.trim(),
    },
  })

  revalidatePath('/data-base/test')

  return {
    success: true,
  }
}

export async function deleteMat(_: any, formData: FormData) {
  // await new Promise((resolve) => setTimeout(resolve, 2000))

  const id = Number(formData.get('id'))

  if (isNaN(id)) {
    return { error: 'ID无效' }
  }

  try {
    await prisma.mat.delete({ where: { id } })
    revalidatePath('/data-base/test')
    return { success: true }
  } catch (error) {
    return { error: '删除失败' }
  }
}
