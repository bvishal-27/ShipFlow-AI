import { inngest } from "./client"
import { PrismaClient } from "@prisma/client"
import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"

const prisma = new PrismaClient()
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! })

export const generatePRD = inngest.createFunction(
  { id: "generate-prd", name: "Generate PRD" },
  { event: "shipflow/prd.generate" },
  async ({ event, step }: any) => {
    const { featureId } = event.data

    const feature = await step.run("fetch-feature", async () => {
      return prisma.featureRequest.findUnique({
        where: { id: featureId },
        include: { clarifications: true }
      })
    })

    if (!feature) throw new Error("Feature not found")

    await step.run("update-status", async () => {
      return prisma.featureRequest.update({
        where: { id: featureId },
        data: { status: "PRD_GENERATING" }
      })
    })

    const clarificationContext = (feature.clarifications as any[])
      .filter((c: any) => c.answer)
      .map((c: any) => `Q: ${c.question}\nA: ${c.answer}`)
      .join("\n\n")

    const prdData = await step.run("generate-prd-ai", async () => {
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
        prompt: `Generate a detailed PRD.\nFeature: ${feature.title}\nDescription: ${feature.description}\nClarifications: ${clarificationContext}`,
      })
      return object
    })

    await step.run("save-prd", async () => {
      const rawContent = `# ${feature.title}\n\n## Problem Statement\n${prdData.problemStatement}\n\n## Goals\n${prdData.goals.map((g: string) => `- ${g}`).join("\n")}\n\n## Non-Goals\n${prdData.nonGoals.map((g: string) => `- ${g}`).join("\n")}\n\n## User Stories\n${prdData.userStories.map((s: string) => `- ${s}`).join("\n")}\n\n## Acceptance Criteria\n${prdData.acceptanceCriteria.map((c: string) => `- ${c}`).join("\n")}\n\n## Edge Cases\n${prdData.edgeCases.map((e: string) => `- ${e}`).join("\n")}\n\n## Success Metrics\n${prdData.successMetrics.map((m: string) => `- ${m}`).join("\n")}`
      await prisma.pRD.create({
        data: { featureRequestId: featureId, ...prdData, rawContent }
      })
      return prisma.featureRequest.update({
        where: { id: featureId },
        data: { status: "PRD_READY" }
      })
    })

    return { success: true }
  }
)

export const generateTasks = inngest.createFunction(
  { id: "generate-tasks", name: "Generate Tasks" },
  { event: "shipflow/tasks.generate" },
  async ({ event, step }: any) => {
    const { featureId } = event.data

    const feature = await step.run("fetch-feature", async () => {
      return prisma.featureRequest.findUnique({
        where: { id: featureId },
        include: { prd: true }
      })
    })

    if (!feature?.prd) throw new Error("PRD not found")

    await step.run("update-status", async () => {
      return prisma.featureRequest.update({
        where: { id: featureId },
        data: { status: "PLANNING" }
      })
    })

    const tasks = await step.run("generate-tasks-ai", async () => {
      const { object } = await generateObject({
        model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        schema: z.object({
          tasks: z.array(z.object({
            title: z.string(),
            description: z.string(),
            priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
          }))
        }),
        prompt: `Break this PRD into engineering tasks:\n${(feature.prd as any).rawContent}`,
      })
      return object.tasks
    })

    await step.run("save-tasks", async () => {
      await prisma.task.createMany({
        data: tasks.map((task: any, index: number) => ({
          featureRequestId: featureId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: "TODO",
          order: index,
        }))
      })
      return prisma.featureRequest.update({
        where: { id: featureId },
        data: { status: "READY_FOR_DEV" }
      })
    })

    return { success: true }
  }
)

export const runAIReview = inngest.createFunction(
  { id: "run-ai-review", name: "Run AI Review" },
  { event: "shipflow/review.run" },
  async ({ event, step }: any) => {
    const { pullRequestId } = event.data

    const pr = await step.run("fetch-pr", async () => {
      return prisma.pullRequest.findUnique({
        where: { id: pullRequestId },
        include: {
          featureRequest: { include: { prd: true, tasks: true } }
        }
      })
    })

    if (!pr) throw new Error("PR not found")

    const connection = await step.run("fetch-connection", async () => {
      return prisma.githubConnection.findFirst({
        where: { projectId: (pr.featureRequest as any).projectId }
      })
    })

    if (!connection) throw new Error("No GitHub connection")

    await step.run("create-review", async () => {
      const count = await prisma.aIReview.count({ where: { pullRequestId } })
      return prisma.aIReview.create({
        data: { pullRequestId, reviewNumber: count + 1, status: "RUNNING" }
      })
    })

    const diff = await step.run("fetch-diff", async () => {
      const { Octokit } = await import("@octokit/rest")
      const octokit = new Octokit({ auth: (connection as any).accessToken })
      const { data: files } = await octokit.pulls.listFiles({
        owner: (connection as any).repoOwner,
        repo: (connection as any).repoName,
        pull_number: pr.githubPrNumber,
      })
      return (files as any[]).map((f: any) =>
        `File: ${f.filename}\n${f.patch || ""}`
      ).join("\n\n").slice(0, 8000)
    })

    const review = await step.run("ai-review", async () => {
      const prd = (pr.featureRequest as any).prd
      const criteria = prd ? (prd.acceptanceCriteria as string[]).map((c: string, i: number) => `${i + 1}. ${c}`).join("\n") : "No criteria"
      const { object } = await generateObject({
        model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        schema: z.object({
          blockingIssues: z.array(z.object({
            criterion: z.string(),
            issue: z.string(),
            suggestion: z.string(),
          })),
          nonBlockingIssues: z.array(z.object({
            area: z.string(),
            issue: z.string(),
            suggestion: z.string(),
          })),
          summary: z.string(),
          passed: z.boolean(),
        }),
        prompt: `Review PR diff against acceptance criteria.\n\nCRITERIA:\n${criteria}\n\nDIFF:\n${diff}`,
      })
      return object
    })

    await step.run("save-review", async () => {
      const latestReview = await prisma.aIReview.findFirst({
        where: { pullRequestId },
        orderBy: { createdAt: "desc" }
      })
      await prisma.aIReview.update({
        where: { id: latestReview!.id },
        data: {
          status: review.passed ? "PASSED" : "FAILED",
          blockingIssues: review.blockingIssues as any,
          nonBlockingIssues: review.nonBlockingIssues as any,
          summary: review.summary,
        }
      })
      await prisma.featureRequest.update({
        where: { id: (pr.featureRequest as any).id },
        data: { status: review.passed ? "REVIEW_PASSED" : "FIX_NEEDED" }
      })
      if (review.blockingIssues.length > 0) {
        const { Octokit } = await import("@octokit/rest")
        const octokit = new Octokit({ auth: (connection as any).accessToken })
        await octokit.issues.createComment({
          owner: (connection as any).repoOwner,
          repo: (connection as any).repoName,
          issue_number: pr.githubPrNumber,
          body: `## 🤖 ShipFlow AI Review\n\n**Status:** ${review.passed ? "✅ PASSED" : "❌ NEEDS FIXES"}\n\n**Summary:** ${review.summary}\n\n### Blocking Issues\n${review.blockingIssues.map((i: any) => `- **${i.criterion}**: ${i.issue}\n  💡 ${i.suggestion}`).join("\n")}`,
        })
        await prisma.aIReview.update({
          where: { id: latestReview!.id },
          data: { postedToGithub: true }
        })
      }
    })

    return { success: true, passed: review.passed }
  }
)
