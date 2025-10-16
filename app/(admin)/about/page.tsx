// components/PrintableLabel.tsx
'use client'

import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'

export default function PrintableLabel() {
  const labelRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: labelRef,
    pageStyle: `
      @page {
        size: 100mm 50mm;
        margin: 0;
      }
      @media print {
        body { margin: 0; font-family: font-family: Arial, Helvetica, sans-serif;}
        .border {
          border: none !important;
        }
      }
    `,
  })

  return (
    <div className="space-y-4 p-4">
      <Button onClick={handlePrint}>打印标签</Button>

      <div className="flex w-full flex-col">
        <div ref={labelRef} className="space-y-4">
          <div className="text-md h-[50mm] w-[100mm] border bg-white p-[2mm]">
            <h3 className="text-lg">产品标签</h3>
            <p>
              <strong>名称:</strong> 示例产品
            </p>
            <p>
              <strong>尺寸:</strong> 100x50mm
            </p>
            <p>
              <strong>日期:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="text-md h-[50mm] w-[100mm] border bg-white p-[2mm]">
            <h3 className="text-lg">产品标签</h3>
            <p>
              <strong>名称:</strong> 示例产品
            </p>
            <p>
              <strong>尺寸:</strong> 100x50mm
            </p>
            <p>
              <strong>日期:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
