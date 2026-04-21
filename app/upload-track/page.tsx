"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase"

const GENRES = ["Afrobeats", "Hip-Hop", "R&B", "Amapiano", "Gospel", "Pop", "Jazz", "Drill", "Highlife", "Reggae", "Soul", "Other"]

export default function UploadTrackPage() {

  const router = useRouter()
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [description, setDescription] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!title)     return alert("Please add a track title")
    if (!genre)     return alert("Please select a genre")
    if (!audioFile) return alert("Please select an audio file")

    setUploading(true)

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) { setUploading(false); return }

    const timestamp = Date.now()
    let audio_url = ""
    let image_url = ""

    // 1. Upload audio
    setUploadProgress("Uploading audio...")
    const audioPath = `${userId}/${timestamp}-${audioFile.name}`
    const { error: audioError } = await supabase.storage
      .from("tracks")
      .upload(audioPath, audioFile)

    if (audioError) {
      alert(`Audio upload failed: ${audioError.message}`)
      setUploading(false)
      setUploadProgress(null)
      return
    }

    const { data: audioData } = supabase.storage.from("tracks").getPublicUrl(audioPath)
    audio_url = audioData.publicUrl

    // 2. Upload cover image (optional)
    if (coverFile) {
      setUploadProgress("Uploading cover image...")
      const coverPath = `${userId}/${timestamp}-cover-${coverFile.name}`
      const { error: coverError } = await supabase.storage
        .from("covers")
        .upload(coverPath, coverFile)

      if (!coverError) {
        const { data: coverData } = supabase.storage.from("covers").getPublicUrl(coverPath)
        image_url = coverData.publicUrl
      }
    }

    // 3. Save to tracks table
    setUploadProgress("Saving track...")
    const { error: dbError } = await supabase
      .from("tracks")
      .insert({
        creator_id: userId,
        title,
        genre,
        description,
        audio_url,
        image_url: image_url || null,
      })

    if (dbError) {
      alert(`Failed to save track: ${dbError.message}`)
      setUploading(false)
      setUploadProgress(null)
      return
    }

    setUploadProgress(null)
    setUploading(false)
    router.push(`/artists/${userId}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .ut { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; padding: 60px 24px 80px; }
        .ut-syne { font-family: 'Syne', sans-serif; }
        .ut-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; padding: 36px; max-width: 580px; margin: 0 auto; }
        .ut-input { width: 100%; background: #080808; border: 1px solid #1f1f1f; border-radius: 10px; padding: 12px 16px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .ut-input:focus { border-color: #d4af37; }
        .ut-label { display: block; font-size: 11px; color: #555; margin-bottom: 6px; letter-spacing: 0.09em; text-transform: uppercase; }
        .ut-submit { width: 100%; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 14px; border-radius: 12px; border: none; cursor: pointer; transition: opacity 0.2s; }
        .ut-submit:hover:not(:disabled) { opacity: 0.85; }
        .ut-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .genre-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .genre-btn { padding: 9px 8px; border: 1px solid #1f1f1f; border-radius: 10px; font-size: 12px; color: #666; cursor: pointer; text-align: center; transition: all 0.2s; background: transparent; font-family: 'DM Sans', sans-serif; }
        .genre-btn:hover { border-color: #333; color: #aaa; }
        .genre-btn.sel { border-color: #d4af37; color: #d4af37; background: rgba(212,175,55,0.06); }
        .drop-zone { border: 1px dashed #2a2a2a; border-radius: 14px; padding: 28px 20px; text-align: center; cursor: pointer; transition: border-color 0.2s; position: relative; }
        .drop-zone:hover { border-color: #d4af37; }
        .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .cover-preview { width: 100%; aspect-ratio: 1; border-radius: 12px; object-fit: cover; display: block; }
        .progress-bar { background: #1a1a1a; border-radius: 999px; height: 4px; margin-top: 12px; overflow: hidden; }
        .progress-fill { height: 100%; background: #d4af37; border-radius: 999px; animation: indeterminate 1.5s infinite; }
        @keyframes indeterminate {
          0%   { width: 0%; margin-left: 0%; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>

      <div className="ut">
        <div style={{ maxWidth: 580, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 className="ut-syne" style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Upload a Track
            </h1>
            <p style={{ color: "#555", fontSize: 14, margin: 0 }}>
              Share your music with the world
            </p>
          </div>

          <div className="ut-card">
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              {/* Cover Image */}
              <div>
                <label className="ut-label">Cover Image</label>
                {coverPreview ? (
                  <div style={{ position: "relative" }}>
                    <img src={coverPreview} className="cover-preview" alt="cover" />
                    <button
                      onClick={() => { setCoverFile(null); setCoverPreview(null) }}
                      style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.7)", border: "1px solid #333", color: "#fff", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="drop-zone">
                    <input type="file" accept="image/*" onChange={handleCover} />
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>🎨</p>
                    <p style={{ fontSize: 14, color: "#555", margin: "0 0 4px" }}>Click to upload cover art</p>
                    <p style={{ fontSize: 12, color: "#333", margin: 0 }}>JPG, PNG — square image recommended</p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="ut-label">Track Title *</label>
                <input
                  className="ut-input"
                  placeholder="What's the track called?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              {/* Genre */}
              <div>
                <label className="ut-label">Genre *</label>
                <div className="genre-grid">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      className={`genre-btn${genre === g ? " sel" : ""}`}
                      onClick={() => setGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="ut-label">Description (optional)</label>
                <textarea
                  className="ut-input"
                  placeholder="What's this track about? Any story behind it?"
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Audio File */}
              <div>
                <label className="ut-label">Audio File *</label>
                {audioFile ? (
                  <div style={{ background: "#080808", border: "1px solid #1f1f1f", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 2L12 7L2 12V2Z" fill="#d4af37" />
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 2px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{audioFile.name}</p>
                        <p style={{ fontSize: 11, color: "#555", margin: 0 }}>{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAudioFile(null)}
                      style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#666", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="drop-zone">
                    <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>🎵</p>
                    <p style={{ fontSize: 14, color: "#555", margin: "0 0 4px" }}>Click to upload audio</p>
                    <p style={{ fontSize: 12, color: "#333", margin: 0 }}>MP3, WAV, FLAC, AAC supported</p>
                  </div>
                )}
              </div>

              {/* Upload button */}
              <button className="ut-submit" onClick={handleUpload} disabled={uploading}>
                {uploading ? uploadProgress || "Uploading..." : "Upload Track"}
              </button>

              {uploading && (
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
