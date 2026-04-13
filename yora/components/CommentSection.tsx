"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function CommentSection({ projectId }: any) {

  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // ✅ Fetch comments
  const fetchComments = async () => {
    const { data } = await supabase
      .from("project_comments")
      .select(`
        id,
        comment,
        created_at,
        user_id,
        profiles (
          username
        )
      `)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    setComments(data || [])
  }

  useEffect(() => {
    fetchComments()

    // ✅ Real-time subscription
    const channel = supabase
      .channel("comments-" + projectId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_comments",
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          setComments(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  // ✅ Add comment
  const handleComment = async () => {
    if (!comment.trim() || loading) return

    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from("project_comments")
      .insert({
        project_id: projectId,
        user_id: user.id,
        comment: comment
      })

    if (!error) {
      setComment("")
    }

    setLoading(false)
  }

  return (
    <div className="mt-4">

      {/* Comment input */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="w-full border rounded p-2"
      />

      <button
        onClick={handleComment}
        className="mt-2 bg-black text-white px-4 py-2 rounded"
      >
        Post Comment
      </button>

      {/* Comments list */}
      <div className="mt-4 space-y-3">

        {comments.length === 0 && (
          <p className="text-sm text-gray-400">
            No comments yet.
          </p>
        )}

        {comments.map((c: any) => (
          <div key={c.id} className="bg-gray-100 p-2 rounded">

            <p className="text-sm font-semibold">
              {c.profiles?.username || "User"}
            </p>

            <p className="text-sm">
              {c.comment}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}