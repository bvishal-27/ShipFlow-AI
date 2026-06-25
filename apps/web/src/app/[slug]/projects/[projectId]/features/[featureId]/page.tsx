"use client"
import { useState, useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"
import { Nav } from "@/components/nav"

const priorityColors: Record<string, { bg: string; color: string }> = {
  LOW: { bg: "#F0FDF4", color: "#16A34A" },
  MEDIUM: { bg: "#EFF6FF", color: "#2563EB" },
  HIGH: { bg: "#FFFBEB", color: "#D97706" },
  CRITICAL: { bg: "#FEF2F2", color: "#DC2626" },
}

export default function FeaturePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const featureId = params.featureId as string
  const [clarifying, setClarifying] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [generatingPRD, setGeneratingPRD] = useState(false)
  const [generatingTasks, setGeneratingTasks] = useState(false)

  const { data: feature, refetch } = trpc.feature.getById.useQuery({ id: featureId })

  const answerClarification = trpc.feature.answerClarification.useMutation({
    onSuccess: () => { refetch(); setCurrentAnswer("") }
  })

  useEffect(() => {
    if (feature?.status === "PENDING") {
      setClarifying(true)
      fetch("/api/ai/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId }),
      }).then(() => { refetch(); setClarifying(false) })
    }
  }, [feature?.status])

  if (!feature) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 14, color: "var(--text-tertiary)" }}>Loading...</div>
    </div>
  )

  const unanswered = feature.clarifications.filter((c: any) => !c.answer)
  const currentQuestion = unanswered[0]
  const allAnswered = feature.clarifications.length > 0 && unanswered.length === 0

  const statusEmoji: Record<string, string> = {
    PENDING: "⏳", CLARIFYING: "💬", PRD_GENERATING: "✍️", PRD_READY: "📄",
    PLANNING: "🗂️", READY_FOR_DEV: "🚀", IN_DEVELOPMENT: "👨‍💻",
    IN_REVIEW: "🔍", FIX_NEEDED: "🔧", REVIEW_PASSED: "✅", SHIPPED: "🎉"
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} projectId={projectId} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "88px 24px 48px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{feature.title}</h1>
            <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: "#FFF0F4", color: "#FF0052", fontWeight: 500 }}>
              {statusEmoji[feature.status]} {feature.status.replace(/_/g, " ")}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{feature.description}</p>
        </div>

        {/* AI Analyzing */}
        {clarifying && (
          <div style={{ padding: 16, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF0052", animation: "pulse 1.5s infinite" }} />
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>🤖 AI is analyzing your request...</p>
          </div>
        )}

        {/* Clarifications */}
        {feature.clarifications.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>💬 Clarification Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {feature.clarifications.map((c, i) => (
                <div key={c.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 16, boxShadow: "var(--shadow-sm)" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-primary)" }}>Q{i + 1}: {c.question}</p>
                  {c.answer ? (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>✅</span>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", background: "var(--bg-secondary)", padding: "8px 12px", borderRadius: "var(--radius-md)", flex: 1 }}>{c.answer}</p>
                    </div>
                  ) : currentQuestion?.id === c.id ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="text" placeholder="Your answer..." value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)}
                        style={{ flex: 1, padding: "9px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 13, outline: "none" }}
                        onFocus={e => e.target.style.borderColor = "#FF0052"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                        onKeyDown={e => { if (e.key === "Enter" && currentAnswer.trim()) answerClarification.mutate({ clarificationId: c.id, answer: currentAnswer, featureId }) }}
                      />
                      <button onClick={() => { if (currentAnswer.trim()) answerClarification.mutate({ clarificationId: c.id, answer: currentAnswer, featureId }) }}
                        style={{ padding: "9px 18px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Answer
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Waiting...</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate PRD */}
        {allAnswered && feature.status !== "PRD_READY" && feature.status !== "PLANNING" && feature.status !== "READY_FOR_DEV" && feature.status !== "IN_DEVELOPMENT" && feature.status !== "IN_REVIEW" && feature.status !== "FIX_NEEDED" && feature.status !== "REVIEW_PASSED" && feature.status !== "SHIPPED" && (
          <div style={{ padding: 20, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "var(--radius-lg)", marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#15803D", marginBottom: 12 }}>✅ All questions answered — ready to generate PRD</p>
            <button
              disabled={generatingPRD}
              onClick={() => {
                setGeneratingPRD(true)
                fetch("/api/ai/generate-prd", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featureId }) })
                  .then(() => { refetch(); setGeneratingPRD(false) })
              }}
              style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: "#15803D", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {generatingPRD ? "Generating PRD..." : "✍️ Generate PRD"}
            </button>
          </div>
        )}

        {/* PRD */}
        {feature.prd && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📄 Product Requirements Document</h2>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)", fontSize: 13, lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
              {feature.prd.rawContent}
            </div>

            {feature.status === "PRD_READY" && (
              <button
                disabled={generatingTasks}
                onClick={() => {
                  setGeneratingTasks(true)
                  fetch("/api/ai/generate-tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featureId }) })
                    .then(() => { refetch(); setGeneratingTasks(false) })
                }}
                style={{ marginTop: 12, padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>
                {generatingTasks ? "Generating tasks..." : "⚡ Generate Engineering Tasks"}
              </button>
            )}
          </div>
        )}

        {/* Kanban */}
        {feature.tasks.length > 0 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>⚙️ Engineering Tasks</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {["TODO", "IN_PROGRESS", "DONE"].map(status => (
                <div key={status} style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {status.replace("_", " ")} · {feature.tasks.filter(t => t.status === status).length}
                  </div>
                  {feature.tasks.filter(t => t.status === status).map(task => {
                    const pc = priorityColors[task.priority] || priorityColors.MEDIUM
                    return (
                      <div key={task.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 12, marginBottom: 8, boxShadow: "var(--shadow-sm)" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: "var(--text-primary)" }}>{task.title}</p>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }}>{task.description}</p>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500, background: pc.bg, color: pc.color }}>{task.priority}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {["REVIEW_PASSED", "IN_DEVELOPMENT", "IN_REVIEW", "FIX_NEEDED"].includes(feature.status) && (
              <div style={{ marginTop: 16 }}>
                <button onClick={() => router.push(`/${slug}/projects/${projectId}/pulls`)}
                  style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", fontSize: 14, cursor: "pointer", fontWeight: 500, marginRight: 8 }}>
                  🔀 View Pull Requests
                </button>
                {feature.status === "REVIEW_PASSED" && (
                  <button onClick={() => router.push(`/${slug}/projects/${projectId}/features/${featureId}/approve`)}
                    style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 14px rgba(255,0,82,0.35)" }}>
                    🚀 Approve & Ship
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
