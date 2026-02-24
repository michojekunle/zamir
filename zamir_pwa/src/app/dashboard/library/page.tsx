"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Disc3,
  Play,
  Heart,
  TrendingUp,
  Clock,
  User,
  Globe,
  Lock,
  Loader2,
  Trash2,
  Share2,
  Pause,
} from "lucide-react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useMusic } from "@/lib/MusicContext";

const TABS = ["My Music", "Public Library"];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function LibraryPage() {
  const [tab, setTab] = useState(0);
  const [myTracks, setMyTracks] = useState<any[]>([]);
  const [publicTracks, setPublicTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = useMusic();

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch User Library
    const q = query(
      collection(db, "users", auth.currentUser.uid, "library"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeMy = onSnapshot(q, (snapshot) => {
      setMyTracks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Fetch Public Library
    const pq = query(
      collection(db, "public_tracks"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(20),
    );
    const unsubscribePublic = onSnapshot(pq, (snapshot) => {
      setPublicTracks(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    });

    return () => {
      unsubscribeMy();
      unsubscribePublic();
    };
  }, []);

  const handlePublish = async (track: any) => {
    if (!auth.currentUser) return;
    try {
      // Add to moderation queue
      await addDoc(collection(db, "moderation_queue"), {
        ...track,
        originalId: track.id,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("Submitted for review!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (trackId: string) => {
    if (!auth.currentUser || !confirm("Delete this track?")) return;
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "library", trackId),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pb-48 overflow-y-auto scrollbar-none bg-[#09090B]">
      {/* Header */}
      <div className="sticky top-0 z-20 px-5 pt-12 pb-4 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[4px] mb-1">
              Your Collection
            </p>
            <h1 className="text-2xl font-serif text-[#FAFAFA]">Library</h1>
          </div>
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <User size={18} className="text-slate-500" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className="relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              style={{ color: tab === i ? "#09090B" : "#A1A1AA" }}
            >
              {tab === i && (
                <motion.div
                  layoutId="tabBg"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #C9A042, #E6D070)",
                  }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#C9A042]" size={32} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 0 ? (
              /* My Music */
              <motion.div
                key="mine"
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {myTracks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[32px] border-dashed border-white/10">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Disc3 size={32} className="text-slate-700" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      No tracks yet
                    </p>
                    <p className="text-slate-600 text-[10px] mt-2 max-w-[200px] leading-relaxed uppercase tracking-wider">
                      Create your first scripture song in the Studio
                    </p>
                  </div>
                ) : (
                  myTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onPlay={() => playTrack(track)}
                      onDelete={() => handleDelete(track.id)}
                      onPublish={() => handlePublish(track)}
                      isCurrent={currentTrack?.id === track.id}
                      playing={isPlaying && currentTrack?.id === track.id}
                      type="private"
                    />
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
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Globe size={14} className="text-[#C9A042]" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[3px]">
                    Global Harmonies
                  </span>
                </div>
                {publicTracks.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Coming Soon
                    </p>
                  </div>
                ) : (
                  publicTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onPlay={() => playTrack(track)}
                      isCurrent={currentTrack?.id === track.id}
                      playing={isPlaying && currentTrack?.id === track.id}
                      type="public"
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function TrackCard({
  track,
  onPlay,
  onDelete,
  onPublish,
  isCurrent,
  playing,
  type,
}: any) {
  return (
    <motion.div
      variants={item}
      className={`group glass rounded-[28px] overflow-hidden transition-all ${isCurrent ? "bg-white/[0.04] border-[#C9A042]/30" : "hover:bg-white/[0.02]"}`}
    >
      <div className="p-4 flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative ${isCurrent ? "bg-[#C9A042]/20" : "bg-white/5"}`}
        >
          <Disc3
            size={24}
            className={isCurrent ? "text-[#C9A042]" : "text-slate-700"}
          />
          {playing && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center items-end gap-[1px] h-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.2,
                  }}
                  className="w-[2px] bg-[#C9A042]"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold truncate ${isCurrent ? "text-[#C9A042]" : "text-[#FAFAFA]"}`}
          >
            {track.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Zamir AI
            </span>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <span className="text-[9px] font-medium text-slate-600">
              {track.tag || "Ambient"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {type === "private" && (
            <button
              onClick={onDelete}
              className="p-2 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onPlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isCurrent ? "bg-[#C9A042] text-[#09090B]" : "bg-white/5 text-[#FAFAFA] hover:bg-white/10"}`}
          >
            {playing ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {type === "private" && (
        <div className="px-4 py-2 bg-black/20 flex gap-4">
          <button
            onClick={onPublish}
            className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-[#C9A042]/70 hover:text-[#C9A042]"
          >
            <Globe size={10} /> Publish to Library
          </button>
          <button className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-400">
            <Share2 size={10} /> Share Link
          </button>
        </div>
      )}
    </motion.div>
  );
}
