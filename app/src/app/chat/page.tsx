import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { ChatShell } from "@/components/ChatShell"

export default async function ChatPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")
  return <ChatShell user={user} />
}
