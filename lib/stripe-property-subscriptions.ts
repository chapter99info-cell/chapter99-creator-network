import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const PROPERTY_SUBSCRIPTION_TYPE = 'property_subscription'

export function isPropertySubscription(
  metadata: Stripe.Metadata | null | undefined
): boolean {
  if (!metadata?.type) return false
  return (
    metadata.type === PROPERTY_SUBSCRIPTION_TYPE ||
    metadata.type === 'business_subscription'
  )
}

function realestateLineItems(): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const priceId = process.env.STRIPE_PRICE_ID?.trim()
  if (priceId) {
    return [{ price: priceId, quantity: 1 }]
  }
  return [
    {
      price_data: {
        currency: 'aud',
        product_data: {
          name: 'Thai-Aus Verified Community — Real Estate Posting',
          description: 'สิทธิ์โพสต์อสังหาริมทรัพย์ — $50/เดือน',
        },
        unit_amount: 5000,
        recurring: { interval: 'month' },
      },
      quantity: 1,
    },
  ]
}

/** Stripe Checkout — real estate posting rights $50/month */
export async function createRealEstateSubscriptionCheckout(params: {
  email: string
  facebookName: string
  agencyName?: string
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
    },
  })

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: realestateLineItems(),
    metadata: {
      type: PROPERTY_SUBSCRIPTION_TYPE,
      facebook_name: params.facebookName,
      agency_name: params.agencyName ?? '',
      email: params.email,
    },
    subscription_data: {
      metadata: {
        type: PROPERTY_SUBSCRIPTION_TYPE,
        facebook_name: params.facebookName,
        agency_name: params.agencyName ?? '',
        email: params.email,
      },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })
}

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const sub = (invoice as Stripe.Invoice & { subscription?: string | { id: string } | null })
    .subscription
  if (!sub) return null
  return typeof sub === 'string' ? sub : sub.id
}

export async function handlePropertySubscriptionStripeEvent(
  supabase: NonNullable<Awaited<ReturnType<typeof createServiceClient>>>,
  event: Stripe.Event
) {
  switch (event.type) {
    case 'customer.subscription.created': {
      const sub = event.data.object as Stripe.Subscription
      if (!isPropertySubscription(sub.metadata)) break

      const expiresAt = (sub as unknown as { current_period_end?: number }).current_period_end
        ? new Date(
            (sub as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString()
        : null
      const customerId =
        typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null
      const facebookName = sub.metadata?.facebook_name
      const email = sub.metadata?.email
      const agencyName = sub.metadata?.agency_name || null
      const state = sub.metadata?.state || 'NSW'

      const updates = {
        status: 'active' as const,
        stripe_subscription_id: sub.id,
        stripe_customer_id: customerId,
        expires_at: expiresAt,
      }

      if (facebookName) {
        const { data: byFacebook } = await supabase
          .from('property_subscriptions')
          .select('id')
          .eq('facebook_name', facebookName)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (byFacebook) {
          await supabase.from('property_subscriptions').update(updates).eq('id', byFacebook.id)
          break
        }
      }

      const { data: bySub } = await supabase
        .from('property_subscriptions')
        .select('id')
        .eq('stripe_subscription_id', sub.id)
        .maybeSingle()

      if (bySub) {
        await supabase.from('property_subscriptions').update(updates).eq('id', bySub.id)
        break
      }

      if (email) {
        const { data: byEmail } = await supabase
          .from('property_subscriptions')
          .select('id')
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (byEmail) {
          await supabase.from('property_subscriptions').update(updates).eq('id', byEmail.id)
          break
        }
      }

      if (facebookName && email) {
        await supabase.from('property_subscriptions').insert({
          facebook_name: facebookName,
          agency_name: agencyName,
          email,
          state,
          ...updates,
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      if (!isPropertySubscription(sub.metadata)) break

      await supabase
        .from('property_subscriptions')
        .update({ status: 'expired' })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const stripeSubId = getSubscriptionIdFromInvoice(invoice)
      if (!stripeSubId) break

      await supabase
        .from('property_subscriptions')
        .update({ status: 'expired' })
        .eq('stripe_subscription_id', stripeSubId)
      break
    }
  }
}
