import { z } from "zod"
import { router, publicProcedure } from "../trpc"

export const featureRouter = router({
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.featureRequest.create({
        data: {
          title: input.title,
          description: input.description,
          projectId: input.projectId,
          status: "PENDING",
        }
      })
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.featureRequest.findUnique({
        where: { id: input.id },
        include: {
          clarifications: true,
          prd: true,
          tasks: true,
          pullRequests: {
            include: { aiReviews: true }
          },
          humanApproval: true,
        }
      })
    }),

  list: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.featureRequest.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: "desc" },
        include: {
          prd: true,
          tasks: true,
          pullRequests: {
            include: { aiReviews: true }
          },
          humanApproval: true,
        }
      })
    }),

  answerClarification: publicProcedure
    .input(z.object({
      clarificationId: z.string(),
      answer: z.string(),
      featureId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.clarification.update({
        where: { id: input.clarificationId },
        data: { answer: input.answer }
      })
    }),

  approve: publicProcedure
    .input(z.object({
      featureId: z.string(),
      reviewerId: z.string(),
      decision: z.enum(["APPROVED", "REJECTED"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.humanApproval.create({
        data: {
          featureRequestId: input.featureId,
          reviewerId: input.reviewerId,
          decision: input.decision,
          notes: input.notes,
        }
      })
      await ctx.db.featureRequest.update({
        where: { id: input.featureId },
        data: {
          status: input.decision === "APPROVED" ? "SHIPPED" : "FIX_NEEDED"
        }
      })
      return { success: true }
    }),

  getApproval: publicProcedure
    .input(z.object({ featureId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.humanApproval.findUnique({
        where: { featureRequestId: input.featureId },
        include: { reviewer: true }
      })
    }),
})
