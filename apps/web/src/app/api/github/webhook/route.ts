import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret)
  const digest = "sha256=" + hmac.update(payload).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const signature = req.headers.get("x-hub-signature-256") || ""
    const event = req.headers.get("x-github-event") || ""
    const secret = process.env.GITHUB_WEBHOOK_SECRET!
    if (secret && signature && !verifySignature(payload, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
    const body = JSON.parse(payload)
    if (event === "pull_request") {
      const action = body.action
      const pr = body.pull_request
      const repo = body.repository
      const connection = await prisma.githubConnection.findFirst({
        where: { repoOwner: repo.owner.login, repoName: repo.name },
        include: { project: { include: { featureRequests: true } } }
      })
      if (!connection) return NextResponse.json({ message: "No connection found" })
      const featureRequest = connection.project.featureRequests.find(
        f => f.status === "READY_FOR_DEV" || f.status === "IN_DEVELOPMENT"
      )
      if (!featureRequest) return NextResponse.json({ message: "No matching feature request" })
      if (action === "opened" || action === "synchronize") {
        const existing = await prisma.pullRequest.findFirst({
          where: { featureRequestId: featureRequest.id, githubPrNumber: pr.number }
        })
        if (!existing) {
          await prisma.pullRequest.create({
            data: {
              featureRequestId: featureRequest.id,
              githubPrNumber: pr.number,
              githubPrUrl: pr.html_url,
              title: pr.title,
              status: "OPEN",
              headSha: pr.head.sha,
            }
          })
          await prisma.featureRequest.update({
            where: { id: featureRequest.id },
            data: { status: "IN_DEVELOPMENT" }
          })
        } else {
          await prisma.pullRequest.update({
            where: { id: existing.id },
            data: { headSha: pr.head.sha }
          })
        }
      }
      if (action === "closed" && pr.merged) {
        await prisma.pullRequest.updateMany({
          where: { featureRequestId: featureRequest.id, githubPrNumber: pr.number },
          data: { status: "MERGED" }
        })
      }
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
