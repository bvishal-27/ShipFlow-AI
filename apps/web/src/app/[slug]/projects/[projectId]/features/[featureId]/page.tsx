"use client"
import { useState, useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { useParams } from "next/navigation"

export default function FeaturePage() {
  const params = useParams()
  const featureId = params.featureId as string
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [clarifying, setClarifying] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")

  const { data: feature, refetch } = trpc.feature.getById.useQuery({ id: featureId })

  const answerClarification = trpc.feature.answerClarification.useMutation({
    onSuccess: () => {
      refetch()
      setCurrentAnswer("")
    }
  })

  useEffect(() => {
    if (feature?.status === "PENDING") {
      setClarifying(true)
      fetch("/api/ai/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId }),
      }).then(() => {
        refetch()
        setClarifying(false)
      })
    }
  }, [feature?.status])

  if (!feature) return <p style={{ padding: 32 }}>Loading...</p>

  const unanswered = feature.clarifications.filter(c => !c.answer)
  const currentQuestion = unanswered[0]
  const allAnswered = feature.clarifications.length > 0 && unanswered.length === 0

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>{feature.title}</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{feature.description}</p>
        <span style={{
          display: "inline-block", marginTop: 8, padding: "3px 10px",
          borderRadius: 99, fontSize: 11, fontWeight: 500,
          background: "#f1f5f9", color: "#475569"
        }}>
          {feature.status}
        </span>
      </div>

      {clarifying && (
        <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "#6b7280" }}>🤖 AI is analyzing your request...</p>
        </div>
      )}

      {feature.clarifications.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Clarification Questions</h2>
          {feature.clarifications.map((c, i) => (
            <div key={c.id} style={{ marginBottom: 16, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Q{i + 1}: {c.question}</p>
              {c.answer ? (
                <p style={{ fontSize: 13, color: "#6b7280", background: "#f8fafc", padding: "8px 12px", borderRadius: 6 }}>
                  ✅ {c.answer}
                </p>
              ) : currentQuestion?.id === c.id ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Your answer..."
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 13 }}
                    onKeyDown={e => {
                      if (e.key === "Enter" && currentAnswer.trim()) {
                        answerClarification.mutate({
                          clarificationId: c.id,
                          answer: currentAnswer,
                          featureId,
                        })
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (currentAnswer.trim()) {
                        answerClarification.mutate({
                          clarificationId: c.id,
                          answer: currentAnswer,
                          featureId,
                        })
                      }
                    }}
                    style={{ padding: "8px 16px", borderRadius: 6, background: "#18181b", color: "#fff", fontSize: 13, cursor: "pointer", border: "none" }}
                  >
                    Answer
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#9ca3af" }}>Waiting...</p>
              )}
            </div>
          ))}
        </div>
      )}

      {allAnswered && feature.status !== "PRD_READY" && (
        <div style={{ padding: 16, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#15803d" }}>✅ All questions answered! Ready to generate PRD.</p>
          <button
            onClick={() => {
              fetch("/api/ai/generate-prd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featureId }),
              }).then(() => refetch())
            }}
            style={{ marginTop: 12, padding: "10px 20px", borderRadius: 8, background: "#15803d", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
          >
            Generate PRD
          </button>
        </div>
      )}

      {feature.prd && (
  <div style={{ marginTop: 24 }}>
    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>📄 Product Requirements Document</h2>
    <div style={{ padding: 24, border: "1px solid #e5e7eb", borderRadius: 12, whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7 }}>
      {feature.prd.rawContent}
    </div>

    {feature.status === "PRD_READY" && (
      <button
        onClick={() => {
          fetch("/api/ai/generate-tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ featureId }),
          }).then(() => refetch())
        }}
        style={{ marginTop: 16, padding: "10px 20px", borderRadius: 8, background: "#7c3aed", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
      >
        ⚡ Generate Engineering Tasks
      </button>
    )}

    {feature.tasks.length > 0 && (
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>⚙️ Engineering Tasks</h2>
        <div style={{ display: "flex", gap: 16 }}>
          {["TODO", "IN_PROGRESS", "DONE"].map(status => (
            <div key={status} style={{ flex: 1, background: "#f8fafc", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#475569" }}>
                {status.replace("_", " ")} · {feature.tasks.filter(t => t.status === status).length}
              </div>
              {feature.tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{task.description}</div>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500,
                    background: task.priority === "CRITICAL" ? "#fee2e2" : task.priority === "HIGH" ? "#fef3c7" : "#f0fdf4",
                    color: task.priority === "CRITICAL" ? "#991b1b" : task.priority === "HIGH" ? "#92400e" : "#166534"
                  }}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
    </div>
  )
}