'use client'

import { useState } from 'react'
import { SOP_SECTIONS } from '@/lib/sop-content'
import { cn } from '@/lib/utils'
import { ChevronDown, Printer } from 'lucide-react'

export function SopAccordion() {
  const [openId, setOpenId] = useState<string | null>(SOP_SECTIONS[0]?.id ?? null)

  return (
    <div className="space-y-3 print:space-y-6">
      {SOP_SECTIONS.map((section) => {
        const isOpen = openId === section.id
        const prefix =
          section.variant === 'warning'
            ? '🚫'
            : section.variant === 'payment'
              ? '💰'
              : section.variant === 'community'
                ? '✅'
                : '□'

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white print:border-gray-300 print:bg-white print:break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : section.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left print:pointer-events-none"
              aria-expanded={isOpen}
            >
              <span className="font-heading font-semibold text-gray-900 print:text-black">
                {section.title}
              </span>
              <ChevronDown
                className={cn(
                  'shrink-0 text-trust transition-transform print:hidden',
                  isOpen && 'rotate-180'
                )}
                size={20}
              />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out print:grid-rows-[1fr]',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] print:grid-rows-[1fr]'
              )}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2 border-t border-gray-200 px-5 py-4 print:border-gray-200">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-400 print:text-gray-800">
                      <span className="shrink-0">{prefix}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function SopPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg border border-[#1B6CA8] px-4 py-2 text-sm font-medium text-trust transition-colors hover:bg-trust/10 print:hidden"
    >
      <Printer size={18} />
      ดาวน์โหลด PDF (Print)
    </button>
  )
}
