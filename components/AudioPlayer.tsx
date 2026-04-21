"use client"

import { useEffect, useRef, useState } from "react"

export default function AudioPlayer({ url, title }: { url: string; title?: string }) {

  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    setProgress((audio.currentTime / audio.duration) * 100 || 0)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (!audio) return
    setDuration(audio.duration)
  }

  const handleEnded = () => setPlaying(false)

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width
    audio.currentTime = ratio * audio.duration
    setProgress(ratio * 100)
  }

  const fmt = (s: number) => {
    if (isNaN(s)) return "0:00"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <>
      <style>{`
        .ap-player {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 10px 14px;
        }
        .ap-play-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #d4af37;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .ap-play-btn:hover { opacity: 0.85; }
        .ap-progress-wrap {
          flex: 1;
          height: 4px;
          background: #1f1f1f;
          border-radius: 999px;
          cursor: pointer;
          position: relative;
        }
        .ap-progress-fill {
          height: 100%;
          background: #d4af37;
          border-radius: 999px;
          transition: width 0.1s linear;
          pointer-events: none;
        }
        .ap-time {
          font-size: 11px;
          color: #555;
          font-family: 'DM Sans', monospace;
          flex-shrink: 0;
          min-width: 36px;
          text-align: right;
        }
      `}</style>

      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="ap-player">
        {/* Play / Pause */}
        <button className="ap-play-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <rect x="0" y="0" width="4" height="14" rx="1" fill="#000" />
              <rect x="8" y="0" width="4" height="14" rx="1" fill="#000" />
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M1 1L11 7L1 13V1Z" fill="#000" />
            </svg>
          )}
        </button>

        {/* Progress bar */}
        <div className="ap-progress-wrap" onClick={handleSeek}>
          <div className="ap-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Time */}
        <span className="ap-time">
          {fmt(currentTime)}{duration > 0 ? ` / ${fmt(duration)}` : ""}
        </span>
      </div>
    </>
  )
}
