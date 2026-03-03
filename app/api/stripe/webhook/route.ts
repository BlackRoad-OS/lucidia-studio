import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

/**
 * Stripe webhook handler.
 *
 * POST /api/stripe/webhook
 *
 * Configure this URL in your Stripe Dashboard under
 * Developers → Webhooks → Add endpoint.
 * Set STRIPE_WEBHOOK_SECRET to the signing secret Stripe provides.
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing stripe-signature or webhook secret' },
      { status: 400 }
    )
  }

  if (!secretKey) {
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY is not configured' },
      { status: 503 }
    )
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-02-25.clover' })

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      // Provision access for the customer
      break
    }
    case 'customer.subscription.deleted': {
      // Revoke access for the customer
      break
    }
    default:
      // Ignore unhandled event types
      break
  }

  return NextResponse.json({ received: true })
}
