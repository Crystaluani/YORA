import { supabase } from "@/libs/supabase"

export default async function Dashboard() {

const { data: { user } } = await supabase.auth.getUser()

const { data: projects } = await supabase
.from("projects")
.select("*")
.eq("creator_id", user?.id)

return (

<div className="p-10">

<h1 className="text-3xl font-bold mb-8">
Creator Dashboard
</h1>

<div className="grid grid-cols-3 gap-6">

<div className="border p-6 rounded-lg">
<h2 className="text-xl font-semibold">Projects</h2>
<p className="text-3xl mt-4">{projects?.length || 0}</p>
</div>

<div className="border p-6 rounded-lg">
<h2 className="text-xl font-semibold">Collaborations</h2>
<p className="text-3xl mt-4">0</p>
</div>

<div className="border p-6 rounded-lg">
<h2 className="text-xl font-semibold">Opportunities</h2>
<p className="text-3xl mt-4">0</p>
</div>

</div>

</div>

)
}