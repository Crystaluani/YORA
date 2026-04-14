"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"
import CommentSection from "./CommentSection"

type ProjectCardProps = {
  id: string
  title: string
  image: string
  description: string
  creator: string
  likeCount: number
  isLiked: boolean
}

export default function ProjectCard({
  id,
  title,
  image,
  description,
  creator,
  likeCount,
  isLiked
}: ProjectCardProps) {

  const [liked, setLiked] = useState<boolean>(isLiked)
  const [likes, setLikes] = useState<number>(likeCount)
  const [loading, setLoading] = useState<boolean>(false)

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      setLoading(false)
      return
    }

    // ✅ Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setLikes((prev: number) => newLiked ? prev + 1 : prev - 1)

    let error

    if (newLiked) {
      // LIKE
      const res = await supabase
        .from("project_likes")
        .insert({
          project_id: id,
          user_id: user.id
        })

      error = res.error

      // ✅ Send notification (not to yourself)
      if (!error && user.id !== creator) {
       await supabase.from("notifications").insert({
  user_id: creator,
  type: "like",
  message: "Someone liked your project",
  link: `/projects/${id}`
})
      }

    } else {
      // UNLIKE
      const res = await supabase
        .from("project_likes")
        .delete()
        .match({
          project_id: id,
          user_id: user.id
        })

      error = res.error
    }

    // ❌ rollback if error
    if (error) {
      setLiked(isLiked)
      setLikes(likeCount)
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">

      {/* Image */}
      <img
        src={image || "/placeholder.png"}
        className="w-full h-48 object-cover"
        alt={title}
      />

      <div className="p-4">

        {/* Title */}
        <h3 className="font-semibold text-lg mb-1">
          {title || "Untitled Project"}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-3">
          {description || "Creative project"}
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center">

          <button
            onClick={handleLike}
            className="text-red-500 text-sm"
          >
            {liked ? "❤️" : "🤍"} {likes}
          </button>

        </div>

        {/* Comments */}
        <div className="mt-4">
          <CommentSection projectId={id} />
        </div>

      </div>
    </div>
  )
}