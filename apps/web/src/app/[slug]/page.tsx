"use client"
import { useSession } from "@/lib/auth-client"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WorkspacePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in")
    }
  }, [session, isPending, router])

  if (isPending) return <p style={{ padding: 32 }}>Loading...</p>
  if (!session) return null

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>Welcome to {slug} 👋</h1>
      <p style={{ color: "#6b7280", marginTop: 8 }}>Your workspace is ready. Let's create a project.</p>
      <button
        onClick={() => router.push(`/${slug}/projects/new`)}
        style={{ marginTop: 24, padding: "10px 20px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
      >
        Create first project
      </button>
    </div>
  )
}