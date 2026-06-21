"use client"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useSession } from "@/lib/auth-client"
import { useParams, useRouter } from "next/navigation"

export default function NewProjectPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const { data: workspace } = trpc.workspace.getBySlug.useQuery({ slug })

  const createProject = trpc.project.create.useMutation({
    onSuccess: (data) => {
      router.push(`/${slug}/projects/${data.id}`)
    },
    onError: (err) => {
      setError(err.message)
    }
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workspace) return
    createProject.mutate({
      name,
      description,
      workspaceId: workspace.id,
    })
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, padding: 32, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Create a project</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Projects hold your feature requests and PRDs</p>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Project name</label>
            <input
              type="text"
              placeholder="My Awesome App"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Description (optional)</label>
            <textarea
              placeholder="What are you building?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, resize: "none" }}
            />
          </div>
          <button
            type="submit"
            disabled={createProject.isPending}
            style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
          >
            {createProject.isPending ? "Creating..." : "Create project"}
          </button>
        </form>
      </div>
    </div>
  )
}