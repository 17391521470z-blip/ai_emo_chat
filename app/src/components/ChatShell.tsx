"use client"

import { nanoid } from "nanoid"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatComposer } from "@/components/ChatComposer"
import { ChatMessageList, UiMessage } from "@/components/ChatMessageList"
import { CrisisBanner } from "@/components/CrisisBanner"
import { isCrisisText } from "@/lib/crisis"

export function ChatShell(props: { user: { id: string; email: string } }) {
  const router = useRouter()
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCrisis, setShowCrisis] = useState(false)

  const crisisActive = useMemo(() => showCrisis, [showCrisis])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null)
    router.replace("/")
  }

  async function send() {
    const text = input.trim()
    if (!text || busy) return

    setInput("")
    setError(null)

    const nextMessages: UiMessage[] = [
      ...messages,
      { id: nanoid(), role: "user", content: text },
    ]
    setMessages(nextMessages)

    if (isCrisisText(text)) setShowCrisis(true)

    const apiMessages = nextMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    setBusy(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages.slice(-20) }),
      })
      const json = (await res.json().catch(() => null)) as
        | { ok: true; message: { role: "assistant"; content: string } }
        | { ok: false; error?: string }
        | null

      if (!res.ok || !json || !json.ok) {
        const err = json && !json.ok ? json.error : null
        setError(err || "发送失败，请稍后再试")
        return
      }

      setMessages((prev) => [
        ...prev,
        { id: nanoid(), role: "assistant", content: json.message.content },
      ])
    } catch {
      setError("网络似乎有点不稳定，请稍后再试")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="sticky top-0 z-10 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-black/80 dark:text-white/80">
              {props.user.email}
            </div>
            <div className="text-xs text-black/55 dark:text-white/55">
              不保存聊天记录 · 你可以慢慢说
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm font-semibold text-black/75 transition hover:bg-white/80 dark:text-white/75 dark:hover:bg-white/10"
          >
            退出
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-2 pt-4">
        {crisisActive ? (
          <CrisisBanner onClose={() => setShowCrisis(false)} />
        ) : null}
        {error ? (
          <div className="mt-4 rounded-3xl border border-amber-200/70 bg-amber-50/70 px-5 py-4 text-sm text-amber-950/80 dark:border-amber-200/15 dark:bg-amber-500/10 dark:text-amber-100/80">
            {error}
          </div>
        ) : null}
      </div>

      <ChatMessageList messages={messages} />
      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={send}
        disabled={busy || input.trim().length === 0 || input.length > 4000}
      />
    </main>
  )
}
