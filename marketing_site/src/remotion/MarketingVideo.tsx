import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ─── Helpers ────────────────────────────────────────────────────────────────

const easeInOutCubic = Easing.bezier(0.645, 0.045, 0.355, 1.0);

function fadeIn(frame: number, start: number, duration: number) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });
}

function fadeOut(frame: number, start: number, duration: number) {
  return interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });
}

function slideUp(frame: number, start: number, fps: number) {
  const progress = spring({
    frame: frame - start,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });
  const y = interpolate(progress, [0, 1], [60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return { y, opacity };
}

// ─── Particles ───────────────────────────────────────────────────────────────

function Particle({
  x,
  y,
  size,
  opacity,
  color,
}: {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        opacity,
        filter: `blur(${size * 0.3}px)`,
      }}
    />
  );
}

function ParticleField({
  frame,
  count = 30,
}: {
  frame: number;
  count?: number;
}) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 137.508;
      return {
        id: i,
        baseX: (Math.sin(seed) * 0.5 + 0.5) * 1920,
        baseY: (Math.cos(seed * 1.3) * 0.5 + 0.5) * 1080,
        size: 4 + (i % 7) * 3,
        speed: 0.3 + (i % 5) * 0.15,
        phase: (i * 0.7) % (Math.PI * 2),
        color: i % 3 === 0 ? "#3B82F6" : i % 3 === 1 ? "#8B5CF6" : "#06B6D4",
      };
    });
  }, [count]);

  return (
    <>
      {particles.map((p) => {
        const t = frame * 0.02 + p.phase;
        const x = p.baseX + Math.sin(t * p.speed) * 80;
        const y = p.baseY + Math.cos(t * p.speed * 0.7) * 50;
        const opacity = interpolate(
          Math.sin(t * 0.5 + p.phase),
          [-1, 1],
          [0.1, 0.5],
        );
        return (
          <Particle
            key={p.id}
            x={x}
            y={y}
            size={p.size}
            opacity={opacity}
            color={p.color}
          />
        );
      })}
    </>
  );
}

// ─── Waveform Visualizer ─────────────────────────────────────────────────────

function Waveform({
  frame,
  width = 800,
  height = 120,
}: {
  frame: number;
  width?: number;
  height?: number;
}) {
  const bars = 64;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        width,
        height,
        justifyContent: "center",
      }}
    >
      {Array.from({ length: bars }, (_, i) => {
        const t = frame * 0.08;
        const h = Math.abs(
          Math.sin(t + i * 0.25) * 0.4 +
            Math.sin(t * 1.3 + i * 0.4) * 0.35 +
            Math.sin(t * 0.7 + i * 0.15) * 0.25,
        );
        const barHeight = Math.max(8, h * height);
        const progress = i / bars;
        const r = Math.round(interpolate(progress, [0, 0.5, 1], [59, 139, 6]));
        const g = Math.round(
          interpolate(progress, [0, 0.5, 1], [130, 92, 182]),
        );
        const b = Math.round(
          interpolate(progress, [0, 0.5, 1], [246, 246, 212]),
        );
        return (
          <div
            key={i}
            style={{
              width: Math.max(1, (width - bars * 4) / bars),
              height: barHeight,
              borderRadius: 4,
              background: `linear-gradient(180deg, rgb(${r},${g},${b}), rgba(${r},${g},${b},0.3))`,
              boxShadow: `0 0 8px rgba(${r},${g},${b},0.6)`,
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Glowing Orb ─────────────────────────────────────────────────────────────

function GlowingOrb({
  x,
  y,
  size,
  color,
  frame,
  phaseOffset = 0,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  frame: number;
  phaseOffset?: number;
}) {
  const pulse = Math.sin(frame * 0.04 + phaseOffset) * 0.15 + 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x - (size * pulse) / 2,
        top: y - (size * pulse) / 2,
        width: size * pulse,
        height: size * pulse,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}88 0%, ${color}22 50%, transparent 70%)`,
        filter: `blur(${size * 0.15}px)`,
      }}
    />
  );
}

// ─── Grid Lines ──────────────────────────────────────────────────────────────

function GridLines({ opacity }: { opacity: number }) {
  const cols = 12;
  const rows = 7;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {Array.from({ length: cols }, (_, i) => (
        <div
          key={`col-${i}`}
          style={{
            position: "absolute",
            left: `${(i / cols) * 100}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background:
              "linear-gradient(to bottom, transparent, rgba(59,130,246,0.15), transparent)",
          }}
        />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={`row-${i}`}
          style={{
            position: "absolute",
            top: `${(i / rows) * 100}%`,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(59,130,246,0.15), transparent)",
          }}
        />
      ))}
    </div>
  );
}

