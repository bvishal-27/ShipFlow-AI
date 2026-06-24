"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { useSession } from "@/lib/auth-client"
import { useState } from "react"

export default function ApprovePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const featureId = params.featureId as string
  const [notes, setNotes] = useState("")
  const [done, setDone] = useState(false)

  const { data: feature } = trpc.feature.getById.useQuery({ id: featureId })

  const approve = trpc.feature.approve.useMutation({
    onSuccess: () => {
      setDone(true)
      setTimeout(() => router.push(`/${slug}/projects/${projectId}`), 2000)
    }
  })

  if (!feature) return <p style={{ padding: 32 }}>Loading...</p>

  const latestPR = feature.pullRequests?.[0]
  const latestReview = latestPR?.aiReviews?.[latestPR.aiReviews.length - 1]
  const allTasksDone = feature.tasks.length > 0
  const hasPRD = !!feature.prd
  const reviewPassed = latestReview?.status === "PASSED"

  if (done) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 32, textAlign: "center" }}>
        <p style={{ fontSize: 32, marginBottom: 16 }}>🚀</p>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Feature Shipped!</h1>
        <p style={{ color: "#6b7280", marginTop: 8 }}>Redirecting to project...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 32 }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8, cursor: "pointer" }}
        onClick={() => router.push(`/${slug}/projects/${projectId}/features/${featureId}`)}>
        ← Back to feature
      </p>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Human Approval Gate</h1>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
        Review everything before shipping — {feature.title}
      </p>

      {/* Checklist */}
      <div style={{ padding: 20, border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Pre-ship Checklist</h2>
        {[
          { label: "PRD generated", done: hasPRD },
          { label: "Engineering tasks created", done: allTasksDone },
          { label: "GitHub PR linked", done: !!latestPR },
          { label: "AI review completed", done: !!latestReview },
          { label: "AI review passed", done: reviewPassed },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>{item.done ? "✅" : "⏳"}</span>
            <span style={{ fontSize: 14, color: item.done ? "#15803d" : "#6b7280" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* PRD Summary */}
      {feature.prd && (
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📄 PRD Summary</h2>
          <p style={{ fontSize: 13, color: "#374151" }}>{feature.prd.problemStatement}</p>
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "#6b7280" }}>Acceptance Criteria:</p>
            {feature.prd.acceptanceCriteria.map((c, i) => (
              <p key={i} style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>✓ {c}</p>
            ))}
          </div>
        </div>
      )}

      {/* AI Review Summary */}
      {latestReview && (
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🤖 Latest AI Review</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500,
              background: latestReview.status === "PASSED" ? "#f0fdf4" : "#fef2f2",
              color: latestReview.status === "PASSED" ? "#15803d" : "#dc2626"
            }}>
              {latestReview.status}
            </span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {(latestReview.blockingIssues as any[]).length} blocking · {(latestReview.nonBlockingIssues as any[]).length} non-blocking
            </span>
          </div>
          {latestReview.summary && (
            <p style={{ fontSize: 13, color: "#374151" }}>{latestReview.summary}</p>
          )}
        </div>
      )}

      {/* PR Info */}
      {latestPR && (
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🔀 Pull Request</h2>
          <p style={{ fontSize: 13 }}>#{latestPR.githubPrNumber} — {latestPR.title}</p>
          <a href={latestPR.githubPrUrl} target="_blank" style={{ fontSize: 12, color: "#3b82f6" }}>View on GitHub ↗</a>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 500 }}>Reviewer notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any comments about this release..."
          rows={3}
          style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, resize: "none" }}
        />
      </div>

      {/* Approval buttons */}
      {feature.humanApproval ? (
        <div style={{ padding: 16, background: feature.humanApproval.decision === "APPROVED" ? "#f0fdf4" : "#fef2f2", borderRadius: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 500 }}>
            {feature.humanApproval.decision === "APPROVED" ? "✅ Approved and Shipped" : "❌ Rejected"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => approve.mutate({
              featureId,
              reviewerId: session?.user?.id || "",
              decision: "APPROVED",
              notes,
            })}
            disabled={approve.isPending}
            style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#15803d", color: "#fff", fontSize: 14, cursor: "pointer", border: "none", fontWeight: 500 }}
          >
            🚀 Approve & Ship
          </button>
          <button
            onClick={() => approve.mutate({
              featureId,
              reviewerId: session?.user?.id || "",
              decision: "REJECTED",
              notes,
            })}
            disabled={approve.isPending}
            style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#dc2626", color: "#fff", fontSize: 14, cursor: "pointer", border: "none", fontWeight: 500 }}
          >
            ❌ Reject
          </button>
        </div>
      )}
    </div>
  )
}
