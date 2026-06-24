"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "#f1f5f9", color: "#475569" },
  CLARIFYING: { bg: "#fef3c7", color: "#92400e" },
  PRD_GENERATING: { bg: "#fef3c7", color: "#92400e" },
  PRD_READY: { bg: "#dbeafe", color: "#1d4ed8" },
  PLANNING: { bg: "#dbeafe", color: "#1d4ed8" },
  READY_FOR_DEV: { bg: "#ede9fe", color: "#6d28d9" },
  IN_DEVELOPMENT: { bg: "#ede9fe", color: "#6d28d9" },
  IN_REVIEW: { bg: "#fef3c7", color: "#92400e" },
  FIX_NEEDED: { bg: "#fef2f2", color: "#dc2626" },
  REVIEW_PASSED: { bg: "#dcfce7", color: "#15803d" },
  APPROVED: { bg: "#dcfce7", color: "#15803d" },
  SHIPPED: { bg: "#dcfce7", color: "#15803d" },
  REJECTED: { bg: "#fef2f2", color: "#dc2626" },
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string

  const { data: features, isLoading } = trpc.feature.list.useQuery({ projectId })

  const shipped = features?.filter(f => f.status === "SHIPPED").length || 0
  const inReview = features?.filter(f => f.status === "IN_REVIEW" || f.status === "REVIEW_PASSED").length || 0
  const fixNeeded = features?.filter(f => f.status === "FIX_NEEDED").length || 0

  if (isLoading) return <p style={{ padding: 32 }}>Loading...</p>

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: "#6b7280", cursor: "pointer" }} onClick={() => router.push(`/${slug}`)}>
            ← {slug}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>Project Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => router.push(`/${slug}/projects/${projectId}/pulls`)}
            style={{ padding: "8px 14px", borderRadius: 8, background: "#f1f5f9", color: "#18181b", fontSize: 13, cursor: "pointer", border: "1px solid #e5e7eb" }}
          >
            🔀 Pull Requests
          </button>
          <button
            onClick={() => router.push(`/${slug}/projects/${projectId}/features/new`)}
            style={{ padding: "8px 14px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 13, cursor: "pointer", border: "none" }}
          >
            + New Feature
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: features?.length || 0, color: "#18181b" },
          { label: "Shipped", value: shipped, color: "#15803d" },
          { label: "In Review", value: inReview, color: "#1d4ed8" },
          { label: "Fix Needed", value: fixNeeded, color: "#dc2626" },
        ].map(m => (
          <div key={m.label} style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10, textAlign: "center" }}>
            <p style={{ fontSize: 24, fontWeight: 600, color: m.color }}>{m.value}</p>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Features list */}
      {features?.length === 0 && (
        <div style={{ padding: 40, border: "1px dashed #e5e7eb", borderRadius: 12, textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No feature requests yet</p>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Submit your first feature request to get started</p>
        </div>
      )}

      {features && features.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map(feature => {
            const sc = statusColors[feature.status] || statusColors.PENDING
            const latestPR = feature.pullRequests?.[0]
            const latestReview = latestPR?.aiReviews?.[latestPR.aiReviews.length - 1]
            return (
              <div
                key={feature.id}
                style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10, cursor: "pointer", background: "#fff" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{feature.title}</p>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500, background: sc.bg, color: sc.color }}>
                    {feature.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{feature.description.slice(0, 80)}...</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => router.push(`/${slug}/projects/${projectId}/features/${feature.id}`)}
                    style={{ padding: "6px 12px", borderRadius: 6, background: "#f1f5f9", color: "#18181b", fontSize: 12, cursor: "pointer", border: "none" }}
                  >
                    View Feature
                  </button>
                  {feature.status === "REVIEW_PASSED" && (
                    <button
                      onClick={() => router.push(`/${slug}/projects/${projectId}/features/${feature.id}/approve`)}
                      style={{ padding: "6px 12px", borderRadius: 6, background: "#15803d", color: "#fff", fontSize: 12, cursor: "pointer", border: "none" }}
                    >
                      🚀 Approve & Ship
                    </button>
                  )}
                  {feature.status === "SHIPPED" && (
                    <span style={{ padding: "6px 12px", fontSize: 12, color: "#15803d", fontWeight: 500 }}>
                      ✅ Shipped
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
