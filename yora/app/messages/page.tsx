"use client"

import { supabase } from "@/libs/supabase"
import Link from "next/link"

export default async function MessagesPage() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return null

  // ✅ Get all messages involving user
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      sender_id,
      receiver_id,
      created_at
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  // ✅ Get unique conversation users
  const usersMap = new Map()

  messages?.forEach((msg: any) => {
    const otherUser =
      msg.sender_id === user.id
        ? msg.receiver_id
        : msg.sender_id

    if (!usersMap.has(otherUser)) {
      usersMap.set(otherUser, msg)
    }
  })

  const conversations = Array.from(usersMap.values())

  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Messages
      </h1>

      <div className="space-y-4">

        {conversations.length === 0 && (
          <p className="text-gray-400">
            No conversations yet
          </p>
        )}

        {conversations.map((msg: any) => {
          const otherUser =
            msg.sender_id === user.id
              ? msg.receiver_id
              : msg.sender_id

          return (
            <Link key={msg.id} href={`/messages/${otherUser}`}>
              
              <div className="bg-white rounded-2xl shadow p-4">

                <p className="font-semibold">
                  User: {otherUser}
                </p>

                <p className="text-sm text-gray-500 truncate">
                  {msg.content}
                </p>

              </div>

            </Link>
          )
        })}

      </div>

    </div>
  )
}