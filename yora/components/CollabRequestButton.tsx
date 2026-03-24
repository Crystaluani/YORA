"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function CollabRequestButton({
  opportunityId,
  creatorId
}: any) {

  const [sent, setSent] = useState(false)

  const handleRequest = async () => {

    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) return

    // ❌ prevent self-request
    if (user.id === creatorId) return

    await supabase.from("collab_requests").insert({
      opportunity_id: opportunityId,
      sender_id: user.id,
      receiver_id: creatorId,
      status: "pending"
    })

    // 🔔 notify creator
    await supabase.from("notifications").insert({
      user_id: creatorId,
      type: "collab",
      message: "New collaboration request"
    })

    setSent(true)
  }

  return (
    <button
      onClick={handleRequest}
      className="bg-black text-white px-4 py-2 rounded-lg"
    >
      {sent ? "Request Sent" : "Request Collaboration"}
    </button>
  )
}