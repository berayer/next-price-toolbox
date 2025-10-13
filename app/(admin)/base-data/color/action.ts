'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createColor(_: any, formData: FormData) {
  // 模拟异步操作
  // await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get('name') as string
  const code = formData.get('code') as string

  if (!name || !code) {
    return { error: '名称和编码不能为空' }
  }

  const extCode = await prisma.color.findFirst({
    where: {
      code: code.trim(),
    },
  })

  if (extCode) {
    return { error: '编码已存在' }
  }

  await prisma.color.create({
    data: {
      name: name.trim(),
      code: code.trim(),
      fullName: name.trim() + code.trim(),
    },
  })

  // 重新加载页面
  revalidatePath('/base-data/color')
  return { success: true }
}

export async function deleteColor(_: any, formData: FormData) {
  const id = Number(formData.get('id'))

  await prisma.color.delete({
    where: {
      id: id,
    },
  })

  // 重新加载页面
  revalidatePath('/base-data/color')
  return { success: true }
}
