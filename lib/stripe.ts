import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

/** Normalize env value — trim whitespace and optional surrounding quotes */
function normalizeEnvSecret(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

/** Lazy-init Stripe — หลีกเลี่ยง error ตอน build ที่ยังไม่มี env */
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = normalizeEnvSecret(process.env.STRIPE_SECRET_KEY)
    if (!key || key.length < 20) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(key, { typescript: true })
  }
  return stripeInstance
}

/** @deprecated use getStripe() — kept for convenience */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop)
  },
})

interface CreatePaymentIntentParams {
  amount: number
  currency: 'aud'
  photographerStripeAccountId: string
  platformFeeAmount: number
  bookingId: string
  photographerId: string
  clientId: string
  metadata?: Record<string, string>
}

/** สร้าง Payment Intent สำหรับ escrow — เงินเข้า Stripe ก่อนแบ่ง payout */
export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  const {
    amount,
    currency,
    photographerStripeAccountId,
    platformFeeAmount,
    bookingId,
    photographerId,
    clientId,
    metadata,
  } = params

  return getStripe().paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    application_fee_amount: Math.round(platformFeeAmount * 100),
    transfer_data: {
      destination: photographerStripeAccountId,
    },
    metadata: {
      bookingId,
      photographerId,
      clientId,
      booking_id: bookingId,
      ...metadata,
    },
  })
}

/** สร้างลิงก์ onboarding สำหรับ Stripe Connect Express */
export async function createConnectAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  return getStripe().accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })
}

/** สร้างบัญชี Stripe Connect Express สำหรับช่างภาพ */
export async function createExpressAccount(email: string, fullName: string) {
  return getStripe().accounts.create({
    type: 'express',
    country: 'AU',
    email,
    capabilities: {
      transfers: { requested: true },
    },
    business_type: 'individual',
    individual: {
      email,
      first_name: fullName.split(' ')[0],
      last_name: fullName.split(' ').slice(1).join(' ') || fullName,
    },
  })
}

interface TriggerTransferParams {
  amount: number
  photographerStripeAccountId: string
  bookingId: string
  photographerId: string
}

/** โอนเงินไปยังบัญชีช่างภาพหลัง admin อนุมัติ */
export async function triggerTransfer(params: TriggerTransferParams) {
  const { amount, photographerStripeAccountId, bookingId, photographerId } = params

  return getStripe().transfers.create({
    amount: Math.round(amount * 100),
    currency: 'aud',
    destination: photographerStripeAccountId,
    transfer_group: bookingId,
    metadata: {
      bookingId,
      photographerId,
      booking_id: bookingId,
    },
  })
}

const PROPERTY_MONTHLY_CENTS = 5000

const SUBSCRIPTION_METADATA_TYPE = 'business_subscription'

function businessLineItems() {
  if (process.env.STRIPE_PRICE_ID) {
    return [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }]
  }
  return [
    {
      price_data: {
        currency: 'aud' as const,
        product_data: {
          name: 'Thai-Aus Verified Community — Business Advertising',
          description: 'สิทธิ์โฆษณาธุรกิจ — $50/เดือน',
        },
        unit_amount: PROPERTY_MONTHLY_CENTS,
        recurring: { interval: 'month' as const },
      },
      quantity: 1,
    },
  ]
}

/** Stripe Checkout — โฆษณาธุรกิจ $50/เดือน */
export async function createBusinessSubscriptionCheckout(params: {
  email: string
  facebookName: string
  agencyName?: string
  state: string
  successUrl: string
  cancelUrl: string
}) {
  const stripe = getStripe()

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.agencyName?.trim() || params.facebookName,
    metadata: {
      facebook_name: params.facebookName,
      agency_name: params.agencyName ?? '',
      state: params.state,
    },
  })

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: businessLineItems(),
    metadata: {
      type: SUBSCRIPTION_METADATA_TYPE,
      facebook_name: params.facebookName,
      agency_name: params.agencyName ?? '',
      email: params.email,
      state: params.state,
    },
    subscription_data: {
      metadata: {
        type: SUBSCRIPTION_METADATA_TYPE,
        facebook_name: params.facebookName,
        agency_name: params.agencyName ?? '',
        email: params.email,
        state: params.state,
      },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })
}

/** Stripe Checkout — สิทธิ์โพสต์อสังหาฯ $50/เดือน (legacy route) */
export async function createPropertySubscriptionCheckout(params: {
  email: string
  facebookName: string
  agencyName?: string
  successUrl: string
  cancelUrl: string
}) {
  return getStripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: params.email,
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Thai-Aus Verified Community — Business Advertising',
            description: 'สิทธิ์โฆษณาธุรกิจ — $50/เดือน',
          },
          unit_amount: PROPERTY_MONTHLY_CENTS,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'property_subscription',
      facebook_name: params.facebookName,
      agency_name: params.agencyName ?? '',
      email: params.email,
    },
    subscription_data: {
      metadata: {
        type: 'property_subscription',
        facebook_name: params.facebookName,
        agency_name: params.agencyName ?? '',
        email: params.email,
      },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })
}
