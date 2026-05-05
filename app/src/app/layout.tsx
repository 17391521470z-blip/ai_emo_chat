import type { Metadata } from "next"
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google"
import "./globals.css"

const sans = Noto_Sans_SC({
  variable: "--app-font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const serif = Noto_Serif_SC({
  variable: "--app-font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "抱抱 | AI 陪伴聊天",
  description: "一个温柔治愈的 AI 倾听与鼓励空间",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-Hans"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="min-h-screen flex flex-col">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(1200px_900px_at_20%_0%,rgba(255,214,230,0.55),transparent_60%),radial-gradient(900px_700px_at_80%_10%,rgba(202,240,255,0.45),transparent_60%),radial-gradient(900px_700px_at_50%_100%,rgba(214,248,220,0.4),transparent_60%)]" />
            <div
              className={`absolute inset-0 opacity-[0.08] [background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")] [background-size:240px_240px]`}
            />
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
