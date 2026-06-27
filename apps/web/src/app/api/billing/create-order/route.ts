import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json()
    const Razorpay = require("razorpay")
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    const order = await razorpay.orders.create({
      amount: 99900,
      currency: "INR",
      receipt: `shipflow_${Date.now()}`,
    })
    return NextResponse.json({ orderId: order.id, amount: order.amount })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
