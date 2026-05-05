import { z } from "zod"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import {
  createSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth"

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
  const db = getDb()

  const user = db
    .prepare("select id, email, password_hash from users where email = ? limit 1")
    .get(email) as
    | { id: string; email: string; password_hash: string }
    | undefined

  if (!user) {
    return NextResponse.json({ ok: false, error: "邮箱或密码错误" }, { status: 401 })
  }

  const ok = await verifyPassword(password, user.password_hash)
  if (!ok) {
    return NextResponse.json({ ok: false, error: "邮箱或密码错误" }, { status: 401 })
  }

  const session = createSession(user.id)
  await setSessionCookie(session.token, session.expiresAt)

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
}
