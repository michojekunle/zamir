"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Music,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useMusic } from "@/lib/MusicContext";

export default function AdminDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = useMusic();

  useEffect(() => {
    const q = query(
      collection(db, "moderation_queue"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQueue(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAction = async (item: any, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        // 1. Add to public tracks
        const { id, ...trackData } = item;
        await addDoc(collection(db, "public_tracks"), {
          ...trackData,
          status: "approved",
          hearts: 0,
          plays: 0,
          createdAt: serverTimestamp(),
        });
      }

      // 2. Remove from queue
      await deleteDoc(doc(db, "moderation_queue", item.id));

      alert(
        `Track ${action === "approve" ? "Approved & Published" : "Rejected"}`,
      );
    } catch (err) {
      console.error(err);
      alert("Failed to process action");
    }
  };

  return (
    <div className="min-h-screen pb-48 bg-[#09090B]">
      <div className="sticky top-0 z-20 px-6 pt-12 pb-6 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={20} className="text-[#C9A042]" />
          <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[4px]">
            Zamir Admin
          </p>
        </div>
        <h1 className="text-3xl font-serif text-[#FAFAFA]">Moderation</h1>
      </div>

      <div className="px-6 mt-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-30">
            <Music className="animate-bounce mb-4" />
            <p className="text-xs uppercase font-bold tracking-widest">
              Loading queue...
            </p>
          </div>
        ) : queue.length === 0 ? (
          <div className="flex flex-col items-center py-32 text-center opacity-30">
            <CheckCircle2 size={48} className="mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">
              Queue is Clear
            </p>
            <p className="text-xs mt-2">
              All submitted tracks have been reviewed.
            </p>
          </div>
        ) : (
          queue.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-[32px] p-6 border border-white/5"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#C9A042]/10 flex items-center justify-center text-2xl">
                    🎵
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#FAFAFA]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted by{" "}
                      <span className="text-[#C9A042] font-bold">
                        @{item.userName}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest">
                      {new Date(
                        item.createdAt?.seconds * 1000,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => playTrack(item)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${currentTrack?.id === item.id && isPlaying ? "bg-white text-[#09090B]" : "bg-[#C9A042] text-[#09090B]"}`}
                >
                  {currentTrack?.id === item.id && isPlaying ? (
                    <Pause size={24} fill="currentColor" />
                  ) : (
                    <Play size={24} fill="currentColor" className="ml-1" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction(item, "reject")}
                  className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button
                  onClick={() => handleAction(item, "approve")}
                  className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-white/5 text-slate-400 hover:bg-green-500/10 hover:text-green-400 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  <CheckCircle2 size={18} /> Approve & Publish
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
