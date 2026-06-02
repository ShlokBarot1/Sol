import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

export const supabase = url ? createClient(url, anon) : null as any
export const supabaseAdmin = url ? createClient(url, service) : null as any
