"use client"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"
import { Nav } from "@/components/nav"

export default function NewProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const { data: workspace } = trpc.workspace.getBySlug.useQuery({ slug })

  const createProject = trpc.project.create.useMutation({
    onSuccess: (data) => router.push(`/${slug}/projects/${data.id}`),
    onError: (err) => setError(err.message)
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workspace) return
    createProject.mutate({ name, description, workspaceId: workspace.id })
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "88px 24px 48px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>New project</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Projects hold your feature requests and repositories</p>
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28, boxShadow: "var(--shadow-md)" }}>
          {error && <div style={{ padding: "10px 14px", background: "var(--error-light)", borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 13, color: "var(--error)" }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Project name</label>
              <input type="text" placeholder="My Awesome App" value={name} onChange={e => setName(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Description <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span></label>
              <textarea placeholder="What are you building?" value={description} onChange={e => setDescription(e.target.value)} rows={3}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none", resize: "none" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <button type="submit" disabled={createProject.isPending}
              style={{ marginTop: 4, padding: "11px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(255,0,82,0.35)" }}
            >
              {createProject.isPending ? "Creating..." : "Create project →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
