import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { Octokit } from "@octokit/rest"
import { z } from "zod"

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! })
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { pullRequestId } = await req.json()

    const pr = await prisma.pullRequest.findUnique({
      where: { id: pullRequestId },
      include: {
        featureRequest: {
          include: {
            prd: true,
            tasks: true,
          }
        }
      }
    })

    if (!pr || !pr.featureRequest.prd) {
      return NextResponse.json({ error: "PR or PRD not found" }, { status: 404 })
    }

    const connection = await prisma.githubConnection.findFirst({
      where: { projectId: pr.featureRequest.projectId }
    })

    if (!connection) {
      return NextResponse.json({ error: "GitHub connection not found" }, { status: 404 })
    }

    const octokit = new Octokit({ auth: connection.accessToken })

    const { data: files } = await octokit.pulls.listFiles({
      owner: connection.repoOwner,
      repo: connection.repoName,
      pull_number: pr.githubPrNumber,
    })

    const diffSummary = files.map(f => 
      `File: ${f.filename}\nStatus: ${f.status}\nAdditions: ${f.additions}, Deletions: ${f.deletions}\nPatch:\n${f.patch || "binary file"}`
    ).join("\n\n---\n\n").slice(0, 8000)

    const acceptanceCriteria = pr.featureRequest.prd.acceptanceCriteria
    const tasks = pr.featureRequest.tasks.map(t => `- ${t.title}: ${t.description}`).join("\n")

    await prisma.aIReview.create({
      data: {
        pullRequestId: pr.id,
        reviewNumber: (await prisma.aIReview.count({ where: { pullRequestId: pr.id } })) + 1,
        status: "RUNNING",
      }
    })

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
      prompt: `You are a senior QA engineer reviewing a pull request against product requirements.

ACCEPTANCE CRITERIA:
${acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

ENGINEERING TASKS:
${tasks}

PR DIFF:
${diffSummary}

Review the PR diff against each acceptance criterion. 
- blockingIssues: criteria NOT met that must be fixed before merge
- nonBlockingIssues: suggestions that would improve the code but are not blocking
- summary: 2-3 sentence overall assessment
- passed: true only if ALL acceptance criteria are met`,
    })

    const latestReview = await prisma.aIReview.findFirst({
      where: { pullRequestId: pr.id },
      orderBy: { createdAt: "desc" }
    })

    await prisma.aIReview.update({
      where: { id: latestReview!.id },
      data: {
        status: object.passed ? "PASSED" : "FAILED",
        blockingIssues: object.blockingIssues,
        nonBlockingIssues: object.nonBlockingIssues,
        summary: object.summary,
      }
    })

    await prisma.featureRequest.update({
      where: { id: pr.featureRequest.id },
      data: { status: object.passed ? "REVIEW_PASSED" : "FIX_NEEDED" }
    })

    if (object.blockingIssues.length > 0) {
      const reviewComment = `## 🤖 ShipFlow AI Review

**Status:** ${object.passed ? "✅ PASSED" : "❌ NEEDS FIXES"}

**Summary:** ${object.summary}

### Blocking Issues
${object.blockingIssues.map(i => `- **${i.criterion}**: ${i.issue}\n  💡 ${i.suggestion}`).join("\n")}

${object.nonBlockingIssues.length > 0 ? `### Non-Blocking Suggestions\n${object.nonBlockingIssues.map(i => `- **${i.area}**: ${i.issue}`).join("\n")}` : ""}
`
      await octokit.issues.createComment({
        owner: connection.repoOwner,
        repo: connection.repoName,
        issue_number: pr.githubPrNumber,
        body: reviewComment,
      })

      await prisma.aIReview.update({
        where: { id: latestReview!.id },
        data: { postedToGithub: true }
      })
    }

    return NextResponse.json({ 
      success: true, 
      passed: object.passed,
      blockingCount: object.blockingIssues.length,
      nonBlockingCount: object.nonBlockingIssues.length,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Review failed" }, { status: 500 })
  }
}
