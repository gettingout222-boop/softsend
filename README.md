# SoftSend

AI-powered tool that rewrites awkward messages to make them clearer and more natural.

**Pricing:** $1 per rewrite or credit packs (10 for $7 / 50 for $25)

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS
- Anthropic Claude
- Stripe Checkout
- Upstash Redis (credits)
- localStorage (history + anonymous user ID)

## Getting Started

1. Clone the repo
2. `npm install`
3. Copy `.env.example` → `.env.local` and fill in the keys
4. `npm run dev`

## Environment Variables

See `.env.example`.

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add the same environment variables
4. Deploy

For Stripe webhooks, point the webhook endpoint to `https://yourdomain.com/api/webhook` and select `checkout.session.completed`.

## Notes

- No full user accounts – uses anonymous localStorage user ID
- History is stored only in the browser (last 10)
- Credits live in Upstash Redis
