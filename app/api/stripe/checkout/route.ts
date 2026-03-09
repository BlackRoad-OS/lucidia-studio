import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { authOptions } from '@/lib/auth'

/**
 * Creates a Stripe Checkout session.
 *
 * POST /api/stripe/checkout
 * Body: { priceId: string, successUrl?: string, cancelUrl?: string }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY is not configured' },
      { status: 503 }
    )
  }
  const stripe = new Stripe(secretKey, { apiVersion: '2026-02-25.clover' })

  let body: { priceId?: string; successUrl?: string; cancelUrl?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { priceId, successUrl, cancelUrl } = body
  if (!priceId) {
    return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
  }

  const origin = process.env.NEXTAUTH_URL ?? req.nextUrl.origin

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl ?? `${origin}/?checkout=success`,
    cancel_url: cancelUrl ?? `${origin}/?checkout=cancel`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
