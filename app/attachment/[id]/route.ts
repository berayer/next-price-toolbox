import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createReadStream } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-static'

export async function GET(_req: NextRequest, ctx: RouteContext<'/attachment/[id]'>) {
  const { id } = await ctx.params
  const file = await prisma.attachment.findUnique({ where: { hash: id } })

  if (!file) {
    return NextResponse.json({ status: 404, statusText: 'Not Found' })
  }

  const fileStream = createReadStream(join(process.cwd(), file.url))

  const responseStream = new ReadableStream({
    start(controller) {
      fileStream.on('data', (chunk) => controller.enqueue(chunk))
      fileStream.on('end', () => controller.close())
      fileStream.on('error', (err) => controller.error(err))
    },
  })

  return new NextResponse(responseStream, {
    headers: {
      'Content-Type': file.fileType || 'application/octet-stream',
      // 对中文文件名使用 RFC 5987 编码
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
    },
  })
}
