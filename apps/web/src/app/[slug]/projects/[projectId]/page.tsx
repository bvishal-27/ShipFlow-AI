"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string

  const { data: project, isLoading } = trpc.project.list.useQuery({
    workspaceId: projectId
  })

  if (isLoading) return <p style={{ padding: 32 }}>Loading...</p>

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            <span style={{ cursor: "pointer" }} onClick={() => router.push(`/${slug}`)}>
              {slug}
            </span> / project
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>Project Dashboard</h1>
        </div>
        <button
          onClick={() => router.push(`/${slug}/projects/${projectId}/features/new`)}
          style={{ padding: "10px 20px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
        >
          + New Feature Request
        </button>
      </div>
      <div style={{ padding: 40, border: "1px dashed #e5e7eb", borderRadius: 12, textAlign: "center" }}>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No feature requests yet</p>
        <p style={{ fontSize: 13, color: "#6b7280" }}>Submit your first feature request to get started</p>
      </div>
    </div>
  )
}