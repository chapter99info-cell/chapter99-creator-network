/** จัดรูปแบบ ABN: XX XXX XXX XXX */
export function formatAbn(abn: string): string {
  const digits = abn.replace(/\D/g, '')
  if (digits.length !== 11) return digits
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`
}

export function isValidAbn(abn: string): boolean {
  return /^\d{11}$/.test(abn.replace(/\D/g, ''))
}

export function normalizeAbn(abn: string): string {
  return abn.replace(/\D/g, '')
}

/** ตรวจเบอร์โทรออสเตรเลีย 04XX XXX XXX */
export function isValidAuMobile(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '')
  return /^04\d{8}$/.test(cleaned)
}

export function formatAuMobile(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 10) return phone
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`
}
