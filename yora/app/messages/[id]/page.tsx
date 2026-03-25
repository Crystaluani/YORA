'use client'

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/libs/supabase"

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export default function MessagesPage() {
  const params = useParams()
  const chatId = params?.id as string | undefined

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [user, setUser] = useState<any>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // ✅ get user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  // ✅ fetch messages
  useEffect(() => {
    if (!user || !chatId) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${chatId}),and(sender_id.eq.${chatId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true })

      setMessages((data || []) as Message[])
    }

    fetchMessages()
  }, [user, chatId])

  // ✅ realtime
  useEffect(() => {
    if (!user || !chatId) return

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message

          if (
            (msg.sender_id === user.id && msg.receiver_id === chatId) ||
            (msg.sender_id === chatId && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, chatId])

  // ✅ scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  // ✅ send
  const sendMessage = async () => {
    if (!text.trim() || !user || !chatId) return

    const newMsg: Message = {
      id: crypto.randomUUID(),
      sender_id: user.id,
      receiver_id: chatId,
      content: text,
      created_at: new Date().toISOString()
    }

    setMessages((prev) => [...prev, newMsg])
    setText("")

    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: chatId,
      content: text
    })
  }

  if (!chatId) return <p>Invalid chat</p>

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-xl font-bold mb-6">Chat</h1>

      <div
        ref={chatRef}
        className="space-y-3 min-h-[300px] max-h-[500px] overflow-y-auto"
      >
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

      <div className="mt-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}