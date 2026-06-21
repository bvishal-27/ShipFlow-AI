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
    <div style={{ padding: 32 }}>
      <p style={{ color: "#6b7280" }}>Loading your workspace...</p>
    </div>
  )
}