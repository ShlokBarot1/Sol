import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
})

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Strategy Consultation",
            description:
              "60-minute strategy session with SOL Advisers — includes custom roadmap & 30-day follow-up support",
          },
          unit_amount: 50000, // $500.00 — update to your consultation fee
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: email,
    metadata: { name: name ?? "", email },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?payment=cancelled`,
  })

  return NextResponse.json({ url: session.url })
}
