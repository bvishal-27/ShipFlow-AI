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
      where: { id: featureId }
    })

    if (!feature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 })
    }

    const { object } = await generateObject({
     model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: z.object({
        questions: z.array(z.string()).min(2).max(3),
      }),
      prompt: `You are a senior product manager. A user submitted this feature request:

Title: ${feature.title}
Description: ${feature.description}

Generate 2-3 focused clarifying questions to better understand the requirements before writing a PRD.
Ask about: target users, specific use cases, technical constraints, or success criteria.
Keep questions short and specific.`,
    })

    await prisma.clarification.createMany({
      data: object.questions.map((q) => ({
        featureRequestId: featureId,
        question: q,
      }))
    })

    await prisma.featureRequest.update({
      where: { id: featureId },
      data: { status: "CLARIFYING" }
    })

    return NextResponse.json({ success: true, questions: object.questions })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to generate clarifications" }, { status: 500 })
  }
}