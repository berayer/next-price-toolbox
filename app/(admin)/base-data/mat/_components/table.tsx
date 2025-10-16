'use client'

import GenericTable from '@/components/custom/n-table'
import { createColumnHelper } from '@tanstack/react-table'
import type { Mat } from '@/generated/prisma'
import { formatDate } from '@/lib/utils'
import { startTransition, useActionState, useEffect, useRef } from 'react'
import { createNewMat, deleteMat } from '../action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { PlusIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

const columnHelper = createColumnHelper<Mat>()

const columns = [
  columnHelper.accessor('name', { header: '名称' }),
  columnHelper.accessor('code', { header: '编码' }),
  columnHelper.accessor('createdAt', { header: '创建时间', size: 100, cell: (info) => formatDate(info.getValue()) }),
  columnHelper.accessor('updatedAt', { header: '更新时间', size: 120, cell: (info) => formatDate(info.getValue()) }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    cell: (info) => <DeleteMatButton id={info.row.original.id} />,
  }),
]

export function MatTable({ mats }: { mats: Mat[] }) {
  return (
    <GenericTable data={mats} columns={columns}>
      <CreateMatForm />
    </GenericTable>
  )
}

// 删除按钮
function DeleteMatButton({ id }: { id: number }) {
  const [_, invokeAction, isPending] = useActionState(deleteMat, null)

  const handleDelete = () => {
    const formData = new FormData()
    formData.set('id', id.toString())
    startTransition(() => invokeAction(formData))
  }

  return (
    <Button variant="link" size="sm" onClick={handleDelete} disabled={isPending} className="text-destructive h-6">
      {isPending ? '删除' : '删除'}
    </Button>
  )
}

// 新增表单
function CreateMatForm() {
  const [state, formAction, isPending] = useActionState(createNewMat, null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (state?.success) {
      btnRef.current?.click()
    }
  }, [state])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          新增
        </Button>
      </DialogTrigger>
      <DialogContent className="w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>新增基材</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form action={formAction} className="max-w-md space-y-4">
          <Input name="name" placeholder="名称" required spellCheck={false} autoComplete="off" />
          <Input name="code" placeholder="编码" required spellCheck={false} autoComplete="off" />

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          {/* {state?.success && <p className="text-sm text-green-500">创建成功!</p>} */}

          <div className="flex justify-end gap-2">
            <DialogClose asChild ref={btnRef}>
              <Button type="button" variant="outline">
                取消
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner className="mr-2" />}
              确定
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
