"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"

export default function PullRequestsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string

  const { data: prs, isLoading } = trpc.github.listPRs.useQuery({ projectId })
  const { data: connection } = trpc.github.getConnection.useQuery({ projectId })

  if (isLoading) return <p style={{ padding: 32 }}>Loading...</p>

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>Pull Requests</h1>
          {connection && (
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              📦 {connection.repoOwner}/{connection.repoName}
            </p>
          )}
        </div>
        <button
          onClick={() => router.push(`/${slug}/projects/${projectId}/github`)}
          style={{ padding: "8px 16px", borderRadius: 8, background: "#f1f5f9", color: "#18181b", fontSize: 13, cursor: "pointer", border: "1px solid #e5e7eb" }}
        >
          ⚙️ GitHub Settings
        </button>
      </div>

      {!connection && (
        <div style={{ padding: 40, border: "1px dashed #e5e7eb", borderRadius: 12, textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No repository connected</p>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Connect a GitHub repo to start tracking PRs</p>
          <button
            onClick={() => router.push(`/${slug}/projects/${projectId}/github`)}
            style={{ padding: "10px 20px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
          >
            Connect Repository
          </button>
        </div>
      )}

      {connection && prs?.length === 0 && (
        <div style={{ padding: 40, border: "1px dashed #e5e7eb", borderRadius: 12, textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No pull requests yet</p>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Open a PR on your connected repo — it will appear here automatically</p>
        </div>
      )}

      {prs && prs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {prs.map(pr => (
            <div
              key={pr.id}
              onClick={() => router.push(`/${slug}/projects/${projectId}/pulls/${pr.id}`)}
              style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10, cursor: "pointer", background: "#fff" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{pr.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    PR #{pr.githubPrNumber} · {pr.featureRequest.title}
                  </p>
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500,
                  background: pr.status === "OPEN" ? "#dbeafe" : pr.status === "MERGED" ? "#ede9fe" : "#f1f5f9",
                  color: pr.status === "OPEN" ? "#1d4ed8" : pr.status === "MERGED" ? "#6d28d9" : "#475569"
                }}>
                  {pr.status}
                </span>
              </div>
              {pr.aiReviews.length > 0 && (
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                  🤖 {pr.aiReviews.length} AI review{pr.aiReviews.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}