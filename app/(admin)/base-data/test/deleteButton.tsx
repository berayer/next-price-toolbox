'use client'

import { useActionState, startTransition } from 'react'
import { deleteMat } from './action'
import { Button } from '@/components/ui/button'

export default function DeleteMatButton({ id }: { id: number }) {
  const [state, invokeAction, isPending] = useActionState(deleteMat, null)

  const handleDelete = () => {
    const formData = new FormData()
    formData.set('id', id.toString())
    startTransition(() => invokeAction(formData))
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending} className="h-8 px-3">
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
