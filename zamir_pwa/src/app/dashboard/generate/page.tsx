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
  Music,
  Sparkles,
  CloudUpload,
  Globe,
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

import { useSearchParams } from "next/navigation";

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("text") || PRESETS[0].text);
  const [voice, setVoice] = useState("");
  const [mood, setMood] = useState("Peaceful");
  const [tempo, setTempo] = useState("Slow");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [status, setStatus] = useState("");
  const [lastGenerated, setLastGenerated] = useState<any>(null);

  const { playTrack, isPlaying, togglePlay, currentTrack } = useMusic();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setStatus("Designing Composition Plan...");

    try {
      // 1. Script Generation (Now returns { composition_plan })
      const scriptRes = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mood, tempo }),
      });

      if (!scriptRes.ok) throw new Error("Divine orchestration failed.");
      const { composition_plan } = await scriptRes.json();

      setStatus("Architecting the Soundscape...");

      // 2. Music Generation (Authentic ElevenLabs Music)
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ composition_plan }),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 402) {
          throw new Error(errData.detail || "Premium Subscription Required");
        }
        throw new Error(
          errData.error ||
            "The Divine Studio is at capacity. Try again shortly.",
        );
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const isAmbient = res.headers.get("X-Zamir-Type") === "ambient-reading";

      const track = {
        id: Math.random().toString(36).substr(2, 9),
        title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
        url: url,
        artist: isAmbient ? "Zamir AI (Ambient)" : "Zamir AI",
        mood: mood,
        tempo: tempo,
      };

      setLastGenerated(track);
      playTrack(track);

      // Log stats
      incrementGlobalStat("totalSongs");
      if (auth.currentUser) {
        incrementUserStat(auth.currentUser.uid, "songsGenerated");
      }
      trackEvent("song_generated", { mood, tempo });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const saveToProfile = async () => {
    if (!auth.currentUser || !lastGenerated) {
      if (!auth.currentUser) setError("You must be logged in to save.");
      return;
    }
    try {
      setStatus("Uploading to cloud...");

      // 1. Fetch the blob from the object URL
      const response = await fetch(lastGenerated.url);
      const blob = await response.blob();

      // 2. Upload to Firebase Storage
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/library/${lastGenerated.id}.mp3`,
      );
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      // 3. Save metadata to Firestore
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
        <p className="text-[#C9A042] text-xs font-bold uppercase tracking-[4px] mb-1">
          Divine Studio
        </p>
        <h1 className="text-2xl font-serif text-[#FAFAFA]">
          Scripture into Sound
        </h1>
      </div>

      <div className="px-5 space-y-6 relative max-w-2xl mx-auto pt-6">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C9A042] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[24px] p-5 border border-[#C9A042]/10"
        >
          <div className="flex items-start gap-4 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-[#C9A042]/10 flex items-center justify-center shrink-0 text-[#C9A042]">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FAFAFA] mb-1">
                Vocal & Melody Synthesis
              </h3>
              <p className="text-xs leading-relaxed">
                Zamir is evolving. We are currently integrating full
                instrumentation and melodic vocals to turn scripture into the
                songs of your soul.
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
              {["Peaceful", "Joyful", "Intense", "Reflective", "Calm"].map(
                (m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ),
              )}
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
              {["Slow", "Moderate", "Fast"].map((t) => (
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
              {loading ? status : "Ignite the Word"}
            </span>
          </div>
        </motion.button>

        {error && (
          <p className="text-red-400 text-xs font-bold text-center">{error}</p>
        )}

        {/* Result Card */}
        <AnimatePresence>
          {lastGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-gold rounded-[40px] p-8 mt-12 flex flex-col items-center gap-6"
            >
              <div className="text-center">
                <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[6px] mb-2">
                  Meditation Ready
                </p>
                <h3 className="text-[#FAFAFA] text-xl font-serif">
                  {lastGenerated.title}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  onClick={togglePlay}
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
                  className="w-14 h-14 rounded-full glass flex items-center justify-center text-[#C9A042]"
                >
                  <CloudUpload size={20} />
                </motion.button>

                <motion.button
                  onClick={() => handlePublish(lastGenerated)}
                  className="w-14 h-14 rounded-full glass flex items-center justify-center text-[#C9A042]"
                >
                  <Globe size={20} />
                </motion.button>
              </div>

              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center">
                {status || "Private Draft Created"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
