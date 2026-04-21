import { supabase } from "@/libs/supabase"
import TrackCard from "@/components/TrackCard"
import Link from "next/link"

export default async function Feed() {

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch tracks joined with profiles for artist info
  const { data: tracks } = await supabase
    .from("tracks")
    .select(`
      id,
      title,
      description,
      image_url,
      audio_url,
      genre,
      creator_id,
      created_at,
      track_likes ( user_id ),
      profiles (
        name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })

  const formattedTracks = tracks?.map((track: any) => ({
    ...track,
    likeCount: track.track_likes?.length || 0,
    isLiked: track.track_likes?.some((l: any) => l.user_id === user?.id) || false,
    artistName: track.profiles?.name,
    artistAvatar: track.profiles?.avatar_url,
  }))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .feed { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; padding: 48px 24px 80px; }
        .feed-syne { font-family: 'Syne', sans-serif; }
        .feed-upload-btn { display: inline-block; background: #d4af37; color: #000; font-weight: 600; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 22px; border-radius: 999px; text-decoration: none; transition: opacity 0.2s; }
        .feed-upload-btn:hover { opacity: 0.85; }
        .empty-state { border: 1px dashed #1a1a1a; border-radius: 20px; padding: 80px 24px; text-align: center; }
      `}</style>

      <div className="feed">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4af37", margin: "0 0 8px" }}>
                Latest
              </p>
              <h1 className="feed-syne" style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                Discover Music
              </h1>
            </div>
            <Link href="/upload-track" className="feed-upload-btn">
              + Upload Track
            </Link>
          </div>

          {/* Feed */}
          {!formattedTracks || formattedTracks.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: 40, marginBottom: 16 }}>🎵</p>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
                No tracks yet
              </p>
              <p style={{ fontSize: 14, color: "#444", marginBottom: 28 }}>
                Be the first to share your music with the world
              </p>
              <Link href="/upload-track" className="feed-upload-btn">
                Upload the first track
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {formattedTracks.map((track: any) => (
                <TrackCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  image={track.image_url}
                  description={track.description}
                  artist={track.creator_id}
                  artistName={track.artistName}
                  artistAvatar={track.artistAvatar}
                  genre={track.genre}
                  audioUrl={track.audio_url}
                  likeCount={track.likeCount}
                  isLiked={track.isLiked}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
