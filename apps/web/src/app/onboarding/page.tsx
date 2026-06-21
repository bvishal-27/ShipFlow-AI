"use client"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [error, setError] = useState("")

  const createWorkspace = trpc.workspace.create.useMutation({
    onSuccess: (data) => {
      router.push(`/${data.slug}`)
    },
    onError: (err) => {
      setError(err.message)
    }
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user) return
    createWorkspace.mutate({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      userId: session.user.id,
    })
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, padding: 32, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Create your workspace</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>This is your team's home in ShipFlow</p>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Workspace name</label>
            <input
              type="text"
              placeholder="Acme Corp"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }}
              required
              style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Workspace URL</label>
            <div style={{ display: "flex", alignItems: "center", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
              <span style={{ color: "#9ca3af" }}>shipflow.ai/</span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
                style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={createWorkspace.isPending}
            style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
          >
            {createWorkspace.isPending ? "Creating..." : "Create workspace"}
          </button>
        </form>
      </div>
    </div>
  )
}