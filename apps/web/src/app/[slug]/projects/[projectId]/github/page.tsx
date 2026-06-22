"use client"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useParams, useRouter } from "next/navigation"

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

  const { data: connection } = trpc.github.getConnection.useQuery({ projectId })

  const connect = trpc.github.connect.useMutation({
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => router.push(`/${slug}/projects/${projectId}`), 1500)
    },
    onError: (err) => setError(err.message)
  })

  const { data: workspace } = trpc.workspace.getBySlug.useQuery({ slug })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workspace) return
    connect.mutate({
      projectId,
      workspaceId: workspace.id,
      repoOwner,
      repoName,
      accessToken,
    })
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
        Connect GitHub Repository
      </h1>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
        Connect a repo to track PRs and run AI reviews
      </p>

      {connection && (
        <div style={{ padding: 16, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, marginBottom: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#15803d" }}>
            ✅ Connected: {connection.repoOwner}/{connection.repoName}
          </p>
        </div>
      )}

      {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
      {success && <p style={{ color: "green", fontSize: 13, marginBottom: 12 }}>✅ Connected successfully!</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Repository Owner</label>
          <input
            type="text"
            placeholder="e.g. facebook"
            value={repoOwner}
            onChange={e => setRepoOwner(e.target.value)}
            required
            style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Repository Name</label>
          <input
            type="text"
            placeholder="e.g. react"
            value={repoName}
            onChange={e => setRepoName(e.target.value)}
            required
            style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>GitHub Personal Access Token</label>
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={accessToken}
            onChange={e => setAccessToken(e.target.value)}
            required
            style={{ width: "100%", marginTop: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
          />
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            Generate at github.com/settings/tokens → needs repo + webhooks permissions
          </p>
        </div>
        <button
          type="submit"
          disabled={connect.isPending}
          style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
        >
          {connect.isPending ? "Connecting..." : "Connect Repository"}
        </button>
      </form>
    </div>
  )
}