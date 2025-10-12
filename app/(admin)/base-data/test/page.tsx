import prisma from '@/lib/prisma'
import CreateMatForm from './createForm'
import DeleteMatButton from './deleteButton'

// 主页面组件（服务端组件）
export default async function TestPage() {
  const mats = await prisma.mat.findMany()

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl">材料管理</h1>

      {/* 创建表单 */}
      <CreateMatForm />

      <div className="mt-6">
        <h2 className="mb-2 text-xl">现有材料</h2>
        {mats.length === 0 ? (
          <p className="text-gray-500">暂无材料数据</p>
        ) : (
          <div className="space-y-2">
            {mats.map((mat) => (
              <div key={mat.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <span className="font-medium">{mat.name}</span>
                  <span className="ml-2 text-gray-500">({mat.code})</span>
                </div>
                {/* 删除按钮 */}
                <DeleteMatButton id={mat.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
