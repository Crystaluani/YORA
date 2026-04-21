"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/libs/supabase"
import AudioPlayer from "./AudioPlayer"
import CommentSection from "./CommentSection"

type TrackCardProps = {
  id: string
  title: string
  image: string
  description: string
  artist: string
  artistName?: string
  artistAvatar?: string
  genre?: string
  audioUrl?: string
  likeCount: number
  isLiked: boolean
}

export default function TrackCard({
  id, title, image, description, artist,
  artistName, artistAvatar, genre, audioUrl,
  likeCount, isLiked
}: TrackCardProps) {

  const [liked, setLiked] = useState(isLiked)
  const [likes, setLikes] = useState(likeCount)
  const [loading, setLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) { setLoading(false); return }

    const newLiked = !liked
    setLiked(newLiked)
    setLikes(prev => newLiked ? prev + 1 : prev - 1)

    let error
    if (newLiked) {
      const res = await supabase.from("track_likes").insert({ track_id: id, user_id: user.id })
      error = res.error
      if (!error && user.id !== artist) {
        await supabase.from("notifications").insert({
          user_id: artist, type: "like",
          message: "Someone liked your track",
          link: `/tracks/${id}`
        })
      }
    } else {
      const res = await supabase.from("track_likes").delete().match({ track_id: id, user_id: user.id })
      error = res.error
    }

    if (error) { setLiked(isLiked); setLikes(likeCount) }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .tc { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; overflow: hidden; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
        .tc:hover { border-color: #252525; }
        .tc-syne { font-family: 'Syne', sans-serif; }
        .tc-cover { width: 100%; height: 220px; object-fit: cover; display: block; }
        .tc-avatar { width: 36px; height: 36px; border-radius: 50%; background: #1a1a1a; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #d4af37; flex-shrink: 0; border: 1.5px solid #2a2a2a; }
        .tc-like-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid #222; border-radius: 999px; padding: 7px 14px; color: #666; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .tc-like-btn:hover { border-color: #e44; color: #e44; }
        .tc-like-btn.liked { border-color: rgba(228,68,68,0.4); color: #f87171; background: rgba(228,68,68,0.06); }
        .tc-comment-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid #222; border-radius: 999px; padding: 7px 14px; color: #666; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .tc-comment-btn:hover { border-color: #444; color: #aaa; }
        .tc-book-link { display: inline-block; background: #d4af37; color: #000; font-weight: 600; font-size: 12px; font-family: 'DM Sans', sans-serif; padding: 7px 16px; border-radius: 999px; text-decoration: none; transition: opacity 0.2s; margin-left: auto; }
        .tc-book-link:hover { opacity: 0.85; }
        .genre-tag { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.25); padding: 3px 10px; border-radius: 999px; }
      `}</style>

      <div className="tc">

        {/* Cover image */}
        <div style={{ position: "relative" }}>
          <img
            src={image || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600"}
            alt={title}
            className="tc-cover"
          />
          {genre && (
            <span className="genre-tag" style={{ position: "absolute", top: 12, left: 12, background: "rgba(8,8,8,0.8)", backdropFilter: "blur(4px)" }}>
              {genre}
            </span>
          )}
        </div>

        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Artist row */}
          <Link href={`/artists/${artist}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
            <div className="tc-avatar">
              {artistAvatar
                ? <img src={artistAvatar} alt={artistName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : artistName?.[0]?.toUpperCase() || "A"
              }
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "#ccc" }}>{artistName || "Unknown Artist"}</p>
              <p style={{ fontSize: 11, color: "#444", margin: 0 }}>View profile →</p>
            </div>
          </Link>

          {/* Title + description */}
          <div>
            <h3 className="tc-syne" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "#fff", letterSpacing: "-0.01em" }}>
              {title || "Untitled Track"}
            </h3>
            {description && (
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.6 }}>{description}</p>
            )}
          </div>

          {/* Audio player */}
          {audioUrl && <AudioPlayer url={audioUrl} title={title} />}

          {/* Actions row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={handleLike}
              disabled={loading}
              className={`tc-like-btn${liked ? " liked" : ""}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "#f87171" : "none"} stroke={liked ? "#f87171" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likes}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="tc-comment-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {showComments ? "Hide" : "Comments"}
            </button>

            <Link href={`/artists/${artist}`} className="tc-book-link">
              Book Artist
            </Link>
          </div>

          {/* Comments */}
          {showComments && (
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14 }}>
              <CommentSection trackId={id} />
            </div>
          )}

        </div>
      </div>
    </>
  )
}
