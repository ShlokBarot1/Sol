import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { action, passcode } = body

  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (action === "approve") {
    const { error } = await supabaseAdmin
      .from("testimonials")
      .update({ approved: true })
      .eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "reject") {
    const { error } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
