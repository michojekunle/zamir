"use client";

import { useAuth } from "@/lib/AuthContext";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Play,
  Heart,
  TrendingUp,
  Headphones,
  Disc3,
  Plus,
  Clock,
  Music,
  Zap,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useMusic } from "@/lib/MusicContext";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
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
  const { playTrack, currentTrack, isPlaying } = useMusic();

  const [featured, setFeatured] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const toggleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const trackRef = doc(db, "public_tracks", id);
    try {
      await updateDoc(trackRef, { hearts: increment(1) });
    } catch (e) {
      console.error(e);
    }
  };

  const firstName = user?.displayName?.split(" ")[0] ?? "Believer";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    // 1. Fetch Featured Tracks (Most Played Global)
    const featuredQuery = query(
      collection(db, "public_tracks"),
      where("status", "==", "approved"),
      orderBy("plays", "desc"),
      limit(5),
    );
    const unsubFeatured = onSnapshot(featuredQuery, (snap) => {
      setFeatured(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // 2. Fetch Trending Tracks (Most Liked Recent)
    const trendingQuery = query(
      collection(db, "public_tracks"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(10),
    );
    const unsubTrending = onSnapshot(trendingQuery, (snap) => {
      setTrending(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    // 3. Fetch User Stats
    if (user) {
      const unsubStats = onSnapshot(
        doc(db, "users", user.uid, "stats", "overview"),
        (doc) => {
          if (doc.exists()) {
            setUserStats(doc.data());
          }
        },
      );
      return () => {
        unsubFeatured();
        unsubTrending();
        unsubStats();
      };
    }

    return () => {
      unsubFeatured();
      unsubTrending();
    };
  }, [user]);

  const formatMin = (sec: number) => Math.floor((sec || 0) / 60);

  const gradients = [
    { from: "#C9A042", to: "#E6D070", tag: "Divine" },
    { from: "#1E3A8A", to: "#3B82F6", tag: "Peace" },
    { from: "#065F46", to: "#10B981", tag: "Glory" },
    { from: "#4C1D95", to: "#8B5CF6", tag: "Spirit" },
    { from: "#7C2D12", to: "#F59E0B", tag: "Earth" },
  ];

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none bg-[#09090B]">
      {/* Header */}
      <div className="sticky top-0 z-20 px-5 pt-12 pb-4 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[4px]">
              {greeting}
            </p>
            <h1 className="text-2xl font-serif text-[#FAFAFA] mt-1">
              {firstName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/dashboard/generate")}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#C9A042] to-[#E6D070] shadow-lg shadow-[#C9A042]/20"
            >
              <Plus size={20} className="text-[#09090B]" strokeWidth={3} />
            </motion.button>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/5"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-[#C9A042] font-bold">
                  {firstName[0]}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* User Stats Strip */}
        <div className="flex items-center gap-6 mt-6 px-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Listened
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock size={12} className="text-[#C9A042]" />
              <span className="text-sm font-bold text-[#FAFAFA]">
                {formatMin(userStats?.secondsListened)}m
              </span>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Created
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Music size={12} className="text-[#C9A042]" />
              <span className="text-sm font-bold text-[#FAFAFA]">
                {userStats?.songsGenerated || 0}
              </span>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Plays
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap size={12} className="text-[#C9A042]" />
              <span className="text-sm font-bold text-[#FAFAFA]">
                {userStats?.totalPlays || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-8 mt-6">
        {/* Featured carousel */}
        <motion.section variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="flex items-center justify-between mb-4 px-1"
          >
            <h2 className="text-lg font-bold text-[#FAFAFA]">
              Featured Harmonies
            </h2>
            <span className="text-[10px] font-bold text-[#C9A042] uppercase tracking-widest">
              Most Played
            </span>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 -mx-5 px-5">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 h-48 rounded-[32px] bg-white/5 animate-pulse"
                />
              ))
            ) : featured.length === 0 ? (
              <div className="flex-shrink-0 w-full p-12 glass rounded-[32px] text-center opacity-30">
                <p className="text-xs font-bold uppercase tracking-widest">
                  No featured tracks yet
                </p>
              </div>
            ) : (
              featured.map((track, i) => {
                const g = gradients[i % gradients.length];
                return (
                  <motion.div
                    key={track.id}
                    variants={item}
                    whileHover={{ y: -4 }}
                    onClick={() => playTrack(track)}
                    className="flex-shrink-0 w-64 rounded-[32px] p-6 relative overflow-hidden cursor-pointer border border-white/5 group"
                    style={{
                      background: `linear-gradient(135deg, ${g.from}22, ${g.to}05)`,
                    }}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-all">
                      <Play
                        size={24}
                        fill={g.from}
                        className="text-transparent"
                      />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[3px] mb-3 block"
                      style={{ color: g.from }}
                    >
                      {g.tag}
                    </span>
                    <h3 className="font-serif text-[#FAFAFA] text-lg font-bold mb-1 leading-snug truncate">
                      {track.title}
                    </h3>
                    <p className="text-slate-500 text-xs truncate mb-6">
                      @{track.userName || "Zamir"}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <Headphones size={12} /> {track.plays || 0} plays
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-slate-400 group-hover:bg-[#C9A042] group-hover:text-[#09090B] transition-all">
                        <Play
                          size={14}
                          fill="currentColor"
                          className="ml-0.5"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.section>

        {/* Quick create */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => router.push("/dashboard/generate")}
            className="w-full rounded-[32px] p-1 shadow-xl bg-gradient-to-r from-[#C9A042]/20 via-[#E6D070]/20 to-[#C9A042]/20"
          >
            <div className="bg-[#09090B] rounded-[31px] p-5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#C9A042] to-[#E6D070] shadow-lg shadow-[#C9A042]/20 shrink-0">
                  <Disc3 size={28} className="text-[#09090B]" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-[#FAFAFA] text-base">
                    Generate Song
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                    AI Melody Studio
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#C9A042]">
                <Plus size={20} />
              </div>
            </div>
          </button>
        </motion.section>

        {/* Trending public tracks */}
        <motion.section variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="flex items-center justify-between mb-4 px-1"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#C9A042]" />
              <h2 className="text-lg font-bold text-[#FAFAFA]">
                Global Trending
              </h2>
            </div>
            <button
              onClick={() => router.push("/dashboard/library")}
              className="text-[10px] font-bold text-[#C9A042] uppercase tracking-[2px]"
            >
              See Library
            </button>
          </motion.div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full h-16 rounded-2xl bg-white/5 animate-pulse"
                />
              ))
            ) : trending.length === 0 ? (
              <div className="py-20 text-center opacity-20">
                <p className="text-sm font-bold uppercase tracking-widest">
                  Quiet in the kingdom...
                </p>
              </div>
            ) : (
              trending.map((track) => (
                <motion.div
                  key={track.id}
                  variants={item}
                  whileHover={{ x: 4 }}
                  onClick={() => playTrack(track)}
                  className="glass rounded-[24px] p-4 flex items-center gap-4 cursor-pointer border border-white/5 hover:border-white/10"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 flex-shrink-0">
                    <Disc3 size={20} className="text-[#C9A042]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#FAFAFA] text-sm truncate">
                      {track.title}
                    </h4>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                      @{track.userName || "Unknown"} · {track.plays || 0} plays
                    </p>
                  </div>
                  <div
                    onClick={(e) => toggleLike(e, track.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#C9A042] pr-2 cursor-pointer z-10"
                  >
                    <Heart
                      size={14}
                      fill={track.hearts > 0 ? "#C9A042" : "none"}
                    />
                    {track.hearts || 0}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
