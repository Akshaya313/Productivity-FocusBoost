"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Music, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface Track {
  title: string;
  artist: string;
  genre: "lofi" | "synthwave" | "ambient" | "jazz";
  url: string;
}

const CURATED_PLAYLISTS: Track[] = [
  {
    title: "Celestial Lofi Study",
    artist: "Chilled Cow Sim",
    genre: "lofi",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Neon Cyberpunk Flow",
    artist: "Synth Runner",
    genre: "synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Deep Space Frequency",
    artist: "Alpha Waves",
    genre: "ambient",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    title: "Rainy Afternoon Jazz",
    artist: "Blue Note Mock",
    genre: "jazz",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
  }
];

export default function SpotifyFocusPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = CURATED_PLAYLISTS[currentTrackIndex];

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync track changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    const wasPlaying = isPlaying;
    audioRef.current.pause();
    
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    if (wasPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  // Sync volume slider
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          alert("Click again or select another track (requires browser interaction approval)");
          setIsPlaying(false);
        });
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % CURATED_PLAYLISTS.length);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/10 flex flex-col gap-4 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

      {/* Track info & visualizer */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/10 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
            <Music size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block truncate max-w-[140px]">
              {currentTrack.title}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-mono text-[var(--text-muted)] mt-0.5 block">
              {currentTrack.artist} • {currentTrack.genre}
            </span>
          </div>
        </div>

        {/* CSS Audio visualizer waves */}
        <div className="flex items-end gap-[2px] h-4">
          {[0.7, 0.4, 0.95, 0.3, 0.8, 0.5].map((scale, i) => (
            <motion.div
              key={i}
              className="w-[2px] bg-[var(--accent)] rounded-full"
              initial={{ height: 3 }}
              animate={{ 
                height: isPlaying ? [3, Math.round(scale * 16), 3] : 3 
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8 + (i * 0.1),
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Control panel buttons */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg cursor-pointer transition-colors"
            >
              {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward size={14} />
            </button>
          </div>

          {/* Volume slider mixer */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-xl max-w-[110px]">
            <Volume2 size={13} className="text-[var(--text-muted)] shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 accent-purple-400 bg-white/10 h-[3px] rounded-lg outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Playlist selector tabs */}
        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold mt-1">
          {CURATED_PLAYLISTS.map((track, i) => (
            <button
              key={i}
              onClick={() => setCurrentTrackIndex(i)}
              className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer truncate px-1.5 ${
                currentTrackIndex === i
                  ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                  : "bg-white/2 border-transparent text-[var(--text-muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              {track.genre.toUpperCase()}: {track.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
