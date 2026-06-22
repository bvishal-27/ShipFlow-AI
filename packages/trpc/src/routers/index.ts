import { router } from "../trpc"
import { workspaceRouter } from "./workspace"
import { projectRouter } from "./project"
import { featureRouter } from "./feature"
import { githubRouter } from "./github"

export const appRouter = router({
  workspace: workspaceRouter,
  project: projectRouter,
  feature: featureRouter,
  github: githubRouter,
})

export type AppRouter = typeof appRouter