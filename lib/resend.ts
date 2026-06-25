import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not set')
    resendClient = new Resend(key)
  }
  return resendClient
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL ?? 'Chapter99 <onboarding@resend.dev>'
}

interface ShootingStartedEmailParams {
  to: string
  photographerName: string
  bookingRef: string
}

/** แจ้งลูกค้าเมื่อช่างภาพกดเริ่มงาน */
export async function sendShootingStartedEmail({
  to,
  photographerName,
  bookingRef,
}: ShootingStartedEmailParams) {
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `ช่างภาพเริ่มถ่ายงานแล้ว — ${bookingRef}`,
    text: `ช่างภาพของคุณมาถึงแล้ว — ${photographerName} เริ่มถ่ายงานของคุณแล้วครับ/ค่ะ`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <p style="color: #111111; font-size: 16px; line-height: 1.6;">
          ช่างภาพของคุณมาถึงแล้ว — <strong>${photographerName}</strong>
          เริ่มถ่ายงานของคุณแล้วครับ/ค่ะ
        </p>
        <p style="color: #888; font-size: 13px; margin-top: 24px;">
          รหัสจอง: ${bookingRef}<br>Chapter99 Creator Network
        </p>
      </div>
    `,
  })
}

interface FilesUploadedAdminParams {
  photographerName: string
  bookingRef: string
  jobType: string
  shootDate: string
  adminDashboardUrl: string
}

/** แจ้ง admin เมื่อช่างภาพอัปโหลดไฟล์ */
export async function sendFilesUploadedAdminEmail(params: FilesUploadedAdminParams) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'chapter99solutions@gmail.com'
  const { photographerName, bookingRef, jobType, shootDate, adminDashboardUrl } = params

  return getResend().emails.send({
    from: getFrom(),
    to: adminEmail,
    subject: `📸 ${bookingRef} ช่างภาพส่งไฟล์แล้ว — รอตรวจสอบ`,
    text: `${photographerName} ส่งไฟล์แล้ว\nรหัส: ${bookingRef}\nงาน: ${jobType}\nวันถ่าย: ${shootDate}\n${adminDashboardUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; padding: 24px;">
        <h2 style="color: #111;">📸 ช่างภาพส่งไฟล์แล้ว</h2>
        <p><strong>ช่างภาพ:</strong> ${photographerName}</p>
        <p><strong>รหัสจอง:</strong> ${bookingRef}</p>
        <p><strong>ประเภทงาน:</strong> ${jobType}</p>
        <p><strong>วันถ่าย:</strong> ${shootDate}</p>
        <p style="margin-top: 20px;">
          <a href="${adminDashboardUrl}" style="background: #E8A838; color: #111; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
            เปิด Admin Dashboard
          </a>
        </p>
      </div>
    `,
  })
}

interface PayoutPhotographerEmailParams {
  to: string
  bookingRef: string
  amount: string
}

export async function sendPayoutPhotographerEmail(params: PayoutPhotographerEmailParams) {
  const { to, bookingRef, amount } = params
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `💰 เงินโอนแล้ว — ${bookingRef}`,
    text: `เงิน ${amount} สำหรับ ${bookingRef} ถูกโอนแล้ว เงินจะเข้าบัญชีใน 2–7 วันทำการ`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; padding: 24px;">
        <h2 style="color: #111;">💰 เงินโอนแล้ว</h2>
        <p>จำนวน: <strong>${amount}</strong></p>
        <p>รหัสจอง: ${bookingRef}</p>
        <p style="color: #666;">เงินจะเข้าบัญชีใน 2–7 วันทำการ</p>
      </div>
    `,
  })
}

interface PayoutClientEmailParams {
  to: string
  bookingRef: string
  reviewUrl: string
}

export async function sendPayoutClientEmail(params: PayoutClientEmailParams) {
  const { to, bookingRef, reviewUrl } = params
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `✅ งานเสร็จสมบูรณ์ — ${bookingRef}`,
    text: `ขอบคุณที่ใช้บริการ Chapter99 Creator Network รหัสจอง ${bookingRef} เขียนรีวิวได้ที่ ${reviewUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; padding: 24px;">
        <h2 style="color: #111;">✅ งานเสร็จสมบูรณ์</h2>
        <p>ขอบคุณที่ใช้บริการ Chapter99 Creator Network</p>
        <p>รหัสจอง: ${bookingRef}</p>
        <p style="margin-top: 20px;">
          <a href="${reviewUrl}" style="background: #E8A838; color: #111; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
            เขียนรีวิว
          </a>
        </p>
      </div>
    `,
  })
}

interface NewPhotographerAdminParams {
  fullName: string
  abn: string
  tier: string
  suburbs: string[]
  insuranceUrl: string
  adminUrl: string
}

export async function sendNewPhotographerAdminEmail(params: NewPhotographerAdminParams) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'chapter99solutions@gmail.com'
  const { fullName, abn, tier, suburbs, insuranceUrl, adminUrl } = params

  return getResend().emails.send({
    from: getFrom(),
    to: adminEmail,
    subject: `🆕 ช่างภาพใหม่สมัครเข้าระบบ — ${fullName}`,
    text: `ชื่อ: ${fullName}\nABN: ${abn}\nTier: ${tier}\nพื้นที่: ${suburbs.join(', ')}\nInsurance: ${insuranceUrl}\n${adminUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; padding: 24px;">
        <h2 style="color: #111;">🆕 ช่างภาพใหม่สมัครเข้าระบบ</h2>
        <p><strong>ชื่อ:</strong> ${fullName}</p>
        <p><strong>ABN:</strong> ${abn}</p>
        <p><strong>Tier:</strong> ${tier}</p>
        <p><strong>พื้นที่:</strong> ${suburbs.join(', ')}</p>
        <p><a href="${insuranceUrl}">ดู Insurance CoC</a></p>
        <p style="margin-top: 20px;">
          <a href="${adminUrl}" style="background: #E8A838; color: #111; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
            ไปยืนยันที่ Admin Dashboard
          </a>
        </p>
      </div>
    `,
  })
}

export async function sendJoinConfirmationEmail(to: string, fullName: string) {
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: '✅ รับใบสมัครแล้ว — Chapter99 Creator Network',
    text: `สวัสดี ${fullName}, ทีมงานจะตรวจสอบเอกสารและยืนยันภายใน 2–3 วันทำการ หลังจากยืนยันแล้ว คุณจะได้รับ Magic Link เพื่อ login เข้าระบบ`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; padding: 24px;">
        <h2 style="color: #111;">✅ รับใบสมัครแล้ว</h2>
        <p>สวัสดี ${fullName},</p>
        <p>ทีมงานจะตรวจสอบเอกสารและยืนยันภายใน <strong>2–3 วันทำการ</strong></p>
        <p>หลังจากยืนยันแล้ว คุณจะได้รับ Magic Link เพื่อ login เข้าระบบ</p>
        <p style="color: #888; margin-top: 24px;">Chapter99 Creator Network</p>
      </div>
    `,
  })
}
