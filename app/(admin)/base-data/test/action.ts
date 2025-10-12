'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
export async function createNewMat(_: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const name = formData.get('name') as string
  const code = formData.get('code') as string

  if (!name || !code) {
    return { error: 'Name and code are required' }
  }

  await prisma.mat.create({ data: { name, code } })
  revalidatePath('/data-base/test')
  return { success: true }
}

export async function deleteMat(_: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const id = Number(formData.get('id'))

  if (isNaN(id)) {
    return { error: 'Invalid ID' }
  }

  try {
    await prisma.mat.delete({ where: { id } })
    revalidatePath('/data-base/test')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete item' }
  }
}
