import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export type PublicUser = { id: string; email: string }

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error("缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  return { url, anonKey }
}

export async function getSupabaseForRouteHandler() {
  const { url, anonKey } = getSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}

export async function getSupabaseReadOnly() {
  const { url, anonKey } = getSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll() {},
    },
  })
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const supabase = await getSupabaseReadOnly()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user?.email) return null
  return { id: user.id, email: user.email }
}
