import { supabase } from "@/libs/supabase"

export default async function RequestsPage() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data: requests } = await supabase
    .from("collab_requests")
    .select(`
      id,
      status,
      sender_id,
      profiles (
        name
      )
    `)
    .eq("receiver_id", user?.id)

  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Collaboration Requests
      </h1>

      <div className="space-y-4">

        {requests?.length === 0 && (
          <p className="text-gray-400">
            No requests yet
          </p>
        )}

        {requests?.map((req: any) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded-xl shadow"
          >

            <p>
              {req.profiles?.name || "User"} wants to collaborate
            </p>

            <p className="text-sm text-gray-500">
              Status: {req.status}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}