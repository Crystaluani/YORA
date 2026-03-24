import { supabase } from "@/libs/supabase"

export default async function CreatorProfile({ params }: any) {

const { data: profile } = await supabase
.from("profiles")
.select("*")
.eq("id", params.id)
.single()

  return (

    <div className="max-w-4xl mx-auto p-10">

      {profile?.banner_url && (
        <img
          src={profile.banner_url}
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
      )}

      <img
        src={profile?.avatar_url || "/default-avatar.png"}
        className="w-24 h-24 rounded-full object-cover"
      />

      <h1 className="text-2xl font-bold mt-4">
        {profile?.username}
      </h1>

      <p className="text-gray-600">
        {profile?.bio}
      </p>

    </div>

  )

const { data: projects } = await supabase
.from("projects")
.select("*")
.eq("creator_id", params.id)

const { count } = await supabase
.from("follows")
.select("*", { count: "exact", head: true })
.eq("following_id", params.id)
return (

<div className="max-w-6xl mx-auto p-10">

{/* PROFILE HEADER */}

<form action="/api/follow" method="POST" className="mt-4">

<input type="hidden" name="following_id" value={profile?.id} />

<button className="bg-blue-600 text-white px-4 py-2 rounded">
<p className="text-sm text-gray-600">
{count || 0} followers
</p>

Follow Creator

</button>

</form>


<div className="flex items-center gap-6 mb-10">

<img
src={profile?.avatar_url}
className="w-24 h-24 rounded-full object-cover"
/>

<div>

<h1 className="text-3xl font-bold">
{profile?.name}
</h1>

<p className="text-gray-600">
{profile?.creative_field}
</p>

<p className="text-sm mt-2">
{profile?.location}
</p>

</div>

</div>

{/* BIO */}

<div className="mb-10">

<h2 className="text-xl font-semibold mb-2">
About
</h2>

<p className="text-gray-700">
{profile?.bio}
</p>

</div>

{/* SKILLS */}

<div className="mb-10">

<h2 className="text-xl font-semibold mb-2">
Skills
</h2>

<p>
{profile?.skills}
</p>

</div>

{/* PROJECTS */}

<h2 className="text-2xl font-semibold mb-6">
Projects
</h2>

<div className="grid grid-cols-3 gap-6">

{projects?.map((project:any)=> (

<div key={project.id} className="border rounded-lg overflow-hidden shadow">

<img
src={project.media_url}
className="w-full h-48 object-cover"
/>

<div className="p-4">

<h3 className="font-semibold">
{project.title}
</h3>

</div>

</div>

))}

</div>

</div>

)

}
