"use client";

import { useAuth } from "@/lib/AuthContext";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  Moon,
  User,
  Headphones,
  Heart,
  Disc3,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const settingGroups = [
  {
    label: "Account",
    items: [
      { icon: User, label: "Edit Profile" },
      { icon: Bell, label: "Notifications" },
      { icon: Shield, label: "Privacy & Security" },
    ],
  },
  {
    label: "Preferences",
    items: [
      { icon: Headphones, label: "Audio Quality" },
      { icon: Moon, label: "Dark Theme", toggle: true },
    ],
  },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<any>(null);
  const firstName = user?.displayName?.split(" ")[0] ?? "Believer";

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      doc(db, "users", user.uid, "stats", "overview"),
      (doc) => {
        if (doc.exists()) {
          setUserStats(doc.data());
        }
      },
    );
    return () => unsub();
  }, [user]);

  const stats = [
    {
      icon: <Disc3 size={20} className="text-[#C9A042]" />,
      value: userStats?.songsGenerated || 0,
      label: "Sounds Created",
    },
    {
      icon: <Heart size={20} className="text-[#E6D070]" />,
      value: userStats?.totalLikesReceived || 0,
      label: "Total Likes",
    },
    {
      icon: <Headphones size={20} className="text-[#C9A042]" />,
      value: userStats?.totalPlays || 0,
      label: "Total Plays",
    },
  ];

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none bg-[#09090B]">
      {/* Header */}
      <div className="sticky top-0 z-20 px-5 pt-12 pb-5 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5">
        <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[4px] mb-1">
          Account
        </p>
        <h1 className="text-2xl font-serif text-[#FAFAFA]">Settings</h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[32px] p-8 border border-white/5"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] overflow-hidden border-2 border-[#C9A042]/30">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl font-serif text-[#C9A042]">
                    {firstName[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#10B981] border-[4px] border-[#0F1115]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#FAFAFA]">
                {user?.displayName ?? "Believer"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#C9A042]/10 text-[#C9A042] text-[10px] font-bold uppercase tracking-wider">
                  Founder Tier
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Zamir v1.0
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-white/5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="text-xl font-bold text-[#FAFAFA] font-serif">
                  {s.value > 999 ? (s.value / 1000).toFixed(1) + "k" : s.value}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings groups */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {settingGroups.map((group) => (
            <motion.div key={group.label} variants={item}>
              <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-slate-500 mb-4 px-2">
                {group.label}
              </h3>
              <div className="glass rounded-[32px] divide-y divide-white/5 overflow-hidden border border-white/5">
                {group.items.map(({ icon: Icon, label, toggle }: any) => (
                  <motion.div
                    key={label}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-[#C9A042]/10">
                      <Icon
                        size={18}
                        className="text-slate-500 group-hover:text-[#C9A042]"
                      />
                    </div>
                    <span className="flex-1 font-bold text-[#FAFAFA] text-sm">
                      {label}
                    </span>
                    {toggle ? (
                      <div className="w-12 h-6 rounded-full bg-[#C9A042] flex items-center px-1 justify-end">
                        <div className="w-4 h-4 rounded-full bg-white shadow-xl" />
                      </div>
                    ) : (
                      <ChevronRight size={16} className="text-slate-700" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sign out */}
        <motion.button
          onClick={async () => {
            await signOut();
            router.replace("/auth");
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-5 rounded-[28px] font-bold text-red-400 border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-all uppercase tracking-widest text-xs"
        >
          Sign Out of Zamir
        </motion.button>

        <p className="text-center text-[10px] text-slate-700 pb-12 uppercase tracking-widest font-bold">
          Made with ♡ for believers
        </p>
      </div>
    </div>
  );
}
