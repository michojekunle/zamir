"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Disc3, BookOpen, Sparkles, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: <BookOpen size={56} className="text-[#C9A042]" />,
    tag: "The Word",
    title: "Scripture Brought\nto Life",
    desc: "Zamir transforms Bible verses into immersive ambient soundscapes — a new dimension of experiencing God's Word.",
    gradient: "from-[#C9A042]/20 to-transparent",
    blob: "#C9A042",
  },
  {
    icon: <Disc3 size={56} className="text-[#E6C57A]" />,
    tag: "AI Generation",
    title: "Your Faith,\nYour Melody",
    desc: "Type any scripture or prayer and our AI instantly weaves it into meditative music crafted for your soul.",
    gradient: "from-[#1E3A8A]/30 to-transparent",
    blob: "#3B82F6",
  },
  {
    icon: <Sparkles size={56} className="text-[#E6C57A]" />,
    tag: "Community",
    title: "Worship\nTogether",
    desc: "Discover sound creations from believers worldwide. Save, share, and be uplifted by the global chorus of faith.",
    gradient: "from-[#065F46]/30 to-transparent",
    blob: "#10B981",
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const router = useRouter();

  const advance = () => {
    if (step < slides.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
    } else {
      localStorage.setItem("zamir_onboarded", "1");
      router.push("/auth");
    }
  };

  const skip = () => {
    localStorage.setItem("zamir_onboarded", "1");
    router.push("/auth");
  };

  const slide = slides[step];

  return (
    <div className="min-h-screen bg-[#0F1B2E] flex flex-col items-center justify-between px-6 py-12 overflow-hidden select-none max-w-md mx-auto relative">
      {/* Background blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: slide.blob }}
      />

      {/* Skip */}
      <div className="w-full flex justify-end z-10">
        <button
          onClick={skip}
          className="text-sm text-[#C9A042] font-semibold px-4 py-2 rounded-full glass-gold"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center w-full"
          >
            {/* Icon card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className={`w-32 h-32 rounded-[32px] flex items-center justify-center mb-10 glass bg-gradient-to-br ${slide.gradient}`}
              style={{ boxShadow: `0 20px 60px ${slide.blob}33` }}
            >
              {slide.icon}
            </motion.div>

            <span className="text-[#C9A042] text-xs font-bold uppercase tracking-[3px] mb-4">
              {slide.tag}
            </span>

            <h1 className="text-[#F7F3EC] text-4xl leading-tight font-serif mb-5 whitespace-pre-line">
              {slide.title}
            </h1>

            <p className="text-slate-400 text-base leading-relaxed max-w-xs">
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="w-full flex flex-col items-center gap-6 z-10">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 24 : 8,
                opacity: i === step ? 1 : 0.35,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-2 rounded-full bg-[#C9A042]"
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={advance}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="w-full btn-gold text-lg"
          style={{ borderRadius: 20, padding: "18px" }}
        >
          {step < slides.length - 1 ? (
            <>
              Continue <ChevronRight size={20} />
            </>
          ) : (
            <>
              Get Started <ChevronRight size={20} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
