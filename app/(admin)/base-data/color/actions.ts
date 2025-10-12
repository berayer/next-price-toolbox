'use server'

import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export async function createPost(prevState: any, formData: FormData) {
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
  redirect('/base-data/color')
}

export async function deletePost(prevState: any, id: number) {
  await prisma.color.delete({
    where: {
      id: id,
    },
  })

  // 重新加载页面
  redirect('/base-data/color')
}
