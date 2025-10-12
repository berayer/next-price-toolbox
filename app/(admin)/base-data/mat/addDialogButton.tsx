'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { createPost } from './actions'
import { useActionState, useState, useRef } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

export function AddDialogButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createPost, null)
  const hasHandledSuccess = useRef<boolean>(false)

  console.log('state', state)
  if (!hasHandledSuccess.current && state?.success) {
    console.log('success')
    hasHandledSuccess.current = true
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          新增基材
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-sm"
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>新增一个基材</DialogTitle>
          <DialogDescription className="text-destructive">{state?.error || ''}</DialogDescription>
        </DialogHeader>

        <form>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="matName">名称</Label>
              <Input id="matName" name="name" spellCheck={false} autoComplete="off" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="matCode">编码</Label>
              <Input id="matCode" name="code" spellCheck={false} autoComplete="off" />
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button type="submit" formAction={formAction} disabled={isPending}>
                {isPending && <Spinner />}
                保存
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
