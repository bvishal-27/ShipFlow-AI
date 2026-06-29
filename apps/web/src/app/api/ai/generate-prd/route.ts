import { NextRequest, NextResponse } from "next/server"
import { inngest } from "@/inngest/client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { featureId } = await req.json()

    const feature = await prisma.featureRequest.findUnique({
      where: { id: featureId }
    })

    if (!feature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 })
    }

    await inngest.send({
      name: "shipflow/prd.generate",
      data: { featureId },
    })

    return NextResponse.json({ success: true, message: "PRD generation started" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to start PRD generation" }, { status: 500 })
  }
}
