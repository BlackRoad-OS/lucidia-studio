import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Vendor-agnostic AI API proxy.
 *
 * Routes requests through the configured API gateway instead of directly to
 * third-party vendors (OpenAI, Anthropic, etc.). Set AI_API_BASE_URL to your
 * own infrastructure endpoint (e.g. a Cloudflare Worker, Tailscale node, or
 * local relay) to keep all traffic inside your network.
 *
 * POST /api/ai
 * Body: { model: string, messages: object[], ...rest }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.AI_API_BASE_URL
  if (!baseUrl) {
    return NextResponse.json(
      { error: 'AI_API_BASE_URL is not configured' },
      { status: 503 }
    )
  }

  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI_API_KEY is not configured' },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}
