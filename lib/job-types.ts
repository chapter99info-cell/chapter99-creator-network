import type { LucideIcon } from 'lucide-react'
import {
  UtensilsCrossed,
  Sparkles,
  Store,
  Cake,
  Heart,
  Camera,
  Flower2,
  Building2,
  MoreHorizontal,
} from 'lucide-react'
import type { JobType } from '@/types'

export interface JobTypeOption {
  value: JobType
  labelTh: string
  icon: LucideIcon
}

export const JOB_TYPE_OPTIONS: JobTypeOption[] = [
  { value: 'food_photography', labelTh: 'ถ่ายอาหาร', icon: UtensilsCrossed },
  { value: 'massage_spa', labelTh: 'นวด/สปา', icon: Sparkles },
  { value: 'cafe_retail', labelTh: 'คาเฟ่/ร้านค้า', icon: Store },
  { value: 'birthday_party', labelTh: 'วันเกิด', icon: Cake },
  { value: 'wedding', labelTh: 'แต่งงาน', icon: Heart },
  { value: 'pre_wedding', labelTh: 'พรีเวดดิ้ง', icon: Camera },
  { value: 'funeral', labelTh: 'งานศพ', icon: Flower2 },
  { value: 'corporate', labelTh: 'องค์กร', icon: Building2 },
  { value: 'other', labelTh: 'อื่นๆ', icon: MoreHorizontal },
]

export function getJobTypeLabel(jobType: JobType): string {
  return JOB_TYPE_OPTIONS.find((j) => j.value === jobType)?.labelTh ?? jobType
}
