"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share } from "lucide-react";

export default function PwaPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Handle the browser install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Timer for subtle appearance (15 seconds)
    const timer = setTimeout(() => {
      // Only show if not already installed
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setShow(true);
      }
    }, 15000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-4 right-4 z-[10000] flex justify-center pointer-events-none"
      >
        <div className="bg-[#18181B] border border-[#C9A042]/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 max-w-sm w-full pointer-events-auto backdrop-blur-xl bg-opacity-90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A042]/10 flex items-center justify-center text-[#C9A042] shrink-0">
              <Download size={20} />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[#C9A042] uppercase tracking-[2px]">
                Install Zamir
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Add to home screen for the full experience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isIOS ? (
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Share size={12} className="text-[#C9A042]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                  Share &gt; Add
                </span>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="bg-[#C9A042] text-[#09090B] px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider hover:scale-105 transition-transform"
              >
                Install
              </button>
            )}
            <button
              onClick={() => setShow(false)}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#FAFAFA]"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
