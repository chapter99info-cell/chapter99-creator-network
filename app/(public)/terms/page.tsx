import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Chapter99 Creator Network',
  description:
    'ข้อกำหนดและเงื่อนไขการใช้งาน Chapter99 Creator Network — Platform fee 7%, Escrow protection, Privacy Act AUS',
}

const sections = [
  {
    title: '1. Platform Overview',
    content: [
      'Chapter99 Creator Network คือแพลตฟอร์มเชื่อมต่อช่างภาพไทยมืออาชีพในออสเตรเลียกับลูกค้าธุรกิจไทยและลูกค้าทั่วไป',
      'ระบบจัดการการจอง การชำระเงินผ่าน Escrow การอัปโหลดไฟล์ และการจ่ายเงินให้ช่างภาพอย่างโปร่งใส',
      'Chapter99 Solutions เป็น operator ของแพลตฟอร์ม ไม่ใช่นายจ้างของช่างภาพ — ช่างภาพเป็น independent contractor',
    ],
  },
  {
    title: '2. Photographer Obligations',
    content: [
      'ต้องมี ABN ที่ Active กับ Australian Business Register (ABR)',
      'ต้องมี Public Liability Insurance $5M–$10M coverage ขึ้นไป พร้อม Certificate of Currency',
      'ต้องปฏิบัติตาม SOP (Standard Operating Procedure) ทุกข้อ',
      'ต้องมี Stripe Express account ที่ verify แล้วก่อนรับงาน',
      'ห้ามส่งไฟล์ให้ลูกค้าโดยตรงนอกระบบ',
    ],
  },
  {
    title: '3. Client Rights',
    content: [
      'เงินที่ชำระจะถูกเก็บใน Escrow จนกว่าจะอนุมัติงานหรือ Admin ตัดสิน',
      'หากช่างภาพไม่ส่งงานภายใน 48 ชั่วโมง ลูกค้าสามารถแจ้ง Admin เพื่อขอคืนเงิน',
      'ลูกค้ามีสิทธิ์เขียนรีวิวหลังงานเสร็จสมบูรณ์',
      'ข้อมูลส่วนตัวของลูกค้าได้รับการคุ้มครองตาม Australian Privacy Act',
    ],
  },
  {
    title: '4. Payment Terms',
    content: [
      'Platform fee: 7% หักจากยอดที่ลูกค้าจ่าย (ไม่รวม travel fee)',
      'Travel fee $50: โอนให้ช่างภาพ 100% ไม่หัก platform fee',
      'Stripe processing surcharge จะถูกคิดเพิ่มจากยอดชำระ',
      'เงินโอนให้ช่างภาพภายใน 2–7 วันทำการ หลัง Admin อนุมัติงาน',
    ],
  },
  {
    title: '5. Blacklist Policy',
    content: [
      'เบี้ยวงานโดยไม่แจ้งล่วงหน้า → Blacklist ถาวร + ปรับ $100 AUD',
      'ส่งไฟล์ให้ลูกค้าโดยตรง bypass ระบบ → ระงับบัญชีทันที',
      'ตัดราคานอกระบบ (side deal) → ยกเลิกสัญญาทันที',
      'ใช้ภาพลูกค้าในพอร์ตโดยไม่ได้รับอนุญาต → ผิดสัญญา',
      'แชร์ข้อมูลส่วนตัวลูกค้าออกนอกระบบ → ผิด Privacy Act AUS',
    ],
  },
  {
    title: '6. Privacy Policy',
    content: [
      'เราเก็บข้อมูล: ชื่อ อีเมล เบอร์โทร ABN เอกสารประกัน และข้อมูลการจอง',
      'ข้อมูลใช้เพื่อการดำเนินงานแพลตฟอร์ม การชำระเงิน และการสื่อสารเท่านั้น',
      'ไม่ขายหรือแชร์ข้อมูลให้บุคคลที่สาม ยกเว้นตามกฎหมายหรือเพื่อดำเนินการชำระเงิน (Stripe)',
      'ลูกค้าและช่างภาพสามารถขอเข้าถึงหรือลบข้อมูลได้โดยติดต่อ admin',
      'ปฏิบัติตาม Australian Privacy Act 1988 (Cth)',
    ],
  },
  {
    title: '7. Governing Law',
    content: [
      'ข้อกำหนดนี้อยู่ภายใต้กฎหมายของ New South Wales, Australia',
      'ข้อพิพาทใดๆ จะอยู่ในเขตอำนาจศาลของ NSW',
    ],
  },
  {
    title: '8. Contact',
    content: [
      'chapter99solutions@gmail.com',
      '0452044382',
      'Chapter99 Solutions — Sydney, Australia',
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#111111] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-[#E8A838]">
          ← กลับหน้าแรก
        </Link>
        <h1 className="font-heading mt-6 text-3xl font-bold text-white sm:text-4xl">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-gray-500">อัปเดตล่าสุด: June 2026</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-white/10 bg-[#1a1a1a] p-6"
            >
              <h2 className="font-heading text-xl font-semibold text-[#E8A838]">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-[#E8A838]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-600">
          สมัครช่างภาพที่{' '}
          <Link href="/join" className="text-[#E8A838] hover:underline">
            /join
          </Link>
        </p>
      </div>
    </main>
  )
}
