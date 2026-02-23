"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isGuest } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !isGuest) router.replace("/auth");
  }, [user, isGuest, loading, router]);

  if (loading || (!user && !isGuest)) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <img
          src="/zamir_icon.png"
          alt="Zamir"
          className="w-16 h-16 rounded-2xl animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      {children}
      <BottomNav />
    </div>
  );
}
