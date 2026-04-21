"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function CommentSection({ trackId }: { trackId: string }) {

  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    const { data } = await supabase
      .from("track_comments")
      .select(`
        id,
        comment,
        created_at,
        user_id,
        profiles (
          username
        )
      `)
      .eq("track_id", trackId)
      .order("created_at", { ascending: false })

    setComments(data || [])
  }

  useEffect(() => {
    fetchComments()

    const channel = supabase
      .channel("comments-" + trackId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "track_comments",
          filter: `track_id=eq.${trackId}`
        },
        (payload) => {
          setComments(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [trackId])

  const handleComment = async () => {
    if (!comment.trim() || loading) return
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) { setLoading(false); return }

    const { error } = await supabase
      .from("track_comments")
      .insert({
        track_id: trackId,
        user_id: user.id,
        comment: comment
      })

    if (!error) setComment("")
    setLoading(false)
  }

  return (
    <div className="mt-4">
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

      <div className="mt-4 space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">No comments yet.</p>
        )}
        {comments.map((c: any) => (
          <div key={c.id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm font-semibold">{c.profiles?.username || "User"}</p>
            <p className="text-sm">{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
