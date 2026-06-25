import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 })
    }

    // Verify payment with Paystack
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    const data = await res.json()

    if (!data.status || data.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed", data },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      amount: data.data.amount / 100, // convert from kobo to naira
      reference: data.data.reference,
      email: data.data.customer?.email,
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}