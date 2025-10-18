'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface FileListProps {
  attachment: IdNameType[]
  setAttachment: (attachment: IdNameType[]) => void
}

export function FileList({ attachment, setAttachment }: FileListProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">附件列表({attachment.length})</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        {attachment.length > 0 ? (
          <div className="flex flex-col text-sm">
            {attachment.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.name}</span>
                <Button
                  variant="link"
                  className="text-destructive"
                  onClick={() => {
                    setAttachment(attachment.filter((it) => it.id !== item.id))
                  }}
                >
                  移除
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div>请先上传附件,拖动文件到主页，或者粘贴文件，或者点击上传按钮</div>
        )}
      </PopoverContent>
    </Popover>
  )
}
