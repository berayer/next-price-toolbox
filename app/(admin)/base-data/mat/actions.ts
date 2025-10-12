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

  return {
    success: true,
  }

  // 重新加载页面
  // redirect('/base-data/mat')
}
