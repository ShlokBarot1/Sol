import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { firstName, lastName, email, phone, companyName, projectDescription } = body

  if (!firstName || !lastName || !email || !companyName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Save to Supabase
  const { error: dbError } = await supabase.from("consultations").insert([
    {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      company_name: companyName,
      project_description: projectDescription,
    },
  ])

  if (dbError) {
    console.error("Supabase error:", dbError)
    // Non-blocking — still send email notification
  }

  // Send notification email
  try {
    await resend.emails.send({
      from: "SOL Advisers <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New Consultation Request — ${firstName} ${lastName} · ${companyName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050508;color:#fff;padding:32px;border-radius:12px;">
          <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:8px;">
            New Consultation Request
          </p>
          <h2 style="font-size:22px;font-weight:600;margin-bottom:24px;color:#fff;">
            ${firstName} ${lastName}
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;width:120px;">Email</td><td style="color:rgba(255,255,255,0.85);font-size:13px;">${email}</td></tr>
            <tr><td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;">Phone</td><td style="color:rgba(255,255,255,0.85);font-size:13px;">${phone || "—"}</td></tr>
            <tr><td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:12px;">Company</td><td style="color:rgba(255,255,255,0.85);font-size:13px;">${companyName}</td></tr>
          </table>
          <p style="font-family:monospace;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">Project Description</p>
          <p style="font-size:13px;line-height:1.65;color:rgba(255,255,255,0.65);border-left:2px solid rgba(255,255,255,0.15);padding-left:14px;margin-bottom:28px;">
            ${projectDescription}
          </p>
          <div style="padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);">
            <p style="font-size:11px;color:rgba(255,255,255,0.3);">
              Client has been directed to Calendly to schedule their free consultation.
            </p>
          </div>
        </div>
      `,
    })
  } catch {
    // Email failure is non-critical
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
