import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@shipflow/trpc"

export const trpc = createTRPCReact<AppRouter>()