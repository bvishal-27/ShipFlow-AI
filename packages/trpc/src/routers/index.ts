import { router } from "../trpc"
import { workspaceRouter } from "./workspace"
import { projectRouter } from "./project"
import { featureRouter } from "./feature"

export const appRouter = router({
  workspace: workspaceRouter,
  project: projectRouter,
  feature: featureRouter,
})

export type AppRouter = typeof appRouter