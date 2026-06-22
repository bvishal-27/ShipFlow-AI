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
      include: { clarifications: true }
    })

    if (!feature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 })
    }

    const clarificationContext = feature.clarifications
      .filter(c => c.answer)
      .map(c => `Q: ${c.question}\nA: ${c.answer}`)
      .join("\n\n")

    await prisma.featureRequest.update({
      where: { id: featureId },
      data: { status: "PRD_GENERATING" }
    })

    const { object } = await generateObject({
    model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: z.object({
        problemStatement: z.string(),
        goals: z.array(z.string()),
        nonGoals: z.array(z.string()),
        userStories: z.array(z.string()),
        acceptanceCriteria: z.array(z.string()),
        edgeCases: z.array(z.string()),
        successMetrics: z.array(z.string()),
      }),
      prompt: `You are a senior product manager. Generate a detailed PRD for this feature request.

Feature Title: ${feature.title}
Feature Description: ${feature.description}

Clarifications:
${clarificationContext}

Generate a comprehensive PRD with all sections filled in detail.`,
    })

    const rawContent = `# ${feature.title}

## Problem Statement
${object.problemStatement}

## Goals
${object.goals.map(g => `- ${g}`).join("\n")}

## Non-Goals
${object.nonGoals.map(g => `- ${g}`).join("\n")}

## User Stories
${object.userStories.map(s => `- ${s}`).join("\n")}

## Acceptance Criteria
${object.acceptanceCriteria.map(c => `- ${c}`).join("\n")}

## Edge Cases
${object.edgeCases.map(e => `- ${e}`).join("\n")}

## Success Metrics
${object.successMetrics.map(m => `- ${m}`).join("\n")}
`

    await prisma.pRD.create({
      data: {
        featureRequestId: featureId,
        problemStatement: object.problemStatement,
        goals: object.goals,
        nonGoals: object.nonGoals,
        userStories: object.userStories,
        acceptanceCriteria: object.acceptanceCriteria,
        edgeCases: object.edgeCases,
        successMetrics: object.successMetrics,
        rawContent,
      }
    })

    await prisma.featureRequest.update({
      where: { id: featureId },
      data: { status: "PRD_READY" }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to generate PRD" }, { status: 500 })
  }
}