// ─── SCENE 1: Opening — "Silence Speaks" ─────────────────────────────────────
// Frames 0–89 (3s @ 30fps)

function Scene1({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const totalFrames = 90;
  const inFade = fadeIn(frame, 0, 20);
  const outFade = fadeOut(frame, totalFrames - 20, 20);
  const sceneOpacity = Math.min(inFade, outFade);

  const title = slideUp(frame, 15, fps);
  const subtitle = slideUp(frame, 30, fps);

  return (
    <AbsoluteFill style={{ background: "#0F1B2E", opacity: sceneOpacity }}>
      <GlowingOrb
        x={960}
        y={540}
        size={600}
        color="#1d4ed8"
        frame={frame}
        phaseOffset={0}
      />
      <GlowingOrb
        x={400}
        y={200}
        size={250}
        color="#7c3aed"
        frame={frame}
        phaseOffset={1.5}
      />
      <GlowingOrb
        x={1520}
        y={850}
        size={200}
        color="#0891b2"
        frame={frame}
        phaseOffset={3}
      />
      <ParticleField frame={frame} count={25} />
      <GridLines opacity={0.4} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            transform: `translateY(${title.y}px)`,
            opacity: title.opacity,
            marginBottom: 24,
          }}
        >
          <img src="/zamir_icon.png" alt="Zamir Logo" style={{ width: 60, height: 60, borderRadius: "20%", boxShadow: "0 0 20px rgba(201,160,66,0.5)" }} />
        </div>

        <div
          style={{
            transform: `translateY(${title.y}px)`,
            opacity: title.opacity,
          }}
        >
          <h1
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "transparent",
              background: "linear-gradient(135deg, #F7F3EC, #93c5fd, #E6C57A)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              fontFamily: "Fraunces, serif",
              letterSpacing: "-4px",
              margin: 0,
              lineHeight: 1,
              textShadow: "none",
            }}
          >
            ZAMIR
          </h1>
        </div>

        <div
          style={{
            transform: `translateY(${subtitle.y}px)`,
            opacity: subtitle.opacity,
            marginTop: 16,
          }}
        >
          <p
            style={{
              fontSize: 28,
              color: "#94a3b8",
              fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
              letterSpacing: 8,
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Where Faith Meets Sound
          </p>
        </div>

        {/* Animated divider */}
        <div
          style={{
            marginTop: 48,
            width: interpolate(frame, [40, 80], [0, 400], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 1,
            background:
              "linear-gradient(to right, transparent, #C9A042, #E6C57A, transparent)",
            opacity: subtitle.opacity,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 2: "The Experience" — waveform + features ─────────────────────────
// Frames 90–209 (4s @ 30fps)

function Scene2({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 90;
  const totalFrames = 120;
  const inFade = fadeIn(localFrame, 0, 25);
  const outFade = fadeOut(localFrame, totalFrames - 25, 25);
  const sceneOpacity = Math.min(inFade, outFade);

  const headingSlide = slideUp(localFrame, 10, fps);
  const wave1 = slideUp(localFrame, 30, fps);
  const feat1 = slideUp(localFrame, 45, fps);
  const feat2 = slideUp(localFrame, 60, fps);
  const feat3 = slideUp(localFrame, 75, fps);

  const features = [
    {
      icon: "🎵",
      label: "AI-Generated Music",
      desc: "Personalized tracks for every prayer and mood",
    },
    {
      icon: "🕌",
      label: "Sacred Playlists",
      desc: "Curated by scholars and music directors",
    },
    {
      icon: "📿",
      label: "Daily Rituals",
      desc: "Guided sessions for Fajr, Dhur, Asr, Maghrib & Isha",
    },
  ];
  const featureAnims = [feat1, feat2, feat3];

  return (
    <AbsoluteFill style={{ background: "#030712", opacity: sceneOpacity }}>
      {/* Background gradient sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.12) 0%, transparent 60%)`,
        }}
      />
      <GridLines opacity={0.25} />
      <GlowingOrb
        x={190}
        y={960}
        size={400}
        color="#7c3aed"
        frame={localFrame}
        phaseOffset={2}
      />
      <GlowingOrb
        x={1730}
        y={120}
        size={300}
        color="#0891b2"
        frame={localFrame}
        phaseOffset={0.5}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 100,
        }}
      >
        {/* Section heading */}
        <div
          style={{
            transform: `translateY(${headingSlide.y}px)`,
            opacity: headingSlide.opacity,
            marginBottom: 60,
          }}
        >
          <p
            style={{
              color: "#C9A042",
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: 6,
              margin: "0 0 12px",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            The Experience
          </p>
          <h2
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              fontFamily: "Fraunces, serif",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            Sound Meets Spirit
          </h2>
        </div>

        {/* Waveform */}
        <div
          style={{
            transform: `translateY(${wave1.y}px)`,
            opacity: wave1.opacity,
            marginBottom: 60,
          }}
        >
          <Waveform frame={localFrame} width={900} height={100} />
        </div>

        {/* Feature cards */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
          {features.map((f, i) => (
            <div
              key={f.label}
              style={{
                transform: `translateY(${featureAnims[i].y}px)`,
                opacity: featureAnims[i].opacity,
                width: 260,
                padding: "32px 28px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(59,130,246,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 8,
                  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
                }}
              >
                {f.label}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#94a3b8",
                  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 3: "Cinematic Demo" — phone mockup + audio ─────────────────────────
// Frames 210–329 (4s @ 30fps)

function PhoneMockup({ frame }: { frame: number }) {
  const localFrame = frame - 210;
  const floatY = Math.sin(localFrame * 0.04) * 12;
  const rotateX = Math.sin(localFrame * 0.025) * 3;
  const rotateY = Math.cos(localFrame * 0.035) * 5;

  return (
    <div
      style={{
        transform: `translateY(${floatY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
        width: 300,
        height: 620,
        borderRadius: 40,
        background: "linear-gradient(160deg, #253550, #0f172a)",
        border: "2px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Status bar */}
      <div
        style={{
          padding: "16px 24px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
          9:41
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <div
            style={{
              width: 18,
              height: 11,
              border: "1.5px solid white",
              borderRadius: 3,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 2,
                right: 5,
                background: "white",
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* App content */}
      <div style={{ flex: 1, padding: "8px 20px", overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            color: "white",
            fontWeight: 800,
            fontSize: 22,
            marginBottom: 4,
            fontFamily: "Fraunces, serif",
          }}
        >
          Zamir
        </div>
        <div style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
          Good evening, Ali ✨
        </div>

        {/* Now playing card */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))",
            border: "1px solid rgba(59,130,246,0.4)",
            borderRadius: 20,
            padding: "20px 18px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: "linear-gradient(135deg, #C9A042, #E6C57A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              🌙
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
                Fajr Reflection
              </div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                Morning Prayer Suite
              </div>
            </div>
          </div>
          {/* Mini waveform */}
          <div
            style={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              height: 30,
              marginBottom: 12,
            }}
          >
            {Array.from({ length: 24 }, (_, i) => {
              const h = Math.abs(Math.sin(localFrame * 0.1 + i * 0.4)) * 24 + 4;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: h,
                    background: "#C9A042",
                    borderRadius: 2,
                    opacity: 0.8,
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <div style={{ color: "#64748b", fontSize: 20 }}>⏮</div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#C9A042",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "white",
              }}
            >
              ▶
            </div>
            <div style={{ color: "#64748b", fontSize: 20 }}>⏭</div>
          </div>
        </div>

        {/* Track list */}
        {["Isaiah Serenity", "Bible Recitation", "Praise Harmonics"].map(
          (track, i) => (
            <div
              key={track}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom:
                  i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(59,130,246,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                {["⭐", "📖", "🌿"][i]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                  {track}
                </div>
                <div style={{ color: "#64748b", fontSize: 11 }}>3:20</div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Bottom nav */}
      <div
        style={{
          padding: "12px 20px 24px",
          display: "flex",
          justifyContent: "space-around",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {["🏠", "🎵", "📿", "👤"].map((icon, i) => (
          <div key={i} style={{ fontSize: 20, opacity: i === 1 ? 1 : 0.4 }}>
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}

function Scene3({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 210;
  const totalFrames = 120;
  const inFade = fadeIn(localFrame, 0, 25);
  const outFade = fadeOut(localFrame, totalFrames - 25, 25);
  const sceneOpacity = Math.min(inFade, outFade);

  const textSlide = slideUp(localFrame, 15, fps);
  const phoneSlide = slideUp(localFrame, 5, fps);

  return (
    <AbsoluteFill style={{ background: "#0F1B2E", opacity: sceneOpacity }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 75% 50%, rgba(59,130,246,0.1) 0%, transparent 55%)",
        }}
      />
      <GlowingOrb
        x={1400}
        y={540}
        size={600}
        color="#C9A042"
        frame={localFrame}
        phaseOffset={1}
      />
      <GlowingOrb
        x={200}
        y={800}
        size={250}
        color="#7c3aed"
        frame={localFrame}
        phaseOffset={2.5}
      />
      <GridLines opacity={0.2} />
      <ParticleField frame={localFrame} count={15} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 120,
        }}
      >
        {/* Left — Text */}
        <div
          style={{
            transform: `translateY(${textSlide.y}px)`,
            opacity: textSlide.opacity,
            maxWidth: 500,
          }}
        >
          <p
            style={{
              color: "#C9A042",
              fontFamily: "monospace",
              fontSize: 16,
              letterSpacing: 6,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            App Preview
          </p>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              fontFamily: "Fraunces, serif",
              lineHeight: 1.1,
              margin: "0 0 24px",
            }}
          >
            Faith,
            <br />
            in Your
            <br />
            Pocket.
          </h2>
          <p
            style={{
              fontSize: 20,
              color: "#94a3b8",
              lineHeight: 1.7,
              margin: "0 0 40px",
              fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
            }}
          >
            Stream curated Christian music, guided prayer sessions, and peaceful
            ambients — wherever you are.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["iOS", "Android", "Web"].map((p) => (
              <div
                key={p}
                style={{
                  padding: "10px 20px",
                  borderRadius: 40,
                  border: "1px solid rgba(59,130,246,0.5)",
                  color: "#93c5fd",
                  fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Phone */}
        <div
          style={{
            transform: `translateY(${phoneSlide.y}px)`,
            opacity: phoneSlide.opacity,
            perspective: 1200,
          }}
        >
          <PhoneMockup frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 4: Stats / Social Proof ───────────────────────────────────────────
// Frames 330–419 (3s @ 30fps)

function CountUp({
  target,
  frame,
  startFrame,
}: {
  target: number;
  frame: number;
  startFrame: number;
}) {
  const progress = interpolate(frame - startFrame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(target * progress);
}

function Scene4({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 330;
  const totalFrames = 90;
  const inFade = fadeIn(localFrame, 0, 20);
  const outFade = fadeOut(localFrame, totalFrames - 20, 20);
  const sceneOpacity = Math.min(inFade, outFade);

  const headingSlide = slideUp(localFrame, 5, fps);

  const stats = [
    { value: 50000, suffix: "+", label: "Active Listeners", icon: "👥" },
    { value: 1200, suffix: "+", label: "Curated Tracks", icon: "🎵" },
    { value: 40, suffix: "+", label: "Languages", icon: "🌍" },
    { value: 4.9, suffix: "★", label: "App Store Rating", icon: "⭐" },
  ];

  return (
    <AbsoluteFill style={{ background: "#020817", opacity: sceneOpacity }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.15) 0%, transparent 60%)",
        }}
      />
      <GridLines opacity={0.3} />
      <GlowingOrb
        x={100}
        y={100}
        size={300}
        color="#6366f1"
        frame={localFrame}
        phaseOffset={0}
      />
      <GlowingOrb
        x={1820}
        y={980}
        size={350}
        color="#C9A042"
        frame={localFrame}
        phaseOffset={3}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${headingSlide.y}px)`,
            opacity: headingSlide.opacity,
            marginBottom: 80,
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#6366f1",
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: 6,
              margin: "0 0 12px",
              textTransform: "uppercase",
            }}
          >
            By the Numbers
          </p>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              fontFamily: "Fraunces, serif",
              margin: 0,
            }}
          >
            Community of Faith
          </h2>
        </div>

        <div style={{ display: "flex", gap: 48 }}>
          {stats.map((stat, i) => {
            const slide = slideUp(localFrame, 20 + i * 15, fps);
            const isDecimal = stat.value < 10;
            const displayValue = isDecimal
              ? interpolate(
                  localFrame - 20 - i * 15,
                  [0, 60],
                  [0, stat.value as number],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  },
                ).toFixed(1)
              : CountUp({
                  target: stat.value as number,
                  frame: localFrame,
                  startFrame: 20 + i * 15,
                });

            return (
              <div
                key={stat.label}
                style={{
                  transform: `translateY(${slide.y}px)`,
                  opacity: slide.opacity,
                  textAlign: "center",
                  width: 220,
                  padding: "40px 32px",
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 900,
                    color: "transparent",
                    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    fontFamily: "Fraunces, serif",
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {displayValue}
                  {stat.suffix}
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 16,
                    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 5: CTA — Download Now ──────────────────────────────────────────────
// Frames 420–509 (3s @ 30fps)

function Scene5({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 420;
  const totalFrames = 90;
  const inFade = fadeIn(localFrame, 0, 25);
  const outFade = fadeOut(localFrame, totalFrames - 15, 15);
  const sceneOpacity = Math.min(inFade, outFade);

  const mainSlide = slideUp(localFrame, 10, fps);
  const subtitleSlide = slideUp(localFrame, 25, fps);
  const ctaSlide = slideUp(localFrame, 40, fps);

  return (
    <AbsoluteFill style={{ background: "#0a1120", opacity: sceneOpacity }}>
      {/* Concentric ripples */}
      {[0, 20, 40].map((offset) => {
        const phase = (localFrame + offset) % 60;
        const scale = interpolate(phase, [0, 60], [1, 3]);
        const ripOp = interpolate(phase, [0, 60], [0.4, 0]);
        return (
          <div
            key={offset}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: "1px solid rgba(59,130,246,0.6)",
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: ripOp,
            }}
          />
        );
      })}

      <GlowingOrb
        x={960}
        y={540}
        size={700}
        color="#1d4ed8"
        frame={localFrame}
        phaseOffset={0}
      />
      <ParticleField frame={localFrame} count={35} />
      <GridLines opacity={0.35} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${mainSlide.y}px)`,
            opacity: mainSlide.opacity,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "transparent",
              background: "linear-gradient(135deg, #F7F3EC, #93c5fd, #a78bfa)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              fontFamily: "Fraunces, serif",
              margin: 0,
              letterSpacing: "-3px",
              lineHeight: 1.05,
            }}
          >
            Begin Your
            <br />
            Journey
          </h1>
        </div>

        <div
          style={{
            transform: `translateY(${subtitleSlide.y}px)`,
            opacity: subtitleSlide.opacity,
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          <p
            style={{
              fontSize: 24,
              color: "#94a3b8",
              fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
              margin: 0,
              letterSpacing: 1,
            }}
          >
            Faith. Music. Community. — All in one app.
          </p>
        </div>

        <div
          style={{
            transform: `translateY(${ctaSlide.y}px)`,
            opacity: ctaSlide.opacity,
            display: "flex",
            gap: 24,
          }}
        >
          <div
            style={{
              padding: "20px 48px",
              borderRadius: 50,
              background: "linear-gradient(135deg, #C9A042, #E6C57A)",
              color: "white",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
              boxShadow: "0 0 60px rgba(59,130,246,0.5)",
              letterSpacing: 0.5,
            }}
          >
            Download Free
          </div>
          <div
            style={{
              padding: "20px 48px",
              borderRadius: 50,
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "white",
              fontSize: 20,
              fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
              letterSpacing: 0.5,
            }}
          >
            Learn More
          </div>
        </div>

        {/* Bottom brand stamp */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: ctaSlide.opacity,
          }}
        >
          <img src="/zamir_icon.png" alt="Zamir Logo" style={{ width: 60, height: 60, borderRadius: "20%", boxShadow: "0 0 20px rgba(201,160,66,0.5)" }} />
          <span
            style={{
              color: "#475569",
              fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            ZAMIR · 2025
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── Root Composition ─────────────────────────────────────────────────────────
// Total: 510 frames = 17 seconds @ 30fps

export const MarketingVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0F1B2E" }}>
      {/* Scene 1: 0–89 */}
      <Sequence from={0} durationInFrames={90} name="Opening">
        <Scene1 frame={useCurrentFrame()} />
      </Sequence>

      {/* Scene 2: 90–209 */}
      <Sequence from={90} durationInFrames={120} name="Experience">
        <Scene2 frame={useCurrentFrame()} />
      </Sequence>

      {/* Scene 3: 210–329 */}
      <Sequence from={210} durationInFrames={120} name="App Preview">
        <Scene3 frame={useCurrentFrame()} />
      </Sequence>

      {/* Scene 4: 330–419 */}
      <Sequence from={330} durationInFrames={90} name="Stats">
        <Scene4 frame={useCurrentFrame()} />
      </Sequence>

      {/* Scene 5: 420–509 */}
      <Sequence from={420} durationInFrames={90} name="CTA">
        <Scene5 frame={useCurrentFrame()} />
      </Sequence>
    </AbsoluteFill>
  );
};
