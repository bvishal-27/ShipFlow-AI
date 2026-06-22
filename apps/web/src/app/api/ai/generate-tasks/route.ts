import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! })
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

    await prisma.featureRequest.update({
      where: { id: featureId },
      data: { status: "PLANNING" }
    })

    const { object } = await generateObject({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: z.object({
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string(),
          priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        }))
      }),
      prompt: `You are a senior engineering manager. Break this PRD into engineering tasks.

PRD:
${feature.prd.rawContent}

Generate 5-8 specific engineering tasks needed to implement this feature.
Each task should be concrete and actionable.`,
    })

    await prisma.task.createMany({
      data: object.tasks.map((task, index) => ({
        featureRequestId: featureId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: "TODO",
        order: index,
      }))
    })

    await prisma.featureRequest.update({
      where: { id: featureId },
      data: { status: "READY_FOR_DEV" }
    })

    return NextResponse.json({ success: true, count: object.tasks.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 })
  }
}