import { initTRPC, TRPCError } from "@trpc/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db: prisma,
    headers: opts.headers,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure