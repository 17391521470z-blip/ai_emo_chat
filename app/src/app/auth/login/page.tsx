import { AuthForm } from "@/components/AuthForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] backdrop-blur">
            ←
          </span>
          回到首页
        </Link>
        <div className="mt-10 flex justify-center">
          <AuthForm mode="login" />
        </div>
      </div>
    </main>
  )
}
