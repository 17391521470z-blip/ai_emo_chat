import { z } from "zod"
import { NextResponse } from "next/server"
import { getSupabaseForRouteHandler } from "@/lib/auth"

export const runtime = "nodejs"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
})

export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "参数不正确" }, { status: 400 })
  }

  const { email, password } = parsed.data
  const supabase = await getSupabaseForRouteHandler()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user || !data.user.email) {
    return NextResponse.json({ ok: false, error: "邮箱或密码错误" }, { status: 401 })
  }

  return NextResponse.json({
    ok: true,
    user: { id: data.user.id, email: data.user.email },
  })
}
