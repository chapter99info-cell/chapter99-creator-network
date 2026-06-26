import { Metadata } from 'next'
import Link from 'next/link'
import { SopAccordion, SopPrintButton } from '@/components/SopAccordion'

export const metadata: Metadata = {
  title: 'SOP | Thai-Aus Verified Community',
  description: 'มาตรฐานการทำงานที่ช่างภาพทุกคนต้องปฏิบัติตาม — Thai-Aus Verified Community',
}

export default function SopPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-10 print:bg-white print:px-8 print:py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:mb-6">
          <div>
            <Link
              href="/photographer"
              className="text-sm text-gray-500 hover:text-trust print:hidden"
            >
              ← กลับ Photographer Portal
            </Link>
            <p className="mt-4 text-sm font-bold text-trust print:text-black">
              Thai-Aus Verified Community
            </p>
            <h1 className="font-heading mt-2 text-2xl font-bold text-gray-900 print:text-black sm:text-3xl">
              Thai-Aus Verified Community — SOP
            </h1>
            <p className="mt-2 text-gray-500 print:text-gray-700">
              มาตรฐานการทำงานที่ช่างภาพทุกคนต้องปฏิบัติตาม
            </p>
          </div>
          <SopPrintButton />
        </div>

        <SopAccordion />

        <p className="mt-10 text-center text-xs text-gray-600 print:mt-8 print:text-gray-500">
          chapter99solutions@gmail.com | 0452044382
        </p>
      </div>
    </main>
  )
}
