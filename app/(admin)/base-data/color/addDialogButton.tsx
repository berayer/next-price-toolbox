'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { createPost } from './actions'
import { useActionState } from 'react'
import { Spinner } from '@/components/ui/spinner'

export function AddDialogButton() {
  const [state, formAction, isPending] = useActionState(createPost, null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          新增花色
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-xs"
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>新增花色</DialogTitle>
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
