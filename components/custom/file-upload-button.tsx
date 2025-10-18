// components/FileUploadButton.tsx
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ChangeEvent, ReactNode, useRef } from 'react'

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void
  accept?: string // 例如 "image/*", ".pdf,.doc"
  disabled?: boolean
  children?: ReactNode
}

export function FileUploadButton({
  onFileSelect,
  accept = '*',
  disabled = false,
  children = '上传文件',
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      // 清空 input 值，以便下次选择相同文件也能触发 onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" onClick={handleButtonClick} disabled={disabled}>
        {children}
      </Button>
      {/* 隐藏的原生 file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  )
}
