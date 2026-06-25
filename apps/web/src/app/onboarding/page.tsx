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
    onSuccess: (data) => router.push(`/${data.slug}`),
    onError: (err) => setError(err.message)
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user) return
    createWorkspace.mutate({ name, slug: slug.toLowerCase().replace(/\s+/g, "-"), userId: session.user.id })
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "#FF0052", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20, margin: "0 auto 16px" }}>S</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>Create your workspace</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 14 }}>Your team's home in ShipFlow</p>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28, boxShadow: "var(--shadow-md)" }}>
          {error && <div style={{ padding: "10px 14px", background: "var(--error-light)", border: "1px solid #FECACA", borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 13, color: "var(--error)" }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Workspace name</label>
              <input type="text" placeholder="Acme Corp" value={name} onChange={e => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")) }} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Workspace URL</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-primary)" }}>
                <span style={{ padding: "10px 14px", background: "var(--bg-secondary)", color: "var(--text-tertiary)", fontSize: 13, borderRight: "1px solid var(--border)", whiteSpace: "nowrap" }}>shipflow.ai/</span>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)} required
                  style={{ flex: 1, padding: "10px 14px", border: "none", background: "transparent", fontSize: 14, outline: "none" }}
                />
              </div>
            </div>
            <button type="submit" disabled={createWorkspace.isPending}
              style={{ marginTop: 4, padding: "11px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(255,0,82,0.35)" }}
            >
              {createWorkspace.isPending ? "Creating..." : "Create workspace →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
