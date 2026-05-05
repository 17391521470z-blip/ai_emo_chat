import { z } from "zod"
import crypto from "node:crypto"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { createSession, hashPassword, setSessionCookie } from "@/lib/auth"

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
  const db = getDb()

  const existing = db
    .prepare("select id from users where email = ? limit 1")
    .get(email) as { id: string } | undefined
  if (existing) {
    return NextResponse.json({ ok: false, error: "该邮箱已注册" }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)
  const id = crypto.randomUUID()
  const now = Date.now()

  db.prepare(
    "insert into users (id, email, password_hash, created_at) values (?, ?, ?, ?)",
  ).run(id, email, passwordHash, now)

  const session = createSession(id)
  await setSessionCookie(session.token, session.expiresAt)

  return NextResponse.json({ ok: true, user: { id, email } })
}
