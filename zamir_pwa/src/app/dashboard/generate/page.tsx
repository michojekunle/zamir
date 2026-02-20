"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AudioLines,
  Loader2,
  Wand2,
  Pause,
  Play,
  Download,
  ChevronDown,
  ChevronUp,
  BookMarked,
} from "lucide-react";

const PRESETS = [
  {
    label: "Psalm 23",
    text: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.",
  },
  {
    label: "John 3:16",
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  },
  {
    label: "Isaiah 40:31",
    text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
  },
  {
    label: "Philippians 4:7",
    text: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
  },
  {
    label: "Romans 8:28",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
  },
];

const VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", label: "Rachel — Warm, Peaceful" },
  { id: "AZnzlk1XvdvUeBnXmlld", label: "Domi — Deep, Meditative" },
  { id: "MF3mGyEYCl7XYWbV9V6O", label: "Elli — Soft, Devotional" },
];

export default function GeneratePage() {
  const [text, setText] = useState(PRESETS[0].text);
  const [voice, setVoice] = useState(VOICES[0].id);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: voice }),
      });
      if (!res.ok) throw new Error("Generation failed. Check your API key.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none">
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-5"
        style={{
          background: "rgba(15,27,46,0.9)",
          backdropFilter: "blur(20px)",
        }}
      >
        <p className="text-[#C9A042] text-xs font-bold uppercase tracking-[3px] mb-1">
          AI Studio
        </p>
        <h1 className="text-2xl font-serif text-[#F7F3EC]">
          Create Your Sound
        </h1>
      </div>

      <div className="px-5 space-y-6 relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#C9A042] rounded-full blur-[120px] opacity-10 pointer-events-none" />

        {/* Scripture Input */}
        <div className="glass rounded-[24px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
              Scripture / Prayer
            </label>
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1 text-xs font-semibold text-[#C9A042]"
            >
              <BookMarked size={12} /> Presets{" "}
              {showPresets ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-2 overflow-hidden"
              >
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setText(p.text);
                      setShowPresets(false);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold glass-gold"
                  >
                    {p.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Enter any Bible verse, psalm, or prayer..."
            className="w-full bg-[#0F1B2E]/60 border border-[#2B3B54] rounded-2xl p-4 text-[#F7F3EC] focus:outline-none focus:border-[#C9A042] resize-none text-sm leading-relaxed placeholder-slate-600 transition-colors"
          />

          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span>{text.length} characters</span>
            <span className="ml-auto text-[#C9A042]">
              {text.split(" ").filter(Boolean).length} words
            </span>
          </div>
        </div>

        {/* Voice selector */}
        <div className="glass rounded-[24px] p-5">
          <label className="text-xs font-bold uppercase tracking-[2px] text-slate-400 block mb-3">
            Voice Style
          </label>
          <div className="space-y-2">
            {VOICES.map((v) => (
              <motion.button
                key={v.id}
                onClick={() => setVoice(v.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between transition-all ${
                  voice === v.id
                    ? "glass-gold border-[#C9A042]/40"
                    : "bg-[#0F1B2E]/40 border border-[#2B3B54] hover:border-[#2B3B54]"
                }`}
              >
                <span className="text-sm font-semibold text-[#F7F3EC]">
                  {v.label}
                </span>
                {voice === v.id && (
                  <motion.div
                    layoutId="voiceCheck"
                    className="w-4 h-4 rounded-full bg-[#C9A042]"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <motion.button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full btn-gold text-base py-5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Weaving your
              melody...
            </>
          ) : (
            <>
              <Wand2 size={20} /> Generate Ambient Worship
            </>
          )}
        </motion.button>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-2xl py-3 px-4">
            {error}
          </p>
        )}

        {/* Audio player */}
        <AnimatePresence>
          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="glass-gold rounded-[24px] p-6 flex flex-col items-center gap-6"
            >
              {/* Waveform viz */}
              <div className="flex items-end gap-[3px] h-12 w-full justify-center">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-[#C9A042]"
                    style={{ minHeight: 3 }}
                    animate={
                      isPlaying
                        ? {
                            height: [
                              `${4 + Math.sin(i * 0.7) * 20 + 8}px`,
                              `${4 + Math.sin(i * 0.7 + 2) * 28 + 8}px`,
                              `${4 + Math.sin(i * 0.7 + 4) * 16 + 8}px`,
                            ],
                          }
                        : { height: "4px" }
                    }
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.04,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <p className="text-[#F7F3EC] text-sm font-semibold">
                Your sound is ready ✨
              </p>

              <div className="flex gap-4">
                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #C9A042, #E6C57A)",
                    boxShadow: "0 8px 24px rgba(201,160,66,0.4)",
                  }}
                >
                  {isPlaying ? (
                    <Pause
                      size={24}
                      fill="#0F1B2E"
                      className="text-[#0F1B2E]"
                    />
                  ) : (
                    <Play
                      size={24}
                      fill="#0F1B2E"
                      className="text-[#0F1B2E] ml-1"
                    />
                  )}
                </motion.button>
                <motion.a
                  href={audioUrl}
                  download="zamir_worship.mp3"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 glass rounded-full flex items-center justify-center text-[#C9A042] border border-[#C9A042]/30"
                >
                  <Download size={22} />
                </motion.a>
              </div>
              <p className="text-slate-500 text-xs text-center">
                Powered by ElevenLabs AI · Add to library to save
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
