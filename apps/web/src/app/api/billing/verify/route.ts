import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, workspaceSlug } = await req.json()
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({ where: { slug: workspaceSlug } })
    if (workspace) {
      await prisma.billing.upsert({
        where: { workspaceId: workspace.id },
        update: {
          plan: "PRO",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          aiCreditsLimit: 500,
          repoLimit: 999,
        },
        create: {
          workspaceId: workspace.id,
          plan: "PRO",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          aiCreditsLimit: 500,
          repoLimit: 999,
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
