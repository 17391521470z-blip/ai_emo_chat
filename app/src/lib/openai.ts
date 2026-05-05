import { z } from "zod"

export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1).max(4000),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>

function getBaseUrl() {
  const base = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
  return base.replace(/\/+$/, "")
}

export function getSystemPrompt() {
  return [
    "你是一个温柔、可靠、稳定的陪伴型倾听者。",
    "你的目标是：接纳用户情绪、用共情回应、帮助用户把感受说清楚，并给予温和的鼓励与支持。",
    "你可以提出开放式问题帮助用户继续表达，但避免连珠炮式提问。",
    "避免提供医疗/法律等专业诊断与结论；如果涉及严重风险，建议用户联系专业人士或当地紧急求助资源。",
    "语气保持：温柔、真诚、不评判、不说教、不命令。",
    "输出语言：中文。",
  ].join("\n")
}

export async function createChatCompletion(input: {
  messages: ChatMessage[]
}) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("缺少 OPENAI_API_KEY")
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const url = `${getBaseUrl()}/chat/completions`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: input.messages,
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`OpenAI 请求失败: ${res.status} ${text}`)
  }

  const json = (await res.json().catch(() => null)) as
    | {
        choices?: Array<{
          message?: { role?: string; content?: string }
        }>
      }
    | null
  const content = json?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("OpenAI 返回为空")
  }
  return content
}

