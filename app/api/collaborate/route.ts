import { supabase } from "@/libs/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request){

const formData = await req.formData()

const receiver_id = formData.get("receiver_id")
const message = formData.get("message")
const project_id = formData.get("project_id")

const { data:userData } = await supabase.auth.getUser()

const sender_id = userData.user?.id

const { error } = await supabase
.from("collaboration_requests")
.insert({

sender_id,
receiver_id,
project_id,
message,
status:"pending"

})
await supabase
.from("notifications")
.insert({
user_id: receiver_id,
message: "You received a collaboration request",
read: false
})

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({success:true})

}