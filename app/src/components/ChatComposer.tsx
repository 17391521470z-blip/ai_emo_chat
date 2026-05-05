"use client"

import { useEffect, useRef } from "react"

export function ChatComposer(props: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = "0px"
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 160)}px`
  }, [props.value])

  return (
    <div className="border-t border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-3">
        <div className="flex-1 rounded-3xl border border-[color:var(--border)] bg-white/70 px-4 py-3 dark:bg-white/10">
          <textarea
            ref={ref}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder="你可以慢慢说…"
            rows={1}
            className="block max-h-40 w-full resize-none bg-transparent text-sm leading-7 text-black/80 outline-none placeholder:text-black/40 dark:text-white/80 dark:placeholder:text-white/35"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (!props.disabled) props.onSend()
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-black/45 dark:text-white/45">
            <span>Enter 发送，Shift+Enter 换行</span>
            <span>{props.value.length}/4000</span>
          </div>
        </div>

        <button
          onClick={props.onSend}
          disabled={props.disabled}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-black/90 px-6 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60 dark:bg-white/90 dark:text-black dark:hover:bg-white"
        >
          发送
        </button>
      </div>
    </div>
  )
}

