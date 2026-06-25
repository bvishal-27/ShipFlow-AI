"use client"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { useSession } from "@/lib/auth-client"
import { useState } from "react"
import { Nav } from "@/components/nav"

export default function ApprovePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const featureId = params.featureId as string
  const [notes, setNotes] = useState("")
  const [done, setDone] = useState(false)
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(null)

  const { data: feature } = trpc.feature.getById.useQuery({ id: featureId })

  const approve = trpc.feature.approve.useMutation({
    onSuccess: (_, vars) => {
      setDecision(vars.decision)
      setDone(true)
      if (vars.decision === "APPROVED") {
        setTimeout(() => router.push(`/${slug}/projects/${projectId}`), 2500)
      }
    }
  })

  if (!feature) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-tertiary)" }}>Loading...</p>
    </div>
  )

  const latestPR = feature.pullRequests?.[0]
  const latestReview = latestPR?.aiReviews?.[latestPR.aiReviews.length - 1]
  const hasPRD = !!feature.prd
  const hasTasks = feature.tasks.length > 0
  const hasPR = !!latestPR
  const hasReview = !!latestReview
  const reviewPassed = latestReview?.status === "PASSED"

  const checklist = [
    { label: "PRD generated", done: hasPRD, icon: "📄" },
    { label: "Engineering tasks created", done: hasTasks, icon: "⚙️" },
    { label: "GitHub PR linked", done: hasPR, icon: "🔀" },
    { label: "AI review completed", done: hasReview, icon: "🤖" },
    { label: "AI review passed", done: reviewPassed, icon: "✅" },
  ]

  const allGreen = checklist.every(c => c.done)

  if (done && decision === "APPROVED") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🚀</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Feature Shipped!</h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{feature.title} is now live</p>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 8 }}>Redirecting to project...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} projectId={projectId} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "88px 24px 48px" }}>

        {/* Header */}
        <button onClick={() => router.push(`/${slug}/projects/${projectId}/features/${featureId}`)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, padding: 0 }}>
          ← Back to feature
        </button>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: "#FFF0F4", border: "1px solid #FFB3CA", fontSize: 12, color: "#FF0052", fontWeight: 500, marginBottom: 10 }}>
            🛡️ Human Approval Gate
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{feature.title}</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Review everything carefully before shipping to production</p>
        </div>

        {/* Checklist */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 16, boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>Pre-ship Checklist</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {checklist.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: item.done ? "#F0FDF4" : "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: `1px solid ${item.done ? "#BBF7D0" : "var(--border)"}` }}>
                <span style={{ fontSize: 16 }}>{item.done ? "✅" : "⏳"}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: item.done ? "#15803D" : "var(--text-secondary)" }}>{item.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 14 }}>{item.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRD Summary */}
        {feature.prd && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 16, boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📄 PRD Summary</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 14 }}>{feature.prd.problemStatement}</p>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Acceptance Criteria</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {feature.prd.acceptanceCriteria.map((c: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                    <span style={{ color: "#FF0052", fontWeight: 600, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "var(--text-primary)" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Review Summary */}
        {latestReview && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 16, boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🤖 Latest AI Review</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 600, background: latestReview.status === "PASSED" ? "#F0FDF4" : "#FEF2F2", color: latestReview.status === "PASSED" ? "#15803D" : "#DC2626" }}>
                {latestReview.status}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                {String(((latestReview as any).blockingIssues ?? []).length)} blocking · {String(((latestReview as any).nonBlockingIssues ?? []).length)} non-blocking
                  </span>
            </div>
            {latestReview.summary && <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{latestReview.summary}</p>}
          </div>
        )}

        {/* PR Info */}
        {latestPR && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔀 Pull Request</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>#{latestPR.githubPrNumber} — {latestPR.title}</p>
                <a href={latestPR.githubPrUrl} target="_blank" style={{ fontSize: 12, color: "#FF0052", marginTop: 4, display: "block" }}>View on GitHub ↗</a>
              </div>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#EFF6FF", color: "#2563EB", fontWeight: 500 }}>{latestPR.status}</span>
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
            Reviewer notes <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any comments about this release decision..." rows={3}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", fontSize: 13, outline: "none", resize: "none", lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = "#FF0052"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Decision */}
        {feature.humanApproval ? (
          <div style={{ padding: 20, background: feature.humanApproval.decision === "APPROVED" ? "#F0FDF4" : "#FEF2F2", borderRadius: "var(--radius-xl)", border: `1px solid ${feature.humanApproval.decision === "APPROVED" ? "#BBF7D0" : "#FECACA"}`, textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: feature.humanApproval.decision === "APPROVED" ? "#15803D" : "#DC2626" }}>
              {feature.humanApproval.decision === "APPROVED" ? "✅ Approved and Shipped" : "❌ Rejected"}
            </p>
            {feature.humanApproval.notes && <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>{feature.humanApproval.notes}</p>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button
              onClick={() => approve.mutate({ featureId, reviewerId: session?.user?.id || "", decision: "APPROVED", notes })}
              disabled={approve.isPending}
              style={{ padding: 14, borderRadius: "var(--radius-lg)", border: "none", background: "#FF0052", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,0,82,0.4)", transition: "opacity 0.15s", opacity: approve.isPending ? 0.7 : 1 }}>
              🚀 Approve & Ship
            </button>
            <button
              onClick={() => approve.mutate({ featureId, reviewerId: session?.user?.id || "", decision: "REJECTED", notes })}
              disabled={approve.isPending}
              style={{ padding: 14, borderRadius: "var(--radius-lg)", border: "2px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#DC2626"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              ❌ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
