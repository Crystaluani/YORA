import { supabase } from "@/libs/supabase"
import CollabRequestButton from "@/components/CollabRequestButton"

export default async function OpportunitiesPage() {

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(`
      id,
      title,
      description,
      creator_id,
      profiles (
        name
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="bg-white rounded-2xl shadow p-4">

      <h1 className="text-2xl font-bold mb-6">
        Collaboration Opportunities
      </h1>

      <div className="space-y-6">

        {opportunities?.length === 0 && (
          <p className="text-gray-400">
            No opportunities yet
          </p>
        )}

        {opportunities?.map((opp: any) => (
          <div
            key={opp.id}
            className="bg-white p-4 rounded-xl shadow"
          >

            <p className="font-semibold text-lg">
              {opp.title}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {opp.description}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Posted by: {opp.profiles?.name || "Creator"}
            </p>

            <div className="mt-4">
              <CollabRequestButton opportunityId={opp.id} creatorId={opp.creator_id} />
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}