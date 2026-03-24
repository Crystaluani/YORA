import { supabase } from "@/libs/supabase"
import NotificationItem from "@/components/NotificationItem"

export default async function NotificationsPage() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="bg-white rounded-2xl shadow p-4">

      <h1 className="text-2xl font-bold mb-6">
        Notifications
      </h1>

      <div className="space-y-4">

        {notifications?.length === 0 && (
          <p className="text-gray-400">
            No notifications yet
          </p>
        )}

        {notifications?.map((notif: any) => (
          <NotificationItem key={notif.id} notif={notif} />
        ))}

      </div>

    </div>
  )
}