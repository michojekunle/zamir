import { useEffect, useRef, useState, useCallback } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingVideo } from "./remotion/MarketingVideo";
import {
  Play,
  Download,
  ChevronDown,
  Music,
  Radio,
  Headphones,
  Star,
  Globe,
  Zap,
  ArrowRight,
  Volume2,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const DURATION_FRAMES = 510;
const FPS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let raf: number;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, target, duration]);
  return value;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Animated Background ──────────────────────────────────────────────────────

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#0F1B2E" }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,160,66,0.12) 0%, transparent 70%)",
        }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(230,197,122,0.1) 0%, transparent 70%)",
        }}
        animate={{ x: [-20, 20, -20], y: [20, -20, 20] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(247,243,236,0.08) 0%, transparent 70%)",
        }}
        animate={{ x: [20, -20, 20] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,160,66,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,160,66,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

// ─── Animated Waveform ────────────────────────────────────────────────────────

function AnimatedWaveform({ active = true }: { active?: boolean }) {
  const bars = 40;
  return (
    <div className="flex items-center gap-[3px] h-12">
      {Array.from({ length: bars }, (_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: "linear-gradient(to top, #C9A042, #E6C57A)",
            minHeight: 4,
          }}
          animate={
            active
              ? {
                  height: [
                    `${8 + Math.sin(i * 0.8) * 20 + 10}px`,
                    `${8 + Math.sin(i * 0.8 + 1.5) * 28 + 10}px`,
                    `${8 + Math.sin(i * 0.8 + 3) * 16 + 10}px`,
                    `${8 + Math.sin(i * 0.8) * 20 + 10}px`,
                  ],
                }
              : { height: "4px" }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.04,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}
      style={{
        borderBottom: scrolled
          ? "1px solid rgba(201,160,66,0.15)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        backgroundColor: scrolled ? "rgba(2,4,8,0.85)" : "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/zamir_icon.png"
            alt="Zamir Logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: "20%",
              boxShadow: "0 0 20px rgba(201,160,66,0.3)",
            }}
          />
          <span className="text-white text-xl font-bold tracking-wide">
            Zamir
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Listen", "Download", "About"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-slate-400 hover:text-white transition-colors text-sm tracking-wide"
            >
              {link}
            </a>
          ))}
        </div>

        <motion.a
          href="#download"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(201,160,66,0.5)",
          }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 rounded-full text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #C9A042, #E6C57A)" }}
        >
          Download Free
        </motion.a>
      </div>
    </motion.nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="features"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16"
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-8"
          style={{
            borderColor: "rgba(201,160,66,0.4)",
            background: "rgba(201,160,66,0.08)",
            color: "#E6C57A",
          }}
        >
          <Zap size={14} />
          Now available on iOS, Android &amp; Web
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-black leading-none mb-6"
          style={{
            fontSize: "clamp(72px, 12vw, 144px)",
            fontFamily: "Fraunces, serif",
            background:
              "linear-gradient(135deg, #ffffff 30%, #E6C57A 60%, #F7F3EC 90%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-3px",
          }}
        >
          ZAMIR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-slate-300 mb-4 font-light"
          style={{
            fontSize: "clamp(16px, 2vw, 28px)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Scripture. Melody. Transformation.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ fontSize: "clamp(14px, 1.4vw, 20px)" }}
        >
          Experience the Word of God as you've never heard it before. Bible
          scriptures transformed into ambient melodies for deep meditation,
          worship, and understanding.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="#download"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 60px rgba(201,160,66,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-8 py-4 rounded-full text-[#0F1B2E] font-bold text-lg"
            style={{ background: "linear-gradient(135deg, #C9A042, #E6C57A)" }}
          >
            <svg viewBox="0 0 384 512" width="20" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 84.4-80 102.7-133-31.5-12.8-56.9-35.8-57.9-77zM296 68.3c15.7-19.6 28.3-48 24.3-76.3-24.3 2.1-55.7 17.4-74.1 39-16.7 19.3-30.8 47.9-24.4 75.7 26.6 2.3 54.2-16.1 74.2-38.4z" />
            </svg>
            Download App
          </motion.a>
          <motion.a
            href="#video"
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg border"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <Play size={20} />
            Watch the Story
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex justify-center"
        >
          <AnimatedWaveform />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Video Section ────────────────────────────────────────────────────────────

function VideoSection() {
  const playerRef = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const { ref, inView } = useInView(0.3);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pause();
      setPlaying(false);
    } else {
      playerRef.current.play();
      setPlaying(true);
    }
  }, [playing]);

  return (
    <section id="video" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-blue-400 text-sm font-mono tracking-widest uppercase mb-3">
            Marketing Film
          </p>
          <h2
            className="text-white mb-4 font-black"
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontFamily: "Fraunces, serif",
            }}
          >
            The Zamir Story
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A cinematic journey through scripture, faith, and worship.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(201,160,66,0.25)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(201,160,66,0.1)",
          }}
        >
          <Player
            ref={playerRef}
            component={MarketingVideo}
            durationInFrames={DURATION_FRAMES}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={FPS}
            style={{ width: "100%", aspectRatio: "16/9", display: "block" }}
            controls
            loop
            clickToPlay
          />
        </motion.div>

        {/* Render instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Download size={14} className="text-blue-400" />
            <span>
              Export as MP4:{" "}
              <code className="text-blue-300 bg-slate-900/80 px-2 py-0.5 rounded font-mono">
                npm run render
              </code>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Zap size={14} className="text-purple-400" />
            <span>
              Open Studio:{" "}
              <code className="text-purple-300 bg-slate-900/80 px-2 py-0.5 rounded font-mono">
                npm run studio
              </code>
            </span>
          </div>
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
            style={{
              background: playing
                ? "rgba(201,160,66,0.2)"
                : "rgba(201,160,66,0.2)",
              border: "1px solid rgba(201,160,66,0.4)",
            }}
          >
            {playing ? (
              "⏸ Pause"
            ) : (
              <>
                <Play size={14} /> Play
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────

const features = [
  {
    icon: <Music size={28} />,
    title: "AI Music Generation",
    color: "#E6C57A",
    desc: "Personalized scriptural soundscapes created by AI, tuned to your studying or worship mood.",
  },
  {
    icon: <Radio size={28} />,
    title: "Live Worship Radio",
    color: "#C9A042",
    desc: "24/7 live Christian radio streams — worship, scripture reading, and ambient praise.",
  },
  {
    icon: <Headphones size={28} />,
    title: "Guided Meditation",
    color: "#E6C57A",
    desc: "Step-by-step audio guides for prayer and mindfulness rooted in Biblical truth.",
  },
  {
    icon: <Globe size={28} />,
    title: "Original Languages",
    color: "#C9A042",
    desc: "Listen to scriptures in English, as well as original Hebrew and Greek pronunciations.",
  },
  {
    icon: <Star size={28} />,
    title: "Theologically Sound",
    color: "#E6C57A",
    desc: "Every track reviewed and endorsed by qualified theologians and worship leaders.",
  },
  {
    icon: <Zap size={28} />,
    title: "Offline Mode",
    color: "#C9A042",
    desc: "Download your favourite verses and playlists to listen without an internet connection.",
  },
];

function FeaturesSection() {
  const { ref, inView } = useInView(0.15);

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-sm font-mono tracking-widest uppercase mb-3">
            What&apos;s Inside
          </p>
          <h2
            className="text-white mb-4 font-black"
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontFamily: "Fraunces, serif",
            }}
          >
            The Word in Harmony
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Every feature crafted with mindfulness, community, and the living
            Word of God at its core.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${feature.color}18`,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Audio Demo Section ───────────────────────────────────────────────────────

const audioTracks = [
  {
    id: 1,
    title: "Psalms 23 Serenity",
    artist: "Zamir Originals",
    duration: "4:12",
    genre: "Praise",
    icon: "🌅",
    color: "#E6C57A",
    desc: "Gentle melodics to begin your day with intention and clarity.",
  },
  {
    id: 2,
    title: "Proverbs of Wisdom",
    artist: "Masha Allah Studio",
    duration: "8:45",
    genre: "Study",
    icon: "📖",
    color: "#C9A042",
    desc: "Calming scripture readings layered with ambient sounds for deep focus.",
  },
  {
    id: 3,
    title: "Isaiah Prophecies",
    artist: "Zamir AI Suite",
    duration: "5:30",
    genre: " Evening Worship",
    icon: "🌙",
    color: "#E6C57A",
    desc: "AI-composed ambient piece inspired by the stillness of evening worship.",
  },
  {
    id: 4,
    title: "Gospel Rhythms",
    artist: "Zamir Worship Studio",
    duration: "6:18",
    genre: "Praise",
    icon: "📿",
    color: "#06b6d4",
    desc: "Rhythmic worship instrumentals over soft percussion.",
  },
];

type AudioTrack = (typeof audioTracks)[number];

function AudioCard({
  track,
  isPlaying,
  onToggle,
}: {
  track: AudioTrack;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onToggle}
      className="cursor-pointer rounded-2xl p-5 transition-all duration-300"
      style={{
        background: isPlaying
          ? `linear-gradient(135deg, ${track.color}18, ${track.color}08)`
          : "rgba(255,255,255,0.03)",
        border: isPlaying
          ? `1px solid ${track.color}55`
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0 w-14 h-14">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${track.color}22` }}
          >
            {track.icon}
          </div>
          <motion.div
            className="absolute inset-0 rounded-xl flex items-center justify-center text-white"
            style={{ background: isPlaying ? track.color : "rgba(0,0,0,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 1 : 0 }}
            whileHover={{ opacity: 1 }}
          >
            {isPlaying ? (
              <span className="text-lg">⏸</span>
            ) : (
              <Play size={16} fill="white" />
            )}
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-white font-semibold text-base truncate">
              {track.title}
            </span>
            {isPlaying && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${track.color}33`, color: track.color }}
              >
                Playing
              </span>
            )}
          </div>
          <div className="text-slate-400 text-sm mb-1">{track.artist}</div>
          <div className="text-slate-500 text-xs truncate">{track.desc}</div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-slate-400 font-mono text-sm">
            {track.duration}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            {track.genre}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 overflow-hidden"
          >
            <AnimatedWaveform active />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AudioSection() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const { ref, inView } = useInView(0.2);

  return (
    <section id="listen" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-blue-400 text-sm font-mono tracking-widest uppercase mb-3">
            Audio Experience
          </p>
          <h2
            className="text-white mb-4 font-black"
            style={{
              fontSize: "clamp(28px, 4vw, 56px)",
              fontFamily: "Fraunces, serif",
            }}
          >
            Listen to the Demo
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A taste of what&apos;s inside Zamir — click any track to preview.
          </p>
        </motion.div>

        <div className="space-y-4">
          {audioTracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <AudioCard
                track={track}
                isPlaying={playingId === track.id}
                onToggle={() =>
                  setPlayingId(playingId === track.id ? null : track.id)
                }
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2"
        >
          <Volume2 size={14} />
          <span>Preview only — full tracks available in the app.</span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Section ────────────────────────────────────────────────────────────
// Each stat is its own component so useCountUp is always called at component level

function StatCard({
  value,
  suffix,
  label,
  icon,
  inView,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: string;
  inView: boolean;
  delay: number;
}) {
  const counted = useCountUp(value, inView, 2000);
  const display =
    value < 10 ? (inView ? value.toFixed(1) : "0.0") : counted.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center py-8 px-6 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div
        className="font-black mb-2"
        style={{
          fontSize: "clamp(36px, 4vw, 56px)",
          fontFamily: "Fraunces, serif",
          background: "linear-gradient(135deg, #E6C57A, #C9A042)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {display}
        {suffix}
      </div>
      <div className="text-slate-400 font-medium">{label}</div>
    </motion.div>
  );
}

const statsData = [
  { value: 50000, suffix: "+", label: "Active Listeners", icon: "👥" },
  { value: 1200, suffix: "+", label: "Curated Tracks", icon: "🎵" },
  { value: 40, suffix: "+", label: "Languages", icon: "🌍" },
];

function StatsSection() {
  const { ref, inView } = useInView(0.3);
  return (
    <section className="py-16 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, i) => (
            <StatCard
              key={stat.label}
              {...stat}
              inView={inView}
              delay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Download CTA ─────────────────────────────────────────────────────────────

function DownloadSection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section id="download" className="py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-16 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,160,66,0.15), rgba(230,197,122,0.15))",
            border: "1px solid rgba(201,160,66,0.3)",
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(201,160,66,0.2) 0%, transparent 60%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <h2
              className="font-black mb-6 leading-none text-white"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                fontFamily: "Fraunces, serif",
              }}
            >
              Begin Your
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #E6C57A, #F7F3EC)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Journey Today
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-xl mx-auto leading-relaxed">
              Join 50,000+ believers experiencing the Word through sound. Free
              forever for the core experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
              {[
                {
                  label: "App Store",
                  icon: (
                    <svg viewBox="0 0 384 512" width="20" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 84.4-80 102.7-133-31.5-12.8-56.9-35.8-57.9-77zM296 68.3c15.7-19.6 28.3-48 24.3-76.3-24.3 2.1-55.7 17.4-74.1 39-16.7 19.3-30.8 47.9-24.4 75.7 26.6 2.3 54.2-16.1 74.2-38.4z" />
                    </svg>
                  ),
                  gradient: "linear-gradient(135deg, #C9A042, #E6C57A)",
                  textColor: "#0F1B2E",
                },
                {
                  label: "Google Play",
                  icon: (
                    <svg viewBox="0 0 512 512" width="20" fill="currentColor">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                    </svg>
                  ),
                  gradient: "linear-gradient(135deg, #C9A042, #C9A042)",
                  textColor: "#0F1B2E",
                },
                {
                  label: "Launch Web App",
                  icon: <ArrowRight size={20} />,
                  gradient: "none",
                  border: "1px solid rgba(255,255,255,0.25)",
                  bg: "rgba(255,255,255,0.05)",
                },
              ].map((btn) => (
                <motion.a
                  key={btn.label}
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg"
                  style={{
                    background: btn.gradient !== "none" ? btn.gradient : btn.bg,
                    border: btn.border,
                    color: btn.textColor || "#F7F3EC",
                  }}
                >
                  {btn.icon}
                  {btn.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      className="py-12 px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/zamir_icon.png"
            alt="Zamir Logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: "20%",
              boxShadow: "0 0 20px rgba(201,160,66,0.3)",
            }}
          />
          <span className="text-white font-bold tracking-wide">Zamir</span>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Zamir. The Word in Melody — All rights
          reserved.
        </p>
        <div className="flex gap-6 text-slate-500 text-sm">
          {["Privacy", "Terms", "Support"].map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-slate-300 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
      <AudioSection />
      <StatsSection />
      <DownloadSection />
      <Footer />
    </div>
  );
}
