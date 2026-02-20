"use client";

import { useAuth } from "@/lib/AuthContext";
import { motion, type Variants } from "framer-motion";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

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

const stats = [
  {
    icon: <Disc3 size={20} className="text-[#C9A042]" />,
    value: "24",
    label: "Sounds Created",
  },
  {
    icon: <Heart size={20} className="text-[#E6C57A]" />,
    value: "1.2K",
    label: "Total Likes",
  },
  {
    icon: <Headphones size={20} className="text-[#C9A042]" />,
    value: "8.4K",
    label: "Total Plays",
  },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const firstName = user?.displayName?.split(" ")[0] ?? "Believer";

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
          Account
        </p>
        <h1 className="text-2xl font-serif text-[#F7F3EC]">Settings</h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[28px] p-6"
          style={{ border: "1px solid rgba(201,160,66,0.2)" }}
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-[22px] overflow-hidden border-2 border-[#C9A042]/50">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A263C] flex items-center justify-center text-3xl font-serif text-[#C9A042]">
                    {firstName[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#10B981] border-2 border-[#0F1B2E]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F7F3EC]">
                {user?.displayName ?? "Believer"}
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full glass-gold text-[#C9A042] font-semibold">
                Free Plan
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#2B3B54]">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                {s.icon}
                <span className="text-xl font-bold text-[#F7F3EC] font-serif">
                  {s.value}
                </span>
                <span className="text-[10px] text-slate-500 text-center">
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
          className="space-y-5"
        >
          {settingGroups.map((group) => (
            <motion.div key={group.label} variants={item}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">
                {group.label}
              </h3>
              <div className="glass rounded-[24px] divide-y divide-[#2B3B54]/50 overflow-hidden">
                {group.items.map(({ icon: Icon, label, toggle }) => (
                  <motion.div
                    key={label}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#1A263C]/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#C9A042]/10 flex items-center justify-center">
                      <Icon size={18} className="text-[#C9A042]" />
                    </div>
                    <span className="flex-1 font-semibold text-[#F7F3EC] text-sm">
                      {label}
                    </span>
                    {toggle ? (
                      <div className="w-12 h-6 rounded-full bg-[#C9A042] flex items-center px-1 justify-end">
                        <div className="w-5 h-5 rounded-full bg-white shadow" />
                      </div>
                    ) : (
                      <ChevronRight size={16} className="text-[#2B3B54]" />
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>

        <p className="text-center text-[10px] text-slate-700 pb-2">
          Zamir v1.0 · "Melody" in Hebrew · Made with ♡ for believers
        </p>
      </div>
    </div>
  );
}
