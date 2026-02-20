"use client";

import { useAuth } from "@/lib/AuthContext";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { Play, Heart, TrendingUp, Headphones, Disc3, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const featured = [
  {
    id: 1,
    title: "Psalms 23 — Still Waters",
    tag: "Meditation",
    dur: "4:12",
    plays: "12.4K",
    gradient: "from-[#C9A042]/30 to-[#E6C57A]/10",
    accent: "#C9A042",
    verse: '"He leads me beside still waters..."',
  },
  {
    id: 2,
    title: "Proverbs — Wisdom Flows",
    tag: "Focus",
    dur: "6:08",
    plays: "8.9K",
    gradient: "from-[#1E3A8A]/30 to-[#3B82F6]/10",
    accent: "#3B82F6",
    verse: '"The fear of the Lord is the beginning of wisdom."',
  },
  {
    id: 3,
    title: "Isaiah — New Thing",
    tag: "Worship",
    dur: "5:33",
    plays: "21.2K",
    gradient: "from-[#065F46]/30 to-[#10B981]/10",
    accent: "#10B981",
    verse: '"Behold, I am doing a new thing..."',
  },
];

const publicTracks = [
  {
    id: 1,
    title: "John 3:16 — Love Eternal",
    user: "grace.mel",
    hearts: 847,
    tag: "Devotional",
  },
  {
    id: 2,
    title: "Romans 8 — No Condemnation",
    user: "david_w",
    hearts: 1204,
    tag: "Peace",
  },
  {
    id: 3,
    title: "Ephesians 6 — Full Armour",
    user: "faith.sound",
    hearts: 632,
    tag: "Strength",
  },
  {
    id: 4,
    title: "Philippians 4 — All Things",
    user: "hope_sings",
    hearts: 991,
    tag: "Joy",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function DashboardHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) =>
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const firstName = user?.displayName?.split(" ")[0] ?? "Believer";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none">
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-4"
        style={{
          background: "rgba(15,27,46,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A042] text-xs font-bold uppercase tracking-[3px]">
              {greeting}
            </p>
            <h1 className="text-2xl font-serif text-[#F7F3EC] mt-0.5">
              {firstName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/dashboard/generate")}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #C9A042, #E6C57A)",
                boxShadow: "0 4px 12px rgba(201,160,66,0.4)",
              }}
            >
              <Plus size={20} className="text-[#0F1B2E]" strokeWidth={3} />
            </motion.button>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#2B3B54]"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#1A263C] flex items-center justify-center text-[#C9A042] font-bold text-lg">
                  {firstName[0]}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-8">
        {/* Featured carousel */}
        <motion.section variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="flex items-center justify-between mb-4"
          >
            <h2 className="text-lg font-bold text-[#F7F3EC]">Featured</h2>
            <span className="text-xs text-[#C9A042] font-semibold">
              See all
            </span>
          </motion.div>
          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-5 px-5">
            {featured.map((track) => (
              <motion.div
                key={track.id}
                variants={item}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 w-64 rounded-[24px] p-5 relative overflow-hidden cursor-pointer select-none"
                style={{
                  background: `linear-gradient(135deg, ${track.gradient.replace("from-", "").replace("/", "").split(" ")[0].slice(1, -3)}, ${track.gradient.replace("to-", "").replace("/", "").split(" ")[1]?.slice(1, -3) ?? "#1A263C"})`,
                  border: "1px solid rgba(43,59,84,0.8)",
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${track.gradient} pointer-events-none`}
                  style={{
                    background: `linear-gradient(135deg, ${track.accent}22, transparent)`,
                  }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-[2px] mb-4 block"
                  style={{ color: track.accent }}
                >
                  {track.tag}
                </span>
                <h3 className="font-serif text-[#F7F3EC] text-lg font-bold mb-2 leading-snug">
                  {track.title}
                </h3>
                <p className="text-slate-400 text-xs italic mb-6 line-clamp-2">
                  {track.verse}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Headphones size={12} /> {track.plays}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `${track.accent}22`,
                      border: `1px solid ${track.accent}44`,
                    }}
                  >
                    <Play
                      size={16}
                      fill={track.accent}
                      className="ml-0.5"
                      style={{ color: track.accent }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick create */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => router.push("/dashboard/generate")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-[24px] p-5 flex items-center gap-4 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,160,66,0.15), rgba(230,197,122,0.05))",
              border: "1px solid rgba(201,160,66,0.3)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #C9A042, #E6C57A)",
                boxShadow: "0 8px 20px rgba(201,160,66,0.35)",
              }}
            >
              <Disc3 size={28} className="text-[#0F1B2E]" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-[#F7F3EC] text-base">
                Create New Sound
              </h3>
              <p className="text-slate-400 text-sm mt-0.5">
                Type any scripture · AI generates your melody
              </p>
            </div>
          </motion.button>
        </motion.section>

        {/* Trending public tracks */}
        <motion.section variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#C9A042]" />
              <h2 className="text-lg font-bold text-[#F7F3EC]">Trending</h2>
            </div>
            <span
              className="text-xs text-[#C9A042] font-semibold"
              onClick={() => router.push("/dashboard/library")}
            >
              See all
            </span>
          </motion.div>

          <div className="space-y-3">
            {publicTracks.map((track) => (
              <motion.div
                key={track.id}
                variants={item}
                whileHover={{ x: 4 }}
                className="glass rounded-[20px] p-4 flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#C9A042]/10 flex-shrink-0">
                  <Disc3 size={20} className="text-[#C9A042]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#F7F3EC] text-sm truncate">
                    {track.title}
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    @{track.user} · {track.tag}
                  </p>
                </div>
                <motion.button
                  onClick={() => toggleLike(track.id)}
                  whileTap={{ scale: 0.8 }}
                  className="flex items-center gap-1.5 text-xs font-semibold ml-2"
                  style={{
                    color: liked.includes(track.id) ? "#C9A042" : "#4B6080",
                  }}
                >
                  <Heart
                    size={16}
                    fill={liked.includes(track.id) ? "#C9A042" : "none"}
                  />
                  {track.hearts + (liked.includes(track.id) ? 1 : 0)}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
