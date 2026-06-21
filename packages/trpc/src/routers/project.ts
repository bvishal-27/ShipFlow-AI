import { z } from "zod"
import { router, publicProcedure } from "../trpc"

export const projectRouter = router({
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      workspaceId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          workspaceId: input.workspaceId,
        }
      })
    }),

  list: publicProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findMany({
        where: { workspaceId: input.workspaceId },
        orderBy: { createdAt: "desc" }
      })
    }),
})