import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const following_id = formData.get("following_id")?.toString()

    if (!following_id) {
      return NextResponse.json(
        { error: "Missing following_id" },
        { status: 400 }
      )
    }

    // Create client INSIDE function (important for Vercel)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const follower_id = user.id

    const { error } = await supabase
      .from("follows")
      .insert({
        follower_id,
        following_id,
      })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    await supabase.from("notifications").insert({
      user_id: following_id,
      message: "Someone started following you",
      read: false,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}