"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function ChatPage({ params }: { params: { id: string } }) {

  const id = params.id

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Get user first
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
    return data.user
  }

  // ✅ Fetch messages
  const fetchMessages = async (currentUser: any) => {
    if (!currentUser) return

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${id}),
         and(sender_id.eq.${id},receiver_id.eq.${currentUser.id})`
      )
      .order("created_at", { ascending: true })

    setMessages(data || [])
    setLoading(false)
  }

  // ✅ Real-time (FILTERED)
  const subscribeToMessages = (currentUser: any) => {

    const channel = supabase
      .channel(`chat-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages"
        },
        (payload) => {
          const msg = payload.new

          // ✅ Only add relevant messages
          if (
            (msg.sender_id === currentUser.id && msg.receiver_id === id) ||
            (msg.sender_id === id && msg.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, msg])
          }
        }
      )
      .subscribe()

    return channel
  }

  useEffect(() => {
    let channel: any

    const init = async () => {
      const currentUser = await getUser()
      if (!currentUser) return

      await fetchMessages(currentUser)
      channel = subscribeToMessages(currentUser)
    }

    init()

    // ✅ cleanup
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [id])

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim() || !user) return

    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: id,
      content: text
    })

    setText("")
  }

  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-xl font-bold mb-6">
        Chat
      </h1>

      {/* Messages */}
      <div className="space-y-3 min-h-[300px]">

        {loading && (
          <p className="text-gray-400">Loading...</p>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-gray-400">No messages yet</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded ${
              msg.sender_id === user?.id
                ? "bg-black text-white ml-auto w-fit"
                : "bg-gray-200 w-fit"
            }`}
          >
            {msg.content}
          </div>
        ))}

      </div>

      {/* Input */}
      <div className="mt-6 flex gap-2">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
        />

        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Send
        </button>

      </div>

    </div>
  )
}