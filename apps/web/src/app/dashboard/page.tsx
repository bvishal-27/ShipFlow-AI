"use client"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in")
    }
  }, [session, isPending, router])

  if (isPending) return <p style={{ padding: 32 }}>Loading...</p>
  if (!session) return null

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>Welcome, {session.user.name} 👋</h1>
      <p style={{ color: "#6b7280", marginTop: 8 }}>ShipFlow AI Dashboard — let's build something.</p>
    </div>
  )
}
