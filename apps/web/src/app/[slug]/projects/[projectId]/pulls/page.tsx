"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { Nav } from "@/components/nav"

export default function PullRequestsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const { data: prs, isLoading } = trpc.github.listPRs.useQuery({ projectId })
  const { data: connection } = trpc.github.getConnection.useQuery({ projectId })

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} projectId={projectId} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "88px 24px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Pull Requests</h1>
            {connection && <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>📦 {connection.repoOwner}/{connection.repoName}</p>}
          </div>
          <button onClick={() => router.push(`/${slug}/projects/${projectId}/github`)}
            style={{ padding: "9px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            ⚙️ GitHub Settings
          </button>
        </div>

        {!connection && (
          <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-xl)", padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔀</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No repository connected</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>Connect a GitHub repo to start tracking PRs automatically</p>
            <button onClick={() => router.push(`/${slug}/projects/${projectId}/github`)}
              style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Connect Repository
            </button>
          </div>
        )}

        {connection && prs?.length === 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-xl)", padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No pull requests yet</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Open a PR on your connected repo — it will appear here automatically via webhook</p>
          </div>
        )}

        {prs && prs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(prs as any[]).map((pr: any) => (
              <div key={pr.id} onClick={() => router.push(`/${slug}/projects/${projectId}/pulls/${pr.id}`)}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px", cursor: "pointer", boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{pr.title}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>PR #{pr.githubPrNumber} · {pr.featureRequest.title}</p>
                    {pr.aiReviews.length > 0 && (
                      <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>�� {pr.aiReviews.length} AI review{pr.aiReviews.length > 1 ? "s" : ""}</p>
                    )}
                  </div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500, background: pr.status === "OPEN" ? "#EFF6FF" : pr.status === "MERGED" ? "#F5F3FF" : "#F5F5F4", color: pr.status === "OPEN" ? "#2563EB" : pr.status === "MERGED" ? "#7C3AED" : "#78716C" }}>
                    {pr.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
