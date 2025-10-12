'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Color } from '@/generated/prisma'
import { InfoIcon } from 'lucide-react'
import { deletePost } from './actions'
import { useActionState, startTransition } from 'react'
import { Spinner } from '@/components/ui/spinner'

export function DeleteButton({ item }: { item: Color }) {
  const [state, formAction, isPending] = useActionState(deletePost, null)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" size="sm" className="text-destructive h-5">
          删除
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <InfoIcon className="size-5 text-amber-300" />
          <span className="text-md">确定删除 {item.fullName} 吗?</span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            取消
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => startTransition(() => formAction(item.id))}
            disabled={isPending}
          >
            {isPending && <Spinner />}
            确定
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
