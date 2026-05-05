"use client"

export function CrisisBanner(props: { onClose?: () => void }) {
  return (
    <div className="rounded-3xl border border-rose-200/70 bg-rose-50/80 p-5 text-rose-950/80 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.25)] backdrop-blur dark:border-rose-300/20 dark:bg-rose-500/10 dark:text-rose-100/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-[family-name:var(--app-font-serif)] text-lg font-semibold">
            你并不孤单
          </div>
          <div className="mt-2 text-sm leading-7">
            如果你正在经历强烈的痛苦，或有伤害自己的想法，请优先联系身边可信赖的人、
            专业机构，或当地紧急求助资源。你值得被认真地照顾。
          </div>
          <div className="mt-3 text-sm leading-7">
            如果你愿意，你也可以先告诉我：此刻最难受的是什么？我们可以一起把它拆成更小的一步。
          </div>
        </div>
        {props.onClose ? (
          <button
            onClick={props.onClose}
            className="shrink-0 rounded-full border border-rose-200/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-rose-950/80 transition hover:bg-white dark:border-rose-300/20 dark:bg-white/10 dark:text-rose-100/80 dark:hover:bg-white/15"
          >
            收起
          </button>
        ) : null}
      </div>
    </div>
  )
}

