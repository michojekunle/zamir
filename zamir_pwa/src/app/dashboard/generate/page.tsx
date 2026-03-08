"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  BookMarked,
  Sparkles,
  CloudUpload,
  Globe,
  Music,
  RefreshCw,
} from "lucide-react";
import { useMusic } from "@/lib/MusicContext";
import { db, auth, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  incrementGlobalStat,
  incrementUserStat,
  trackEvent,
} from "@/lib/AnalyticsService";
import { useSearchParams } from "next/navigation";

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

const MOODS = ["Peaceful", "Joyful", "Intense", "Reflective", "Calm"];
const TEMPOS = ["Slow", "Moderate", "Fast"];

// Progress steps for the multi-stage generation
const PROGRESS_STEPS = [
  { key: "script", label: "Crafting Song Structure...", icon: "✍️" },
  { key: "submit", label: "Submitting to Suno AI...", icon: "🎵" },
  { key: "generate", label: "Generating Your Song...", icon: "🎶" },
  { key: "complete", label: "Song Ready!", icon: "✨" },
];

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("text") || PRESETS[0].text);
  const [mood, setMood] = useState("Peaceful");
  const [tempo, setTempo] = useState("Slow");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastGenerated, setLastGenerated] = useState<any>(null);
  const [generatedLyrics, setGeneratedLyrics] = useState<string>("");
  const [generatedStyle, setGeneratedStyle] = useState<string>("");
  const [status, setStatus] = useState("");

  const { playTrack, isPlaying, togglePlay, currentTrack } = useMusic();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setCurrentStep(0);
    setLastGenerated(null);

    try {
      // ── Stage 1: Script Generation (Gemini → Suno-optimized lyrics) ──
      setCurrentStep(0);
      const scriptRes = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mood, tempo }),
      });

      if (!scriptRes.ok) {
        const errData = await scriptRes.json();
        throw new Error(errData.error || "Failed to craft song structure.");
      }

      const { lyrics, style, title } = await scriptRes.json();
      setGeneratedLyrics(lyrics);
      setGeneratedStyle(style);

      // ── Stage 2: Submit & Generate via Suno ──
      setCurrentStep(1);
      const sunoRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics, style, title }),
      });

      setCurrentStep(2);

      if (!sunoRes.ok) {
        const errData = await sunoRes.json();
        throw new Error(
          errData.error || "Suno generation failed. Please try again.",
        );
      }

      const result = await sunoRes.json();

      if (result.status !== "SUCCESS" || !result.tracks?.length) {
        throw new Error("No audio tracks were returned. Please retry.");
      }

      setCurrentStep(3);

      // Use the first track
      const sunoTrack = result.tracks[0];
      const audioUrl = sunoTrack.streamUrl || sunoTrack.audioUrl;

      const track = {
        id: "suno-" + (sunoTrack.id || Math.random().toString(36).substr(2, 9)),
        title: sunoTrack.title || title || text.slice(0, 30),
        url: audioUrl,
        artist: "Zamir AI × Suno",
        mood,
        tempo,
        style: sunoTrack.style || style,
        lyrics: sunoTrack.lyrics || lyrics,
        imageUrl: sunoTrack.imageUrl,
        duration: sunoTrack.duration,
        sunoTaskId: result.taskId,
      };

      setLastGenerated(track);
      playTrack(track);

      // Log stats
      incrementGlobalStat("totalSongs");
      if (auth.currentUser) {
        incrementUserStat(auth.currentUser.uid, "songsGenerated");
      }
      trackEvent("song_generated_suno", { mood, tempo, style });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveToProfile = async () => {
    if (!auth.currentUser || !lastGenerated) {
      if (!auth.currentUser) setError("You must be logged in to save.");
      return;
    }
    try {
      setStatus("Uploading to cloud...");

      // Fetch the audio (works for both blob URLs and external URLs)
      const response = await fetch(lastGenerated.url);
      const blob = await response.blob();

      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/library/${lastGenerated.id}.mp3`,
      );
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "users", auth.currentUser.uid, "library"), {
        ...lastGenerated,
        url: downloadUrl,
        createdAt: serverTimestamp(),
        public: false,
      });

      setStatus("Saved to Library!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save to cloud.");
    } finally {
      setStatus("");
    }
  };

  const handlePublish = async (track: any) => {
    if (!auth.currentUser) return;
    try {
      setStatus("Publishing for review...");
      await addDoc(collection(db, "moderation_queue"), {
        ...track,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Soul Seeker",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setStatus("Published for Review!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to publish.");
    } finally {
      setStatus("");
    }
  };

  const isCurrentGenerated = currentTrack?.id === lastGenerated?.id;

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none bg-[#09090B]">
      {/* Header */}
      <div className="sticky top-0 z-20 px-5 pt-12 pb-5 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[#C9A042] text-xs font-bold uppercase tracking-[4px]">
            Divine Studio
          </p>
          <span className="px-2 py-0.5 rounded-full bg-[#C9A042]/10 text-[#C9A042] text-[9px] font-bold uppercase tracking-wider border border-[#C9A042]/20">
            Suno AI
          </span>
        </div>
        <h1 className="text-2xl font-serif text-[#FAFAFA]">
          Scripture into Song
        </h1>
      </div>

      <div className="px-5 space-y-6 relative max-w-2xl mx-auto pt-6">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C9A042] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[24px] p-5 border border-[#C9A042]/10"
        >
          <div className="flex items-start gap-4 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-[#C9A042]/10 flex items-center justify-center shrink-0 text-[#C9A042]">
              <Music size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FAFAFA] mb-1">
                Full AI Song Generation
              </h3>
              <p className="text-xs leading-relaxed">
                Powered by <strong className="text-[#C9A042]">Suno AI</strong>,
                Zamir transforms your scripture into a complete song — vocals,
                melody, instrumentation, and all. Choose your mood and tempo,
                then let the Spirit and Silicon create together.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scripture Input */}
        <div className="glass rounded-[32px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
              The Word
            </label>
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[#C9A042] uppercase tracking-wider"
            >
              <BookMarked size={14} /> Presets
              {showPresets ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
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
                    className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase glass-gold hover:bg-[#C9A042]/20 transition-colors"
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
            placeholder="Paste your favorite bible verse here..."
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-[#FAFAFA] focus:outline-none focus:border-[#C9A042]/50 resize-none text-base leading-relaxed placeholder-slate-700 transition-all font-medium"
          />
        </div>

        {/* Mood & Tempo selector */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-[32px] p-6">
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500 block mb-4">
              Mood
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-[#FAFAFA] focus:outline-none"
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="glass rounded-[32px] p-6">
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500 block mb-4">
              Tempo
            </label>
            <select
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-[#FAFAFA] focus:outline-none"
            >
              {TEMPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate button */}
        <motion.button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-gold h-20 rounded-[28px] text-lg disabled:opacity-40"
        >
          <div className="flex items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Sparkles size={24} />
            )}
            <span className="font-serif">
              {loading
                ? PROGRESS_STEPS[currentStep]?.label || "Generating..."
                : "Ignite the Word"}
            </span>
          </div>
        </motion.button>

        {/* Progress indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-[24px] p-6"
            >
              <div className="space-y-3">
                {PROGRESS_STEPS.map((step, i) => (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      i <= currentStep ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        i < currentStep
                          ? "bg-[#C9A042]/20 text-[#C9A042]"
                          : i === currentStep
                            ? "bg-[#C9A042] text-[#09090B] animate-pulse"
                            : "bg-white/5 text-slate-600"
                      }`}
                    >
                      {i < currentStep ? "✓" : step.icon}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        i === currentStep
                          ? "text-[#FAFAFA]"
                          : i < currentStep
                            ? "text-[#C9A042]"
                            : "text-slate-600"
                      }`}
                    >
                      {step.label}
                    </span>
                    {i === currentStep && i > 0 && i < 3 && (
                      <Loader2
                        size={14}
                        className="animate-spin text-[#C9A042] ml-auto"
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-4 text-center">
                Suno AI generates high-quality songs — this typically takes
                60-120 seconds.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-[20px] p-4 border border-red-500/20"
          >
            <p className="text-red-400 text-xs font-bold text-center">
              {error}
            </p>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 mx-auto mt-3 text-[10px] text-[#C9A042] font-bold uppercase tracking-wider"
            >
              <RefreshCw size={12} /> Try Again
            </button>
          </motion.div>
        )}

        {/* Result Card */}
        <AnimatePresence>
          {lastGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-gold rounded-[40px] p-8 mt-6 flex flex-col items-center gap-6"
            >
              {/* Album art from Suno */}
              {lastGenerated.imageUrl && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-48 h-48 rounded-[28px] overflow-hidden shadow-2xl"
                >
                  <img
                    src={lastGenerated.imageUrl}
                    alt={lastGenerated.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              <div className="text-center">
                <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[6px] mb-2">
                  Song Ready
                </p>
                <h3 className="text-[#FAFAFA] text-xl font-serif">
                  {lastGenerated.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  {lastGenerated.artist}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  onClick={togglePlay}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center bg-[#C9A042]"
                >
                  {isPlaying && isCurrentGenerated ? (
                    <Pause size={32} fill="#09090B" />
                  ) : (
                    <Play size={32} fill="#09090B" className="ml-1" />
                  )}
                </motion.button>

                <motion.button
                  onClick={saveToProfile}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full glass flex items-center justify-center text-[#C9A042]"
                >
                  <CloudUpload size={20} />
                </motion.button>

                <motion.button
                  onClick={() => handlePublish(lastGenerated)}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full glass flex items-center justify-center text-[#C9A042]"
                >
                  <Globe size={20} />
                </motion.button>
              </div>

              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center">
                {status || "Private Draft Created"}
              </p>

              {/* Show generated lyrics */}
              {generatedLyrics && (
                <details className="w-full mt-2">
                  <summary className="text-[10px] text-[#C9A042] font-bold uppercase tracking-wider cursor-pointer text-center">
                    View Lyrics
                  </summary>
                  <pre className="mt-3 text-xs text-slate-400 whitespace-pre-wrap leading-relaxed bg-white/[0.02] rounded-2xl p-4 border border-white/5 max-h-60 overflow-y-auto">
                    {generatedLyrics}
                  </pre>
                </details>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
