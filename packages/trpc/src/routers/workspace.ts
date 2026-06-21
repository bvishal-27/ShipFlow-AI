import { z } from "zod"
import { router, publicProcedure } from "../trpc"

export const workspaceRouter = router({
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.create({
        data: {
          name: input.name,
          slug: input.slug,
          members: {
            create: {
              userId: input.userId,
              role: "OWNER",
            }
          }
        }
      })
      return workspace
    }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workspace.findMany({
        where: {
          members: {
            some: { userId: input.userId }
          }
        }
      })
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workspace.findUnique({
        where: { slug: input.slug },
        include: { projects: true }
      })
    }),
})