"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { useState } from "react"

export default function PRDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const prId = params.prId as string
  const [reviewing, setReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState<any>(null)

  const { data: prs, refetch } = trpc.github.listPRs.useQuery({ projectId })
  const pr = prs?.find(p => p.id === prId)

  async function runReview() {
    setReviewing(true)
    try {
      const res = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pullRequestId: prId }),
      })
      const data = await res.json()
      setReviewResult(data)
      refetch()
    } catch (err) {
      console.error(err)
    }
    setReviewing(false)
  }

  if (!pr) return <p style={{ padding: 32 }}>Loading...</p>

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 32 }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8, cursor: "pointer" }}
        onClick={() => router.push(`/${slug}/projects/${projectId}/pulls`)}>
        ← Back to Pull Requests
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>{pr.title}</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            PR #{pr.githubPrNumber} · {pr.featureRequest.title}
          </p>
          <a href={pr.githubPrUrl} target="_blank" style={{ fontSize: 12, color: "#3b82f6", marginTop: 4, display: "block" }}>
            View on GitHub ↗
          </a>
        </div>
        <span style={{
          fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500,
          background: pr.status === "OPEN" ? "#dbeafe" : "#ede9fe",
          color: pr.status === "OPEN" ? "#1d4ed8" : "#6d28d9"
        }}>
          {pr.status}
        </span>
      </div>

      <button
        onClick={runReview}
        disabled={reviewing}
        style={{
          width: "100%", padding: "12px", borderRadius: 8,
          background: reviewing ? "#f1f5f9" : "#7c3aed",
          color: reviewing ? "#6b7280" : "#fff",
          fontSize: 14, cursor: reviewing ? "not-allowed" : "pointer",
          border: "none", marginBottom: 24, fontWeight: 500
        }}
      >
        {reviewing ? "🤖 AI is reviewing the PR..." : "🤖 Run AI Review"}
      </button>

      {reviewResult && (
        <div style={{
          padding: 16, borderRadius: 8, marginBottom: 24,
          background: reviewResult.passed ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${reviewResult.passed ? "#bbf7d0" : "#fecaca"}`
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: reviewResult.passed ? "#15803d" : "#dc2626" }}>
            {reviewResult.passed ? "✅ Review Passed!" : "❌ Review Failed"}
          </p>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            {reviewResult.blockingCount} blocking · {reviewResult.nonBlockingCount} non-blocking
          </p>
        </div>
      )}

      {pr.aiReviews.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Review History</h2>
          {pr.aiReviews.map((review, i) => (
            <div key={review.id} style={{ marginBottom: 16, padding: 16, border: "1px solid #e5e7eb", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>Review #{review.reviewNumber}</p>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500,
                  background: review.status === "PASSED" ? "#f0fdf4" : review.status === "FAILED" ? "#fef2f2" : "#f1f5f9",
                  color: review.status === "PASSED" ? "#15803d" : review.status === "FAILED" ? "#dc2626" : "#475569"
                }}>
                  {review.status}
                </span>
              </div>

              {review.summary && (
                <p style={{ fontSize: 13, color: "#374151", marginBottom: 12 }}>{review.summary}</p>
              )}

              {(review.blockingIssues as any[]).length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", marginBottom: 6 }}>Blocking Issues:</p>
                  {(review.blockingIssues as any[]).map((issue, j) => (
                    <div key={j} style={{ padding: "8px 12px", background: "#fef2f2", borderRadius: 6, marginBottom: 4 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "#dc2626" }}>{issue.criterion}</p>
                      <p style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>{issue.issue}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>💡 {issue.suggestion}</p>
                    </div>
                  ))}
                </div>
              )}

              {(review.nonBlockingIssues as any[]).length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#d97706", marginBottom: 6 }}>Non-Blocking:</p>
                  {(review.nonBlockingIssues as any[]).map((issue, j) => (
                    <div key={j} style={{ padding: "8px 12px", background: "#fffbeb", borderRadius: 6, marginBottom: 4 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "#d97706" }}>{issue.area}</p>
                      <p style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>{issue.issue}</p>
                    </div>
                  ))}
                </div>
              )}

              {review.postedToGithub && (
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>✅ Posted to GitHub PR</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
