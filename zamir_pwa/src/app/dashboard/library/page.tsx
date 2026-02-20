"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Disc3, Play, Heart, TrendingUp, Clock, User } from "lucide-react";

const myTracks = [
  {
    id: 1,
    title: "Psalm 91 — Refuge",
    dur: "3:45",
    date: "Today",
    tag: "Meditation",
  },
  {
    id: 2,
    title: "John 14 — Peace I Give",
    dur: "5:20",
    date: "Yesterday",
    tag: "Worship",
  },
  {
    id: 3,
    title: "Proverbs 3 — Trust the Lord",
    dur: "4:08",
    date: "Feb 18",
    tag: "Wisdom",
  },
];

const publicTracks = [
  {
    id: 4,
    title: "Romans 15 — Hope & Harmony",
    user: "grace.sounds",
    hearts: 1043,
    plays: "5.2K",
    tag: "Hope",
  },
  {
    id: 5,
    title: "Revelation 22 — River of Life",
    user: "faithwaves",
    hearts: 789,
    plays: "3.8K",
    tag: "Devotional",
  },
  {
    id: 6,
    title: "Psalm 150 — Let Everything Praise",
    user: "zamirfan_99",
    hearts: 2211,
    plays: "11.9K",
    tag: "Praise",
  },
  {
    id: 7,
    title: "Isaiah 61 — Year of Favour",
    user: "son_of_promise",
    hearts: 1560,
    plays: "8.4K",
    tag: "Worship",
  },
  {
    id: 8,
    title: "Matthew 5 — The Beatitudes",
    user: "blessingsound",
    hearts: 903,
    plays: "4.1K",
    tag: "Reflection",
  },
];

const TABS = ["My Music", "Public Library"];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function LibraryPage() {
  const [tab, setTab] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);

  const toggle = (id: number) =>
    setLiked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const gradients = [
    "from-[#C9A042]/20 to-transparent",
    "from-[#1E3A8A]/20 to-transparent",
    "from-[#065F46]/20 to-transparent",
    "from-[#4C1D95]/20 to-transparent",
    "from-[#7C2D12]/20 to-transparent",
  ];

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none">
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-4"
        style={{
          background: "rgba(15,27,46,0.9)",
          backdropFilter: "blur(20px)",
        }}
      >
        <p className="text-[#C9A042] text-xs font-bold uppercase tracking-[3px] mb-1">
          Your Collection
        </p>
        <h1 className="text-2xl font-serif text-[#F7F3EC] mb-4">Library</h1>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className="relative px-5 py-2 rounded-full text-sm font-semibold transition-colors"
              style={{ color: tab === i ? "#0F1B2E" : "#4B6080" }}
            >
              {tab === i && (
                <motion.div
                  layoutId="tabBg"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #C9A042, #E6C57A)",
                  }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        {tab === 0 ? (
          /* My Music */
          <motion.div
            key="mine"
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {myTracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Disc3 size={48} className="text-[#2B3B54] mb-4" />
                <p className="text-slate-500 font-semibold">No tracks yet</p>
                <p className="text-slate-600 text-sm mt-1">
                  Create your first scripture melody
                </p>
              </div>
            ) : (
              myTracks.map((track, i) => (
                <motion.div key={track.id} variants={item}>
                  <div
                    className={`rounded-[22px] overflow-hidden bg-gradient-to-br ${gradients[i % gradients.length]}`}
                    style={{ border: "1px solid rgba(43,59,84,0.8)" }}
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #C9A042, #E6C57A)",
                          boxShadow: "0 4px 12px rgba(201,160,66,0.3)",
                        }}
                      >
                        <Disc3 size={22} className="text-[#0F1B2E]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#F7F3EC] text-base truncate">
                          {track.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[#C9A042] font-semibold bg-[#C9A042]/10 px-2 py-0.5 rounded-full">
                            {track.tag}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> {track.dur}
                          </span>
                          <span className="text-xs text-slate-600">
                            {track.date}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center glass"
                      >
                        <Play
                          size={16}
                          fill="#C9A042"
                          className="text-[#C9A042] ml-0.5"
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          /* Public Library */
          <motion.div
            key="public"
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <motion.div
              variants={item}
              className="flex items-center gap-2 mb-2"
            >
              <TrendingUp size={14} className="text-[#C9A042]" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Global Community
              </span>
            </motion.div>
            {publicTracks.map((track, i) => (
              <motion.div key={track.id} variants={item} whileHover={{ x: 3 }}>
                <div className="glass rounded-[22px] p-4 flex items-center gap-4 cursor-pointer">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${gradients[i % gradients.length]}`}
                    style={{ border: "1px solid rgba(43,59,84,0.6)" }}
                  >
                    <Disc3 size={18} className="text-[#C9A042]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#F7F3EC] text-sm truncate">
                      {track.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={10} className="text-slate-500" />
                      <span className="text-xs text-slate-500">
                        @{track.user}
                      </span>
                      <span className="text-xs text-slate-600 ml-1">
                        {track.plays} plays
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <motion.button
                      onClick={() => toggle(track.id)}
                      whileTap={{ scale: 0.8 }}
                      className="flex items-center gap-1 text-xs font-bold"
                      style={{
                        color: liked.includes(track.id) ? "#C9A042" : "#4B6080",
                      }}
                    >
                      <Heart
                        size={14}
                        fill={liked.includes(track.id) ? "#C9A042" : "none"}
                      />
                      {track.hearts + (liked.includes(track.id) ? 1 : 0)}
                    </motion.button>
                    <span className="text-[10px] px-2 py-0.5 rounded-full glass-gold text-[#E6C57A]">
                      {track.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
