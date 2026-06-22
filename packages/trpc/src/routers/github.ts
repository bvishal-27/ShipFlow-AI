import { z } from "zod"
import { router, publicProcedure } from "../trpc"

export const githubRouter = router({
  connect: publicProcedure
    .input(z.object({
      projectId: z.string(),
      workspaceId: z.string(),
      repoOwner: z.string(),
      repoName: z.string(),
      accessToken: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.githubConnection.findUnique({
        where: { projectId: input.projectId }
      })
      if (existing) {
        return ctx.db.githubConnection.update({
          where: { projectId: input.projectId },
          data: {
            repoOwner: input.repoOwner,
            repoName: input.repoName,
            accessToken: input.accessToken,
          }
        })
      }
      return ctx.db.githubConnection.create({
        data: {
          projectId: input.projectId,
          workspaceId: input.workspaceId,
          repoOwner: input.repoOwner,
          repoName: input.repoName,
          accessToken: input.accessToken,
        }
      })
    }),

  getConnection: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.githubConnection.findUnique({
        where: { projectId: input.projectId }
      })
    }),

  listPRs: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const connection = await ctx.db.githubConnection.findUnique({
        where: { projectId: input.projectId }
      })
      if (!connection) return []
      return ctx.db.pullRequest.findMany({
        where: {
          featureRequest: {
            projectId: input.projectId
          }
        },
        include: {
          featureRequest: true,
          aiReviews: true,
        },
        orderBy: { createdAt: "desc" }
      })
    }),
})
