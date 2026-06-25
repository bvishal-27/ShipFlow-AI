"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { Nav } from "@/components/nav"

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "#F5F5F4", color: "#78716C" },
  CLARIFYING: { bg: "#FFFBEB", color: "#D97706" },
  PRD_GENERATING: { bg: "#FFFBEB", color: "#D97706" },
  PRD_READY: { bg: "#EFF6FF", color: "#2563EB" },
  PLANNING: { bg: "#EFF6FF", color: "#2563EB" },
  READY_FOR_DEV: { bg: "#F5F3FF", color: "#7C3AED" },
  IN_DEVELOPMENT: { bg: "#F5F3FF", color: "#7C3AED" },
  IN_REVIEW: { bg: "#FFFBEB", color: "#D97706" },
  FIX_NEEDED: { bg: "#FEF2F2", color: "#DC2626" },
  REVIEW_PASSED: { bg: "#F0FDF4", color: "#16A34A" },
  APPROVED: { bg: "#F0FDF4", color: "#16A34A" },
  SHIPPED: { bg: "#F0FDF4", color: "#16A34A" },
  REJECTED: { bg: "#FEF2F2", color: "#DC2626" },
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string

  const { data: features, isLoading } = trpc.feature.list.useQuery({ projectId })

  const shipped = features?.filter((f: any) => f.status === "SHIPPED").length || 0
  const inReview = features?.filter((f: any) => ["IN_REVIEW", "REVIEW_PASSED"].includes(f.status)).length || 0
  const fixNeeded = features?.filter((f: any) => f.status === "FIX_NEEDED").length || 0
  const inDev = features?.filter((f: any) => ["READY_FOR_DEV", "IN_DEVELOPMENT"].includes(f.status)).length || 0

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} projectId={projectId} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "88px 24px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Project Dashboard</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>Track features from idea to production</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push(`/${slug}/projects/${projectId}/pulls`)}
              style={{ padding: "9px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", fontSize: 13, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500 }}>
              🔀 Pull Requests
            </button>
            <button onClick={() => router.push(`/${slug}/projects/${projectId}/github`)}
              style={{ padding: "9px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", fontSize: 13, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500 }}>
              ⚙️ GitHub
            </button>
            <button onClick={() => router.push(`/${slug}/projects/${projectId}/features/new`)}
              style={{ padding: "9px 16px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 14px rgba(255,0,82,0.3)" }}>
              + New Feature
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Total", value: features?.length || 0, icon: "📋", color: "var(--text-primary)" },
            { label: "Shipped", value: shipped, icon: "🚀", color: "#16A34A" },
            { label: "In Review", value: inReview, icon: "🔍", color: "#2563EB" },
            { label: "Fix Needed", value: fixNeeded, icon: "🔧", color: "#DC2626" },
          ].map(m => (
            <div key={m.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        {isLoading && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary)", fontSize: 14 }}>Loading features...</div>
        )}

        {!isLoading && features?.length === 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-xl)", padding: 48, textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No features yet</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>Submit your first feature request to get started</p>
            <button onClick={() => router.push(`/${slug}/projects/${projectId}/features/new`)}
              style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              New feature request
            </button>
          </div>
        )}

        {features && features.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {features.map((feature: any) => {
              const sc = statusColors[feature.status] || statusColors.PENDING
              const latestPR = feature.pullRequests?.[0]
              const latestReview = latestPR?.aiReviews?.[latestPR.aiReviews.length - 1]
              return (
                <div key={feature.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{feature.title}</p>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500, background: sc.bg, color: sc.color, whiteSpace: "nowrap" }}>
                          {feature.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {feature.description}
                      </p>
                      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                        {feature.tasks.length > 0 && (
                          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>📋 {feature.tasks.length} tasks</span>
                        )}
                        {latestPR && (
                          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>🔀 PR #{latestPR.githubPrNumber}</span>
                        )}
                        {latestReview && (
                          <span style={{ fontSize: 12, color: latestReview.status === "PASSED" ? "#16A34A" : "#DC2626" }}>
                            🤖 {latestReview.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => router.push(`/${slug}/projects/${projectId}/features/${feature.id}`)}
                        style={{ padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "none", fontSize: 12, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500 }}>
                        View
                      </button>
                      {feature.status === "REVIEW_PASSED" && (
                        <button onClick={() => router.push(`/${slug}/projects/${projectId}/features/${feature.id}/approve`)}
                          style={{ padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "none", background: "#FF0052", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                          🚀 Ship
                        </button>
                      )}
                      {feature.status === "SHIPPED" && (
                        <span style={{ padding: "7px 14px", fontSize: 12, color: "#16A34A", fontWeight: 600 }}>✅ Shipped</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
