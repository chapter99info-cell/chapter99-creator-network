export interface SopSection {
  id: string
  title: string
  items: string[]
  variant?: 'warning' | 'payment' | 'community'
}

export const SOP_SECTIONS: SopSection[] = [
  {
    id: 'pre-shoot',
    title: 'ก่อนวันงาน (Pre-Shoot)',
    items: [
      'ยืนยันการรับงานในระบบภายใน 24 ชั่วโมงหลังได้รับ notification',
      'ติดต่อลูกค้าผ่านช่องทางที่ระบุในระบบ เพื่อยืนยันวัน เวลา และโลเคชั่น',
      'เช็คอุปกรณ์: กล้อง เลนส์ แบตเตอรี่ การ์ด flash/light',
      'เผื่อเวลาเดินทาง — ต้องถึงก่อนเวลานัด 15 นาที',
      'หากติดปัญหาฉุกเฉิน แจ้ง Admin ทันทีที่ 0452044382',
    ],
  },
  {
    id: 'on-shoot',
    title: 'วันงาน (On Shoot Day)',
    items: [
      'กด "เริ่มงาน" ในระบบเมื่อถึงหน้างาน',
      'ถ่ายภาพตาม shot list ที่ลูกค้าระบุ (ถ้ามี)',
      'F&B: จัดแสง natural light ก่อนเสมอ — ห้ามใช้ flash โดยตรงกับอาหาร',
      'Portrait/Wedding: ถ่าย safety shot ก่อนทุกครั้ง',
      'ถ่ายทั้ง landscape และ portrait orientation',
      'เช็ค histogram ทุก 20 ช็อต — ห้าม overexpose highlight',
      'หากงานเลทเกิน 15 นาที (ลูกค้าไม่พร้อม) → แจ้ง Admin ก่อนคิด overtime',
    ],
  },
  {
    id: 'post-shoot',
    title: 'หลังงาน (Post-Shoot)',
    items: [
      'อัปโหลด RAW files ทั้งหมดภายใน 48 ชั่วโมง',
      'จัดไฟล์ในโฟลเดอร์: [BK-XXXXXXXX]_[YYYY-MM-DD]_[job_type]',
      'ไม่ตัดทิ้ง RAW ใดๆ ทั้งสิ้น — ส่งมาทั้งหมด ทีม Chapter99 จะคัดเอง',
      'อย่าส่งไฟล์ให้ลูกค้าโดยตรง — ต้องผ่านระบบเท่านั้น',
      'กด "ส่งงานแล้ว" ในระบบหลังอัปโหลดเสร็จ',
    ],
  },
  {
    id: 'image-standards',
    title: 'มาตรฐานภาพ (Image Standards)',
    items: [
      'Minimum resolution: 24MP (Sony A7 series หรือเทียบเท่า)',
      'Color profile: sRGB สำหรับส่งลูกค้า, Adobe RGB สำหรับ RAW',
      'Exposure: ±1 stop จาก correct exposure เท่านั้น',
      'Focus: tack sharp บน subject หลัก — ตาคมเสมอ (portrait)',
      'White balance: ตั้งให้ถูกต้องหน้างาน ไม่พึ่ง auto WB ตลอด',
    ],
  },
  {
    id: 'blacklist',
    title: 'ข้อห้ามเด็ดขาด (Blacklist Rules)',
    variant: 'warning',
    items: [
      'เบี้ยวงานโดยไม่แจ้งล่วงหน้า → Blacklist ถาวร + ปรับ $100 AUD',
      'ส่งไฟล์ให้ลูกค้าโดยตรง bypass ระบบ → ระงับบัญชีทันที',
      'ตัดราคานอกระบบ (side deal) → ยกเลิกสัญญาทันที',
      'ใช้ภาพลูกค้าในพอร์ตโดยไม่ได้รับอนุญาต → ผิดสัญญา',
      'แชร์ข้อมูลส่วนตัวลูกค้าออกนอกระบบ → ผิด Privacy Act AUS',
    ],
  },
  {
    id: 'payment',
    title: 'การเงินและการจ่ายเงิน (Payment)',
    variant: 'payment',
    items: [
      'Platform fee: 7% หักจากยอดที่ลูกค้าจ่าย',
      'Travel fee $50: โอนให้ 100% ไม่หัก 7%',
      'เงินโอนหลัง Admin อนุมัติงาน — ภายใน 2–7 วันทำการ',
      'ต้องมี Stripe Express account ที่ verify แล้วก่อนรับงาน',
      'สรุปรายได้ดูได้ใน Photographer Portal ตลอดเวลา',
    ],
  },
  {
    id: 'community',
    title: 'Community Guidelines',
    variant: 'community',
    items: [
      'แชร์ความรู้และเทคนิคใน Facebook Group "Chapter99 Creator Network"',
      'ช่วยเหลือช่างภาพใหม่ — ระบบ tier rising_star → pro วัดจาก peer review',
      'แท็ก @Chapter99Solutions เมื่อโพสต์งานที่ผ่านแพลตฟอร์ม',
      'รายงาน bug หรือปัญหาระบบผ่าน admin ทันที',
    ],
  },
]
