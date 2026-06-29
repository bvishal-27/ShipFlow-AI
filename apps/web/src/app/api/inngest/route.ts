import { serve } from "inngest/next"
import { inngest } from "@/inngest/client"
import { generatePRD, generateTasks, runAIReview } from "@/inngest/functions"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generatePRD, generateTasks, runAIReview],
})
