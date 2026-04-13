"use client"

import { supabase } from "@/libs/supabase"
import { useRouter } from "next/navigation"

export default function NotificationItem({ notif }: any) {

  const router = useRouter()

  const handleClick = async () => {

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notif.id)

    if (notif.link) {
      router.push(notif.link)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-xl shadow cursor-pointer ${
        notif.read
          ? "bg-white"
          : "bg-gray-100 border-l-4 border-black"
      }`}
    >
      <p className="text-sm">
        {notif.message}
      </p>
    </div>
  )
}