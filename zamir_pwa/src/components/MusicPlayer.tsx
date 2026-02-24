"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  X,
  ChevronUp,
  ChevronDown,
  Download,
} from "lucide-react";
import { useState } from "react";
import { useMusic } from "@/lib/MusicContext";

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    progress,
    duration,
    seek,
    skip,
    volume,
    setVolume,
    loopMode,
    setLoopMode,
  } = useMusic();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoopToggle = () => {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
    const nextIndex = (modes.indexOf(loopMode) + 1) % modes.length;
    setLoopMode(modes[nextIndex]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`fixed bottom-24 left-4 right-4 z-40 glass rounded-[32px] border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden ${
          isExpanded ? "h-[85vh] bottom-4" : "h-20"
        }`}
      >
        {isExpanded ? (
          /* Expanded Player */
          <div className="h-full flex flex-col p-8 relative">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full"
            />

            <div className="flex-1 flex flex-col items-center justify-center mt-8">
              <motion.div
                layoutId="player-art"
                className="w-full aspect-square max-w-[320px] rounded-[40px] bg-gradient-to-br from-[#C9A042] to-[#E6D070] shadow-2xl flex items-center justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#09090B]/20 flex items-center justify-center backdrop-blur-md">
                  <span className="text-4xl text-[#09090B]">🎵</span>
                </div>
              </motion.div>

              <div className="mt-12 text-center">
                <h2 className="text-2xl font-serif text-[#FAFAFA] font-bold">
                  {currentTrack.title}
                </h2>
                <p className="text-[#C9A042] font-semibold mt-2 tracking-widest uppercase text-xs">
                  AI GENERATED WORSHIP
                </p>
              </div>
            </div>

            <div className="space-y-8 pb-8">
              {/* Seek Bar */}
              <div className="space-y-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={progress}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-[#C9A042] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-bold text-slate-500 tracking-wider">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleLoopToggle}
                  className={`p-2 transition-colors ${loopMode !== "none" ? "text-[#C9A042]" : "text-slate-500"}`}
                >
                  <Repeat size={24} />
                  {loopMode === "one" && (
                    <span className="absolute text-[8px] font-bold ml-1">
                      1
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-8">
                  <button
                    onClick={() => skip(-15)}
                    className="text-[#FAFAFA]/70 hover:text-white transition-colors"
                  >
                    <SkipBack size={32} />
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #C9A042, #E6D070)",
                      boxShadow: "0 10px 40px rgba(201,160,66,0.3)",
                    }}
                  >
                    {isPlaying ? (
                      <Pause
                        size={32}
                        fill="#09090B"
                        className="text-[#09090B]"
                      />
                    ) : (
                      <Play
                        size={32}
                        fill="#09090B"
                        className="text-[#09090B] ml-1"
                      />
                    )}
                  </motion.button>

                  <button
                    onClick={() => skip(15)}
                    className="text-[#FAFAFA]/70 hover:text-white transition-colors"
                  >
                    <SkipForward size={32} />
                  </button>
                </div>

                <a
                  href={currentTrack.url}
                  download
                  className="p-2 text-slate-500"
                >
                  <Download size={24} />
                </a>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-4 px-4">
                <Volume2 size={18} className="text-slate-500" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-[#C9A042]"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Mini Player */
          <div
            className="flex items-center justify-between p-3 gap-3"
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <motion.div
                layoutId="player-art"
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A042] to-[#E6D070] flex-shrink-0 flex items-center justify-center"
              >
                <span className="text-xl">🎵</span>
              </motion.div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-[#FAFAFA] truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] text-[#C9A042] font-bold tracking-widest uppercase">
                  Zamir Playback
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pr-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skip(-15);
                }}
                className="text-slate-500"
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-10 h-10 rounded-full bg-[#C9A042] flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause size={18} fill="#09090B" className="text-[#09090B]" />
                ) : (
                  <Play
                    size={18}
                    fill="#09090B"
                    className="text-[#09090B] ml-1"
                  />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skip(15);
                }}
                className="text-slate-500"
              >
                <SkipForward size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
