"use client"

import { useEffect, useRef } from "react"

export type UiMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatMessageList(props: { messages: UiMessage[] }) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [props.messages.length])

  return (
    <div className="flex-1 overflow-auto px-2 pb-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {props.messages.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-sm leading-7 text-black/65 backdrop-blur dark:text-white/65">
            <div className="font-[family-name:var(--app-font-serif)] text-lg font-semibold text-black/80 dark:text-white/80">
              先从一句话开始
            </div>
            <div className="mt-2">
              你可以说：“我今天有点难受。” 或者 “我想有人听我说说。” 我会认真听你讲。
            </div>
          </div>
        ) : null}

        {props.messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "assistant" ? "flex justify-start" : "flex justify-end"}
          >
            <div
              className={
                m.role === "assistant"
                  ? "max-w-[92%] rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 text-sm leading-7 text-black/80 shadow-sm backdrop-blur dark:text-white/80"
                  : "max-w-[92%] rounded-3xl bg-black/90 px-5 py-4 text-sm leading-7 text-white shadow-[0_18px_50px_-30px_rgba(0,0,0,0.5)] dark:bg-white/90 dark:text-black"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  )
}

