# Lucidia Studio

> Creative AI tools for artists, designers, and dreamers — built on **BlackRoad OS** infrastructure.

[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)

---

## 🌌 Overview

**Lucidia Studio** is the creative-AI flagship product of [BlackRoad OS, Inc.](https://blackroad.io)  
It provides a vendor-agnostic AI gateway, OAuth-secured user accounts, and integrated Stripe billing — all traffic routed through **your own infrastructure** (Tailscale mesh, Cloudflare Workers, or any reverse proxy), never directly to third-party AI providers.

---

## 📦 Features

| Feature | Description |
|---|---|
| 🔐 **OAuth Login** | GitHub & Google sign-in via NextAuth.js |
| 🌐 **Custom AI Gateway** | Proxies all AI requests through your infra — no direct vendor calls |
| 💳 **Stripe Billing** | Subscription checkout and webhook handling |
| 🚀 **Production-ready** | TypeScript, Next.js 14 App Router, deployable to Vercel or self-hosted |

---

## 🏗️ Architecture

```
User → Lucidia Studio (Next.js)
         ├── /api/auth/[...nextauth]  → OAuth (GitHub, Google)
         ├── /api/ai                  → AI Gateway proxy → Your infra endpoint
         └── /api/stripe/             → Stripe checkout & webhooks
```

**Traffic flow for AI requests:**

```
Client → /api/ai (Next.js) → AI_API_BASE_URL (your relay)
```

Set `AI_API_BASE_URL` to your Cloudflare Worker, Tailscale node, or local proxy.  
The endpoint must speak the [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat) format.

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/BlackRoad-OS/lucidia-studio.git
cd lucidia-studio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your real values
```

See [`.env.example`](.env.example) for all required variables.

### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🔐 OAuth Setup

Lucidia Studio uses **NextAuth.js** for authentication.

### GitHub

1. Go to [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App:
   - **Homepage URL:** `https://lucidia.studio`
   - **Authorization callback URL:** `https://lucidia.studio/api/auth/callback/github`
3. Copy **Client ID** and **Client Secret** into `.env.local`

### Google

1. Go to [Google Cloud Console → APIs & Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
   - **Authorized redirect URI:** `https://lucidia.studio/api/auth/callback/google`
3. Copy **Client ID** and **Client Secret** into `.env.local`

---

## 🌐 Custom AI Gateway

All AI requests are **proxied through your own infrastructure**, not sent directly to OpenAI or Anthropic.

Set `AI_API_BASE_URL` to any endpoint that speaks the OpenAI-compatible chat completions format:

```bash
# .env.local

# Cloudflare Worker relay
AI_API_BASE_URL=https://ai-gateway.example.workers.dev

# Tailscale node
AI_API_BASE_URL=http://100.x.x.x:8080

# Local proxy
AI_API_BASE_URL=http://localhost:8080
```

**API usage:**

```bash
curl -X POST /api/ai \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}]}'
```

> Requires an active session (OAuth login).

---

## 💳 Stripe Setup

### Create a product

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create a product and copy the **Price ID** (e.g. `price_xxx`)
3. Set `STRIPE_PRICE_ID` in `.env.local`

### Configure webhook

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://lucidia.studio/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET`

### Trigger a checkout

```bash
curl -X POST /api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_xxx"}'
# Returns: { "url": "https://checkout.stripe.com/..." }
```

---

## 🏢 Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
# Set environment variables in Vercel Dashboard → Project → Settings → Environment Variables
```

### Self-hosted (Docker / Raspberry Pi / Tailscale)

```bash
npm run build
npm start
# Runs on port 3000 by default
```

---

## 📊 Infrastructure

| | |
|---|---|
| **Organization** | BlackRoad OS, Inc. |
| **CEO** | Alexa Amundson |
| **Contact** | blackroad.systems@gmail.com |
| **License** | Proprietary — see [LICENSE](LICENSE) |

---

## 📜 License

**Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.**

This software is the proprietary property of BlackRoad OS, Inc. and is **not for commercial resale**.  
See [LICENSE](LICENSE) for complete terms.

