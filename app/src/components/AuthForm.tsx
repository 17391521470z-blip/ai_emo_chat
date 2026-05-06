"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Mode = "login" | "register"

export function AuthForm(props: { mode: Mode }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = props.mode === "login" ? "欢迎回来" : "创建一个小小的安全角落"
  const subtitle =
    props.mode === "login"
      ? "登录后就可以继续你的对话。"
      : "注册只需要邮箱与密码。我们不会保存你的聊天记录。"

  const disabledReason = useMemo(() => {
    if (!email.trim()) return "请输入邮箱"
    if (!password) return "请输入密码"
    if (props.mode === "register" && password.length < 8)
      return "密码至少 8 位"
    if (props.mode === "register" && confirm !== password) return "两次密码不一致"
    return null
  }, [confirm, email, password, props.mode])

  const inputClassName =
    "h-14 w-full rounded-full bg-white px-6 text-base text-black/85 outline-none ring-1 ring-black/5 transition placeholder:text-black/35 focus:ring-2 focus:ring-black/15 dark:bg-white/10 dark:text-white/90 dark:ring-white/10 dark:placeholder:text-white/35 dark:focus:ring-white/20"

  async function onSubmit() {
    const reason = disabledReason
    if (reason) {
      setError(reason)
      return
    }

    setSubmitting(true)
    setError(null)

    const endpoint = props.mode === "login" ? "/api/auth/login" : "/api/auth/register"

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const json = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null

      if (!res.ok || !json?.ok) {
        setError(json?.error || "操作失败，请稍后再试")
        return
      }
      router.replace("/chat")
    } catch {
      setError("网络似乎有点不稳定，请稍后再试")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 backdrop-blur">
        <div className="font-[family-name:var(--app-font-serif)] text-2xl tracking-tight text-black/90 dark:text-white">
          {title}
        </div>
        <div className="mt-2 text-sm leading-7 text-black/65 dark:text-white/65">
          {subtitle}
        </div>

        <div className="mt-6 grid gap-3">
          <label className="grid gap-2">
            <div className="text-xs font-semibold tracking-wide text-black/70 dark:text-white/70">
              邮箱
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClassName}
            />
          </label>

          <label className="grid gap-2">
            <div className="text-xs font-semibold tracking-wide text-black/70 dark:text-white/70">
              密码
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={props.mode === "register" ? "至少 8 位" : "你的密码"}
              autoComplete={
                props.mode === "register" ? "new-password" : "current-password"
              }
              className={inputClassName}
            />
          </label>

          {props.mode === "register" ? (
            <label className="grid gap-2">
              <div className="text-xs font-semibold tracking-wide text-black/70 dark:text-white/70">
                再确认一次
              </div>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                placeholder="再输入一次密码"
                autoComplete="new-password"
                className={inputClassName}
              />
            </label>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200/70 bg-rose-50/70 px-4 py-3 text-sm text-rose-900/80 dark:border-rose-300/20 dark:bg-rose-500/10 dark:text-rose-100/80">
            {error}
          </div>
        ) : null}

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-black/90 px-6 text-base font-semibold text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition hover:bg-black disabled:opacity-60 dark:bg-white/90 dark:text-black dark:hover:bg-white"
        >
          {submitting
            ? "稍等一下…"
            : props.mode === "login"
              ? "登录"
              : "注册并开始聊天"}
        </button>

        <div className="mt-6 flex items-center justify-between text-sm text-black/65 dark:text-white/65">
          {props.mode === "login" ? (
            <>
              <span>还没有账号？</span>
              <a className="font-semibold text-black/80 dark:text-white/80" href="/auth/register">
                去注册
              </a>
            </>
          ) : (
            <>
              <span>已经有账号了？</span>
              <a className="font-semibold text-black/80 dark:text-white/80" href="/auth/login">
                去登录
              </a>
            </>
          )}
        </div>
      </div>
      <div className="mt-5 text-center text-xs leading-6 text-black/55 dark:text-white/55">
        这是学习项目，不替代专业建议。我们不保存你的聊天记录。
      </div>
    </div>
  )
}

