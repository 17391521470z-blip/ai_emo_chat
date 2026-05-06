import { z } from "zod"
import { NextResponse } from "next/server"
import { getSupabaseForRouteHandler } from "@/lib/auth"

export const runtime = "nodejs"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
})

export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "参数不正确" }, { status: 400 })
  }

  const { email, password } = parsed.data
  const supabase = await getSupabaseForRouteHandler()

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    const message = error.message || "注册失败，请稍后再试"
    const status = message.includes("already") || message.includes("registered") ? 409 : 400
    return NextResponse.json({ ok: false, error: message }, { status })
  }

  const user = data.user
  if (!user || !user.email) {
    return NextResponse.json(
      { ok: false, error: "注册失败，请稍后再试" },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
}
