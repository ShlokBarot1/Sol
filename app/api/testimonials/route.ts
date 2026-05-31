import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { industry, quote, name, title, company, results } = body

  if (!quote?.trim() || !name?.trim() || !title?.trim() || !company?.trim() || !industry?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const cleanResults = (results as string[])?.filter((r) => r?.trim()) ?? []

  const { data, error } = await supabase
    .from("testimonials")
    .insert([{ industry, quote, name, title, company, results: cleanResults, approved: false }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Email notification
  try {
    await resend.emails.send({
      from: "SOL Advisers <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New testimonial from ${name} — ${company}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050508;color:#fff;padding:32px;border-radius:12px;">
          <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:8px;">New Testimonial Submission</p>
          <h2 style="font-size:22px;font-weight:600;margin-bottom:24px;color:#fff;">${name}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;width:90px;">Title</td><td style="color:rgba(255,255,255,0.85);font-size:13px;">${title}</td></tr>
            <tr><td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;">Company</td><td style="color:rgba(255,255,255,0.85);font-size:13px;">${company}</td></tr>
            <tr><td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;">Industry</td><td style="color:rgba(255,255,255,0.85);font-size:13px;">${industry}</td></tr>
          </table>
          <p style="font-style:italic;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.7);border-left:2px solid rgba(255,255,255,0.2);padding-left:16px;margin-bottom:20px;">"${quote}"</p>
          ${cleanResults.length > 0 ? `<p style="font-family:monospace;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.2em;margin-bottom:8px;">Key Results</p><ul style="margin:0;padding-left:16px;">${cleanResults.map((r) => `<li style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:4px;">${r}</li>`).join("")}</ul>` : ""}
          <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/testimonials" style="display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:10px 20px;color:#fff;text-decoration:none;font-size:12px;font-family:monospace;letter-spacing:0.1em;">REVIEW IN ADMIN PANEL →</a>
          </div>
        </div>
      `,
    })
  } catch {
    // Email failure is non-critical — submission still saved
  }

  return NextResponse.json(data[0], { status: 201 })
}
