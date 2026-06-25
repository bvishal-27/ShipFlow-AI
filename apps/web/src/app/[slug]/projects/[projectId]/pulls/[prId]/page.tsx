"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { useState } from "react"
import { Nav } from "@/components/nav"

export default function PRDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const prId = params.prId as string
  const [reviewing, setReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState<any>(null)

  const { data: prs, refetch } = trpc.github.listPRs.useQuery({ projectId })
  const pr = (prs as any[])?.find((p: any) => p.id === prId)

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
    } catch (err) { console.error(err) }
    setReviewing(false)
  }

  if (!pr) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-tertiary)" }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} projectId={projectId} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "88px 24px 48px" }}>
        <button onClick={() => router.push(`/${slug}/projects/${projectId}/pulls`)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, padding: 0 }}>
          ← Back to Pull Requests
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>{pr.title}</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>PR #{pr.githubPrNumber} · {pr.featureRequest.title}</p>
            <a href={pr.githubPrUrl} target="_blank" style={{ fontSize: 12, color: "#FF0052", marginTop: 4, display: "block" }}>View on GitHub ↗</a>
          </div>
          <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 99, fontWeight: 500, background: pr.status === "OPEN" ? "#EFF6FF" : "#F5F3FF", color: pr.status === "OPEN" ? "#2563EB" : "#7C3AED" }}>
            {pr.status}
          </span>
        </div>

        <button onClick={runReview} disabled={reviewing}
          style={{ width: "100%", padding: 14, borderRadius: "var(--radius-lg)", border: "none", background: reviewing ? "var(--bg-secondary)" : "#FF0052", color: reviewing ? "var(--text-secondary)" : "#fff", fontSize: 14, fontWeight: 600, cursor: reviewing ? "not-allowed" : "pointer", marginBottom: 24, boxShadow: reviewing ? "none" : "0 4px 14px rgba(255,0,82,0.35)", transition: "all 0.15s" }}>
          {reviewing ? "🤖 AI is reviewing the PR..." : "🤖 Run AI Review"}
        </button>

        {reviewResult && (
          <div style={{ padding: 16, borderRadius: "var(--radius-lg)", marginBottom: 24, background: reviewResult.passed ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${reviewResult.passed ? "#BBF7D0" : "#FECACA"}` }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: reviewResult.passed ? "#15803D" : "#DC2626" }}>
              {reviewResult.passed ? "✅ Review Passed!" : "❌ Review Failed"}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              {reviewResult.blockingCount} blocking · {reviewResult.nonBlockingCount} non-blocking
            </p>
          </div>
        )}

        {pr.aiReviews.length > 0 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Review History</h2>
            {(pr.aiReviews as any[]).map((review: any) => (
              <div key={review.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 12, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>Review #{review.reviewNumber}</p>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500, background: review.status === "PASSED" ? "#F0FDF4" : review.status === "FAILED" ? "#FEF2F2" : "#F5F5F4", color: review.status === "PASSED" ? "#15803D" : review.status === "FAILED" ? "#DC2626" : "#78716C" }}>
                    {review.status}
                  </span>
                </div>

                {review.summary && <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.6 }}>{review.summary}</p>}

                {(review.blockingIssues as any[]).length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>🚫 Blocking Issues</p>
                    {(review.blockingIssues as any[]).map((issue, j) => (
                      <div key={j} style={{ padding: "10px 14px", background: "#FEF2F2", borderRadius: "var(--radius-md)", marginBottom: 6, borderLeft: "3px solid #DC2626" }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#DC2626", marginBottom: 3 }}>{issue.criterion}</p>
                        <p style={{ fontSize: 12, color: "var(--text-primary)", marginBottom: 4 }}>{issue.issue}</p>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>💡 {issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {(review.nonBlockingIssues as any[]).length > 0 && (
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#D97706", marginBottom: 8 }}>⚠️ Non-Blocking</p>
                    {(review.nonBlockingIssues as any[]).map((issue, j) => (
                      <div key={j} style={{ padding: "10px 14px", background: "#FFFBEB", borderRadius: "var(--radius-md)", marginBottom: 6, borderLeft: "3px solid #D97706" }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#D97706", marginBottom: 3 }}>{issue.area}</p>
                        <p style={{ fontSize: 12, color: "var(--text-primary)" }}>{issue.issue}</p>
                      </div>
                    ))}
                  </div>
                )}

                {review.postedToGithub && (
                  <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 10 }}>✅ Posted to GitHub PR</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
