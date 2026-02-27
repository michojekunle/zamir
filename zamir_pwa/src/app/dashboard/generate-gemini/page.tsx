"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Pause,
  Play,
  Download,
  BookMarked,
  Sparkles,
  CloudUpload,
  Globe,
  ChevronDown,
  ChevronUp,
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
    label: "Isaiah 53:5",
    text: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.",
  },
];

export default function GenerateGeminiPage() {
  const [text, setText] = useState(PRESETS[0].text);
  const [mood, setMood] = useState("Peaceful");
  const [tempo, setTempo] = useState("Slow");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<any>(null);

  const { playTrack, isPlaying, togglePlay, currentTrack } = useMusic();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setStatus("Gemini: Orchestrating Spirit...");

    try {
      // 1. Script Generation via Gemini
      const scriptRes = await fetch("/api/script-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mood, tempo }),
      });

      if (!scriptRes.ok) throw new Error("Gemini orchestration failed.");
      const { composition_plan } = await scriptRes.json();

      setStatus("Gemini: Synthesis Flowing...");

      // 2. Music Generation via Gemini-Proxy
      const res = await fetch("/api/generate-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ composition_plan }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gemini Studio is at capacity.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const track = {
        id: "gemini-" + Math.random().toString(36).substr(2, 9),
        title: text.slice(0, 30) + " (Gemini)",
        url: url,
        artist: "Zamir AI × Gemini",
        mood: mood,
        tempo: tempo,
      };

      setLastGenerated(track);
      playTrack(track);

      trackEvent("song_generated_gemini", { mood, tempo });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const saveToProfile = async () => {
    if (!auth.currentUser || !lastGenerated) return;
    try {
      setStatus("Saving Gemini Meditation...");
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

      setStatus("Saved!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError("Failed to save.");
    }
  };

  const isCurrentGenerated = currentTrack?.id === lastGenerated?.id;

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none bg-[#09090B]">
      <div className="sticky top-0 z-20 px-5 pt-12 pb-5 bg-[#09090B]/90 backdrop-blur-xl border-b border-[#C9A042]/20">
        <p className="text-[#C9A042] text-xs font-bold uppercase tracking-[4px] mb-1">
          Gemini Experimental Path
        </p>
        <h1 className="text-2xl font-serif text-[#FAFAFA]">Spirit & Silicon</h1>
      </div>

      <div className="px-5 space-y-6 max-w-2xl mx-auto pt-6">
        <div className="glass rounded-[24px] p-5 border border-[#C9A042]/10 bg-[#C9A042]/5">
          <p className="text-xs text-slate-400 leading-relaxed">
            This experimental route utilizes **Gemini 2.0 Flash Native Audio**.
            It generates a soulful, musical reading directly from the AI model's
            native multimodal output, providing a unique spiritual texture found
            nowhere else.
          </p>
        </div>

        <div className="glass rounded-[32px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
              The Word
            </label>
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[#C9A042]"
            >
              <BookMarked size={14} />{" "}
              {showPresets ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showPresets && (
              <div className="flex flex-wrap gap-2 pb-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setText(p.text);
                      setShowPresets(false);
                    }}
                    className="px-4 py-2 rounded-full text-[10px] font-bold glass-gold"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </AnimatePresence>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-[#FAFAFA] focus:outline-none focus:border-[#C9A042]/50 resize-none"
          />
        </div>

        <motion.button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full btn-gold h-20 rounded-[28px] text-lg bg-gradient-to-r from-[#C9A042] to-[#B8860B]"
        >
          <div className="flex items-center gap-3">
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Sparkles size={24} />
            )}
            <span className="font-serif">
              {loading ? status : "Gemini Ignite"}
            </span>
          </div>
        </motion.button>

        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        {lastGenerated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-gold rounded-[40px] p-8 flex flex-col items-center gap-6"
          >
            <h3 className="text-[#FAFAFA] text-xl font-serif">
              {lastGenerated.title}
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-[#C9A042] flex items-center justify-center"
              >
                {isPlaying && isCurrentGenerated ? (
                  <Pause fill="#09090B" />
                ) : (
                  <Play fill="#09090B" className="ml-1" />
                )}
              </button>
              <button
                onClick={saveToProfile}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-[#C9A042]"
              >
                <CloudUpload size={20} />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">
              {status || "Gemini Composition Complete"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
