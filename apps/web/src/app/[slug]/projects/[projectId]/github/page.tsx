"use client"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"
import { Nav } from "@/components/nav"

export default function GitHubConnectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const projectId = params.projectId as string
  const [repoOwner, setRepoOwner] = useState("")
  const [repoName, setRepoName] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { data: connection, refetch } = trpc.github.getConnection.useQuery({ projectId })
  const { data: workspace } = trpc.workspace.getBySlug.useQuery({ slug })

  const connect = trpc.github.connect.useMutation({
    onSuccess: () => { setSuccess(true); refetch(); setTimeout(() => router.push(`/${slug}/projects/${projectId}`), 1500) },
    onError: (err) => setError(err.message)
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workspace) return
    connect.mutate({ projectId, workspaceId: workspace.id, repoOwner, repoName, accessToken })
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} projectId={projectId} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "88px 24px 48px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>GitHub Integration</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Connect a repository to track PRs and run AI reviews automatically</p>
        </div>

        {connection && (
          <div style={{ padding: 16, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "var(--radius-lg)", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#15803D" }}>Repository connected</p>
              <p style={{ fontSize: 13, color: "#16A34A" }}>{connection.repoOwner}/{connection.repoName}</p>
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: "10px 14px", background: "var(--error-light)", border: "1px solid #FECACA", borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 13, color: "var(--error)" }}>{error}</div>
        )}

        {success && (
          <div style={{ padding: "10px 14px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 13, color: "#15803D", fontWeight: 500 }}>✅ Connected successfully! Redirecting...</div>
        )}

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28, boxShadow: "var(--shadow-md)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Repository Owner</label>
              <input type="text" placeholder="e.g. bvishal-27" value={repoOwner} onChange={e => setRepoOwner(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Repository Name</label>
              <input type="text" placeholder="e.g. shipflow-ai" value={repoName} onChange={e => setRepoName(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Personal Access Token</label>
              <input type="password" placeholder="ghp_xxxxxxxxxxxx" value={accessToken} onChange={e => setAccessToken(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <div style={{ marginTop: 8, padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Generate at <a href="https://github.com/settings/tokens/new" target="_blank" style={{ color: "#FF0052", fontWeight: 500 }}>github.com/settings/tokens</a> → needs <code style={{ background: "var(--border)", padding: "1px 5px", borderRadius: 4 }}>repo</code> + <code style={{ background: "var(--border)", padding: "1px 5px", borderRadius: 4 }}>admin:repo_hook</code> scopes
              </div>
            </div>
            <button type="submit" disabled={connect.isPending}
              style={{ padding: "11px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: connect.isPending ? "not-allowed" : "pointer", opacity: connect.isPending ? 0.7 : 1, boxShadow: "0 4px 14px rgba(255,0,82,0.35)", marginTop: 4 }}>
              {connect.isPending ? "Connecting..." : "Connect Repository →"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: 20, padding: 16, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>🔗 Webhook setup</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            After connecting, add a webhook to your repo pointing to your deployed URL:
          </p>
          <code style={{ display: "block", marginTop: 8, padding: "8px 12px", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-primary)" }}>
            https://your-domain.com/api/github/webhook
          </code>
        </div>
      </div>
    </div>
  )
}
