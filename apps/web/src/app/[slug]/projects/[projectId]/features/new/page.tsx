"use client"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"
import { Nav } from "@/components/nav"

export default function NewFeaturePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const createFeature = trpc.feature.create.useMutation({
    onSuccess: (data) => router.push(`/${slug}/projects/${projectId}/features/${data.id}`),
    onError: (err) => setError(err.message)
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createFeature.mutate({ title, description, projectId })
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} projectId={projectId} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "88px 24px 48px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>New feature request</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Describe what you want to build — AI will refine it into a full PRD</p>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28, boxShadow: "var(--shadow-md)" }}>
          {error && (
            <div style={{ padding: "10px 14px", background: "var(--error-light)", border: "1px solid #FECACA", borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 13, color: "var(--error)" }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Feature title</label>
              <input type="text" placeholder="e.g. Dark mode toggle" value={title} onChange={e => setTitle(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Description</label>
              <textarea placeholder="Describe the feature in detail. What problem does it solve? Who is it for? What should it do?" value={description} onChange={e => setDescription(e.target.value)} required rows={5}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none", resize: "none", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div style={{ padding: "12px 16px", background: "var(--accent-light)", borderRadius: "var(--radius-md)", border: "1px solid #FFB3CA" }}>
              <p style={{ fontSize: 12, color: "#FF0052", fontWeight: 500 }}>🤖 What happens next</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>AI will ask clarifying questions → generate a full PRD → break it into engineering tasks automatically.</p>
            </div>

            <button type="submit" disabled={createFeature.isPending}
              style={{ padding: "11px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: createFeature.isPending ? "not-allowed" : "pointer", opacity: createFeature.isPending ? 0.7 : 1, boxShadow: "0 4px 14px rgba(255,0,82,0.35)" }}
            >
              {createFeature.isPending ? "Submitting..." : "Submit feature request →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
