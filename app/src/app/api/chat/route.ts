import { z } from "zod"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  chatMessageSchema,
  createChatCompletion,
  getSystemPrompt,
} from "@/lib/openai"

export const runtime = "nodejs"

const bodySchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(30),
})

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: "未登录" }, { status: 401 })
  }

  const json = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "参数不正确" }, { status: 400 })
  }

  const messages = [
    { role: "system" as const, content: getSystemPrompt() },
    ...parsed.data.messages,
  ]

  try {
    const content = await createChatCompletion({ messages })
    return NextResponse.json({ ok: true, message: { role: "assistant", content } })
  } catch {
    return NextResponse.json(
      { ok: false, error: "AI 暂时不可用，请稍后再试" },
      { status: 502 },
    )
  }
}
