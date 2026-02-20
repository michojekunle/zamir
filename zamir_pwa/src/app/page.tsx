"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/dashboard");
    } else {
      // Check if onboarding done
      const done =
        typeof window !== "undefined" &&
        localStorage.getItem("zamir_onboarded");
      router.replace(done ? "/auth" : "/onboarding");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#0F1B2E] flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl overflow-hidden animate-pulse">
        <img
          src="/zamir_icon.png"
          alt="Loading"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
