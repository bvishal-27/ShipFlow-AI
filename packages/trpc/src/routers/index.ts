import { router } from "../trpc"
import { workspaceRouter } from "./workspace"
import { projectRouter } from "./project"

export const appRouter = router({
  workspace: workspaceRouter,
  project: projectRouter,
})

export type AppRouter = typeof appRouter