'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useActionState, useState } from 'react'
import { createNewMat } from './action'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'

export default function CreateMatForm() {
  const [state, formAction, isPending] = useActionState(createNewMat, null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">新增基材</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Mat</DialogTitle>
          <DialogDescription>this is a test</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="max-w-md space-y-2">
          <Input name="name" placeholder="Name" required />
          <Input name="code" placeholder="Code" required />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Creating...' : 'Create'}
          </Button>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          {state?.success && <p className="text-sm text-green-500">Created successfully!</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
