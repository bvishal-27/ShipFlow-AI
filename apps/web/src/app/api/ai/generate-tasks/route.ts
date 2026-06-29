import { NextRequest, NextResponse } from "next/server"
import { inngest } from "@/inngest/client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { featureId } = await req.json()

    const feature = await prisma.featureRequest.findUnique({
      where: { id: featureId },
      include: { prd: true }
    })

    if (!feature?.prd) {
      return NextResponse.json({ error: "PRD not found" }, { status: 404 })
    }

    await inngest.send({
      name: "shipflow/tasks.generate",
      data: { featureId },
    })

    return NextResponse.json({ success: true, message: "Task generation started" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to start task generation" }, { status: 500 })
  }
}
