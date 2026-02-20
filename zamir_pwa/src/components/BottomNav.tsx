"use client";

import { Home, Library, Settings, Disc3, BookOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Library, label: "Library", href: "/dashboard/library" },
  { isAction: true, label: "Create", href: "/dashboard/generate" },
  { icon: BookOpen, label: "Bible", href: "/dashboard/bible" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe max-w-md mx-auto">
      <div
        className="mx-3 mb-3 rounded-[28px] flex items-center justify-around h-[70px] px-2"
        style={{
          background: "rgba(15, 27, 46, 0.92)",
          border: "1px solid rgba(43, 59, 84, 0.9)",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 -4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,160,66,0.05)",
        }}
      >
        {navItems.map((item, i) => {
          if (item.isAction) {
            const isActive = pathname === item.href;
            return (
              <motion.button
                key="action"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => router.push(item.href)}
                className="w-14 h-14 -mt-8 rounded-full flex items-center justify-center shadow-2xl relative"
                style={{
                  background: "linear-gradient(135deg, #C9A042, #E6C57A)",
                  boxShadow:
                    "0 8px 24px rgba(201,160,66,0.5), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <Disc3
                  size={26}
                  className={`text-[#0F1B2E] ${isActive ? "animate-spin" : ""}`}
                  style={{ animationDuration: "4s" }}
                />
              </motion.button>
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon!;

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href!)}
              className="flex flex-col items-center justify-center gap-1 w-14 py-1"
            >
              <motion.div
                animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-colors duration-200 ${isActive ? "text-[#C9A042]" : "text-[#4B6080]"}`}
                />
              </motion.div>
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? "text-[#C9A042]" : "text-[#4B6080]"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
