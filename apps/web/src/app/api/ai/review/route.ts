import { NextRequest, NextResponse } from "next/server"
import { inngest } from "@/inngest/client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { pullRequestId } = await req.json()

    const pr = await prisma.pullRequest.findUnique({
      where: { id: pullRequestId }
    })

    if (!pr) {
      return NextResponse.json({ error: "PR not found" }, { status: 404 })
    }

    await inngest.send({
      name: "shipflow/review.run",
      data: { pullRequestId },
    })

    return NextResponse.json({ success: true, message: "AI review started" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to start review" }, { status: 500 })
  }
}
