import { NextResponse } from "next/server"
import {
  clearSessionCookie,
  deleteSessionByToken,
} from "@/lib/auth"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (token) deleteSessionByToken(token)
  await clearSessionCookie()
  return NextResponse.json({ ok: true })
}
