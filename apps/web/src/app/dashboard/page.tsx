"use client"
import { useSession } from "@/lib/auth-client"
import { trpc } from "@/lib/trpc"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const { data: workspaces, isLoading } = trpc.workspace.getByUserId.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: !!session?.user?.id }
  )

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (!isLoading && workspaces) {
      if (workspaces.length === 0) {
        router.push("/onboarding")
      } else {
        router.push(`/${workspaces[0].slug}`)
      }
    }
  }, [workspaces, isLoading, router])

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "#FF0052", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20, margin: "0 auto 16px" }}>S</div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Loading your workspace...</p>
      </div>
    </div>
  )
}
