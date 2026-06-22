"use client"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"

export default function NewFeaturePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const createFeature = trpc.feature.create.useMutation({
    onSuccess: (data) => {
      router.push(`/${slug}/projects/${projectId}/features/${data.id}`)
    },
    onError: (err) => {
      setError(err.message)
    }
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createFeature.mutate({ title, description, projectId })
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 480, padding: 32, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>New feature request</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Describe what you want to build — AI will help refine it</p>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Feature title</label>
            <input
              type="text"
              placeholder="e.g. Dark mode toggle"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
            <textarea
              placeholder="Describe the feature in detail. What problem does it solve? Who is it for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={5}
              style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, resize: "none" }}
            />
          </div>
          <button
            type="submit"
            disabled={createFeature.isPending}
            style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
          >
            {createFeature.isPending ? "Submitting..." : "Submit feature request"}
          </button>
        </form>
      </div>
    </div>
  )
}