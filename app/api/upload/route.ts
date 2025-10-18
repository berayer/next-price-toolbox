import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import prisma from '@/lib/prisma'
import { mkdirSync } from 'node:fs'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const FILE_UPLOAD_PATH = './attachment'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: '文件不存在' })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: '文件大小超过 100MB' })
  }

  // 计算文件HASH
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const md5 = createHash('md5').update(buffer).digest('hex')

  // 判断文件是否已经存在
  const dbFile = await prisma.attachment.findUnique({ where: { hash: md5 } })
  if (dbFile) {
    console.log('文件已经存在')
    return NextResponse.json({ id: dbFile.id, url: dbFile.url, name: dbFile.fileName })
  }

  // 保存文件并且记录
  // const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  // const safeFilename = `${md5}.${ext}`
  const filePath = join(process.cwd(), FILE_UPLOAD_PATH, md5)
  mkdirSync(join(process.cwd(), FILE_UPLOAD_PATH), { recursive: true })
  await writeFile(filePath, buffer)
  const result = await prisma.attachment.create({
    data: {
      hash: md5,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: `/attachment/${md5}`,
    },
  })
  console.log(result)

  return NextResponse.json({ id: result.id, url: result.url, name: result.fileName })
}
