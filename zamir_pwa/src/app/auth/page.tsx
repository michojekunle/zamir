"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { user, isGuest, continueAsGuest, signInWithGoogle, loading } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if ((user || isGuest) && !loading) router.replace("/dashboard");
  }, [user, isGuest, loading, router]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0F1B2E] flex items-center justify-center">
        <img
          src="/zamir_icon.png"
          alt="Zamir"
          className="w-16 h-16 rounded-2xl animate-pulse"
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0F1B2E] flex flex-col items-center justify-center px-6 relative overflow-hidden max-w-md mx-auto">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C9A042] rounded-full blur-[140px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#1E3A8A] rounded-full blur-[100px] opacity-15 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <motion.img
            src="/zamir_icon.png"
            alt="Zamir Logo"
            className="w-24 h-24 rounded-[28px] mb-6"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
            style={{ boxShadow: "0 0 60px rgba(201,160,66,0.4)" }}
          />
          <h1 className="text-4xl font-serif text-gradient-gold mb-3">
            Welcome to Zamir
          </h1>
          <p className="text-slate-400 text-center text-base leading-relaxed max-w-xs">
            Your personal sanctuary where Scripture becomes sound.
          </p>
        </div>

        {/* Sign-in card */}
        <div className="glass rounded-[28px] p-6 space-y-4">
          <motion.button
            onClick={signInWithGoogle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-3 text-slate-600">
            <div className="flex-1 h-px bg-[#2B3B54]" />
            <span className="text-xs">or</span>
            <div className="flex-1 h-px bg-[#2B3B54]" />
          </div>

          <motion.button
            onClick={continueAsGuest}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full border border-[#C9A042]/40 text-[#F7F3EC] font-semibold py-4 px-6 rounded-2xl hover:bg-[#C9A042]/10 transition-all"
          >
            Browse Without Account
          </motion.button>
        </div>

        <p className="text-xs text-slate-600 text-center mt-6">
          By continuing, you agree to our Terms of Service.
          <br />
          <span className="text-[#C9A042]">Zamir — "Melody" in Hebrew</span>
        </p>
      </motion.div>
    </div>
  );
}
