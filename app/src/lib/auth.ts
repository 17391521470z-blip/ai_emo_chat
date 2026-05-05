import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"
import crypto from "node:crypto"
import { getDb } from "@/lib/db"

const SESSION_COOKIE_NAME = "session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30

export type PublicUser = { id: string; email: string }

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })
}

export function createSession(userId: string) {
  const db = getDb()
  const token = nanoid(48)
  const tokenHash = sha256(token)
  const now = Date.now()
  const expiresAt = now + SESSION_TTL_MS
  const id = crypto.randomUUID()

  db.prepare(
    "insert into sessions (id, user_id, token_hash, expires_at, created_at) values (?, ?, ?, ?, ?)",
  ).run(id, userId, tokenHash, expiresAt, now)

  return { token, expiresAt: new Date(expiresAt) }
}

export function deleteSessionByToken(token: string) {
  const db = getDb()
  const tokenHash = sha256(token)
  db.prepare("delete from sessions where token_hash = ?").run(tokenHash)
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const db = getDb()
  const tokenHash = sha256(token)
  const now = Date.now()
  const row = db
    .prepare(
      `
      select u.id as id, u.email as email
      from sessions s
      join users u on u.id = s.user_id
      where s.token_hash = ? and s.expires_at > ?
      limit 1
      `,
    )
    .get(tokenHash, now) as { id: string; email: string } | undefined

  if (!row) return null
  return { id: row.id, email: row.email }
}
