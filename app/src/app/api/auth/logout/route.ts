import { NextResponse } from "next/server"
import { getSupabaseForRouteHandler } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST() {
  const supabase = await getSupabaseForRouteHandler()
  await supabase.auth.signOut().catch(() => null)
  return NextResponse.json({ ok: true })
}
