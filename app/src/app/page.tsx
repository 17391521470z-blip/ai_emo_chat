import Link from "next/link"

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-rose-300 shadow-[0_0_0_3px_rgba(255,214,230,0.35)]" />
            <span className="text-black/70 dark:text-white/80">
              一个安静的地方，给你的情绪一个出口
            </span>
          </div>
          <h1 className="mt-6 text-4xl leading-[1.06] tracking-tight text-black/90 dark:text-white lg:text-6xl">
            <span className="font-[family-name:var(--app-font-serif)]">
              抱抱
            </span>
            <span className="ml-3 text-black/70 dark:text-white/70">
              AI 陪伴聊天
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-black/70 dark:text-white/70">
            你可以在这里放心地说出你的感受。AI 不会被情绪拖走，也不会评判你，
            它会温柔地听你说，给你一点点鼓励与支持。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="inline-flex h-12 items-center justify-center rounded-full bg-black/90 px-6 text-base font-semibold text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition hover:bg-black dark:bg-white/90 dark:text-black dark:hover:bg-white"
            >
              开始聊天
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-6 text-base font-semibold text-black/80 backdrop-blur transition hover:bg-[color:var(--surface-strong)] dark:text-white/80"
            >
              登录 / 注册
            </Link>
          </div>
          <div className="mt-8 max-w-xl rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-sm leading-7 text-black/65 backdrop-blur dark:text-white/65">
            <div className="font-semibold text-black/80 dark:text-white/80">
              小提醒
            </div>
            <div className="mt-1">
              这是一个学习项目，不替代专业帮助。如果你感到自己可能会伤害自己，
              请优先联系身边可信赖的人或当地紧急求助资源。
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[36px] bg-[conic-gradient(from_220deg_at_50%_50%,rgba(255,214,230,0.65),rgba(202,240,255,0.55),rgba(214,248,220,0.55),rgba(255,214,230,0.65))] blur-2xl opacity-70" />
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-300" />
                <div className="h-3 w-3 rounded-full bg-sky-300" />
                <div className="h-3 w-3 rounded-full bg-emerald-200" />
              </div>
              <div className="text-sm font-semibold text-black/70 dark:text-white/70">
                今日的小对话
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="max-w-[90%] rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 text-black/75 shadow-sm dark:bg-white/10 dark:text-white/75">
                我最近有点累，感觉没人能懂我。
              </div>
              <div className="ml-auto max-w-[90%] rounded-2xl bg-black/90 px-4 py-3 text-sm leading-7 text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)] dark:bg-white/90 dark:text-black">
                听起来你一个人扛了很久。你愿意跟我说说，这种“没人懂”的感觉，
                最强烈的时候通常发生在什么时刻吗？
              </div>
              <div className="max-w-[90%] rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 text-black/75 shadow-sm dark:bg-white/10 dark:text-white/75">
                可能是晚上吧，越安静越难受。
              </div>
              <div className="ml-auto max-w-[90%] rounded-2xl bg-black/90 px-4 py-3 text-sm leading-7 text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)] dark:bg-white/90 dark:text-black">
                晚上的安静会把情绪放大。我们先做一件很小的事：把今天最难受的
                那一秒，说成一句话。你愿意试试吗？
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,214,230,0.9),rgba(202,240,255,0.6),rgba(214,248,220,0.6))]" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-black/80 dark:text-white/80">
                  你不用表现得很坚强
                </div>
                <div className="text-xs text-black/60 dark:text-white/60">
                  你可以慢慢说，我会一直在。
                </div>
              </div>
              <Link
                href="/auth/register"
                className="inline-flex h-9 items-center justify-center rounded-full bg-black/90 px-4 text-sm font-semibold text-white transition hover:bg-black dark:bg-white/90 dark:text-black dark:hover:bg-white"
              >
                创建账号
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
