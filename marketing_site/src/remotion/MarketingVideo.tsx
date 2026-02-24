import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
  Img,
} from "remotion";

const BRAND_COLORS = {
  black: "#09090B",
  navy: "#18181B",
  gold: "#C9A042",
  lightGold: "#E6D070",
  white: "#FAFAFA",
  zinc: "#A1A1AA",
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const fadeSlide = (frame: number, start: number, fps: number, slidePx = 40) => {
  const progress = spring({
    frame: frame - start,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1], {
      extrapolateRight: "clamp",
    }),
    y: interpolate(progress, [0, 1], [slidePx, 0]),
  };
};

const fadeOutConfig = (frame: number, end: number) => {
  return interpolate(frame, [end - 20, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ─── Abstract Background Blob ───────────────────────────────────────────────
function AmbientBlob({
  frame,
  color,
  size,
  startX,
  startY,
  speed = 0.01,
}: {
  frame: number;
  color: string;
  size: number;
  startX: number;
  startY: number;
  speed?: number;
}) {
  const x = startX + Math.sin(frame * speed) * 300;
  const y = startY + Math.cos(frame * speed * 0.8) * 300;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
        filter: "blur(80px)",
        transform: "translate(-50%, -50%)",
        opacity: 0.15,
      }}
    />
  );
}

// ─── Scene 1: Intro (0-150) ───────────────────────────────────────────────
function Scene1({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame;
  const outOpacity = fadeOutConfig(localFrame, 150);

  const t1 = fadeSlide(localFrame, 15, fps, 60);
  const t2 = fadeSlide(localFrame, 35, fps, 60);

  return (
    <AbsoluteFill
      style={{
        opacity: outOpacity,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AmbientBlob
        frame={localFrame}
        color={BRAND_COLORS.gold}
        size={1200}
        startX={1920 / 2}
        startY={1080 / 2}
        speed={0.01}
      />

      <div
        style={{
          transform: `translateY(${t1.y}px)`,
          opacity: t1.opacity,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 130,
            fontWeight: 800,
            fontFamily: "Fraunces, serif",
            color: BRAND_COLORS.white,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Faith,
        </h1>
      </div>
      <div
        style={{
          transform: `translateY(${t2.y}px)`,
          opacity: t2.opacity,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        <h2
          style={{
            fontSize: 130,
            fontWeight: 800,
            fontFamily: "Fraunces, serif",
            color: "transparent",
            background: `linear-gradient(135deg, ${BRAND_COLORS.gold}, ${BRAND_COLORS.lightGold})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          in Your Pocket.
        </h2>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 2: The Experience (150-330) ────────────────────────────────────
function Scene2({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 150;
  const outOpacity = fadeOutConfig(localFrame, 180);

  const textGroup = fadeSlide(localFrame, 10, fps, 50);
  const cardGroup = fadeSlide(localFrame, 25, fps, 80);

  return (
    <AbsoluteFill
      style={{
        opacity: outOpacity,
        flexDirection: "row",
        padding: "0 150px",
        alignItems: "center",
        gap: 100,
      }}
    >
      <AmbientBlob
        frame={localFrame}
        color={BRAND_COLORS.white}
        size={800}
        startX={400}
        startY={800}
        speed={0.015}
      />

      {/* Left Typography */}
      <div
        style={{
          flex: 1,
          transform: `translateY(${textGroup.y}px)`,
          opacity: textGroup.opacity,
        }}
      >
        <p
          style={{
            color: BRAND_COLORS.zinc,
            fontSize: 24,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            textTransform: "uppercase",
            letterSpacing: 8,
            margin: "0 0 24px 0",
          }}
        >
          Deepen Your Walk
        </p>
        <h2
          style={{
            fontSize: 90,
            fontWeight: 700,
            color: BRAND_COLORS.white,
            fontFamily: "Fraunces, serif",
            lineHeight: 1.1,
            margin: "0 0 40px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Scripture
          <br />
          Transformed Into
          <br />
          Ambient Sound.
        </h2>
        <p
          style={{
            color: BRAND_COLORS.zinc,
            fontSize: 28,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            lineHeight: 1.5,
            maxWidth: 600,
          }}
        >
          Stream curated Christian music, guided prayer sessions, and peaceful
          melodies wherever you go.
        </p>
      </div>

      {/* Right Sleek Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${cardGroup.y}px)`,
          opacity: cardGroup.opacity,
        }}
      >
        <div
          style={{
            width: 500,
            height: 500,
            background: "rgba(24, 24, 27, 0.4)",
            borderRadius: 40,
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            padding: 50,
            position: "relative",
            boxShadow: `0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${BRAND_COLORS.gold}, ${BRAND_COLORS.lightGold})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              marginBottom: 40,
              boxShadow: `0 10px 30px rgba(201, 160, 66, 0.3)`,
            }}
          >
            🕊️
          </div>
          <h3
            style={{
              fontSize: 36,
              color: BRAND_COLORS.white,
              fontFamily: "Fraunces, serif",
              margin: "0 0 16px 0",
            }}
          >
            Psalms 23 Serenity
          </h3>
          <p
            style={{
              fontSize: 20,
              color: BRAND_COLORS.gold,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              margin: "0 0 50px 0",
              fontWeight: 600,
            }}
          >
            Curated Worship Suite
          </p>

          {/* Minimal Waveform */}
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              height: 60,
              marginTop: "auto",
            }}
          >
            {Array.from({ length: 40 }, (_, i) => {
              const h =
                10 + Math.abs(Math.sin(localFrame * 0.05 + i * 0.2)) * 40;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: BRAND_COLORS.zinc,
                    borderRadius: 4,
                    height: h,
                    opacity: 0.7,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 3: Original Languages (330-510) ────────────────────────────────
function Scene3({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 330;
  const outOpacity = fadeOutConfig(localFrame, 180);

  const textGroup = fadeSlide(localFrame, 10, fps, 50);
  const visualGroup = fadeSlide(localFrame, 25, fps, 80);

  // Greek to English Morph
  const isGreek = localFrame % 80 < 40;
  const displayedText = isGreek
    ? "Εν αρχή ην ο Λόγος"
    : "In the beginning was the Word";
  const displayedLang = isGreek ? "Original Greek" : "Modern English";

  return (
    <AbsoluteFill
      style={{
        opacity: outOpacity,
        flexDirection: "row-reverse",
        padding: "0 150px",
        alignItems: "center",
        gap: 100,
      }}
    >
      <AmbientBlob
        frame={localFrame}
        color={BRAND_COLORS.lightGold}
        size={1000}
        startX={1500}
        startY={200}
        speed={0.012}
      />

      {/* Right Typography (Flex row reverse puts this on right) */}
      <div
        style={{
          flex: 1,
          transform: `translateY(${textGroup.y}px)`,
          opacity: textGroup.opacity,
        }}
      >
        <p
          style={{
            color: BRAND_COLORS.gold,
            fontSize: 24,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            textTransform: "uppercase",
            letterSpacing: 8,
            margin: "0 0 24px 0",
          }}
        >
          Rooted in Truth
        </p>
        <h2
          style={{
            fontSize: 90,
            fontWeight: 700,
            color: BRAND_COLORS.white,
            fontFamily: "Fraunces, serif",
            lineHeight: 1.1,
            margin: "0 0 40px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Original
          <br />
          Languages.
        </h2>
        <p
          style={{
            color: BRAND_COLORS.zinc,
            fontSize: 28,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            lineHeight: 1.5,
            maxWidth: 600,
          }}
        >
          Listen to scriptures exactly as they were written, with accurate
          Hebrew and Greek pronunciations.
        </p>
      </div>

      {/* Left Sleek Graphic */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${visualGroup.y}px)`,
          opacity: visualGroup.opacity,
        }}
      >
        <div
          style={{
            width: 600,
            height: 350,
            background: "rgba(9, 9, 11, 0.8)",
            borderRadius: 30,
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201, 160, 66, 0.2)`,
          }}
        >
          <p
            style={{
              position: "absolute",
              top: 30,
              left: 40,
              color: BRAND_COLORS.gold,
              fontSize: 16,
              fontFamily: "Plus Jakarta Sans",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {displayedLang}
          </p>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: BRAND_COLORS.white,
              fontFamily: isGreek ? "serif" : "Fraunces, serif",
              textAlign: "center",
              padding: "0 40px",
              transition: "all 0.4s ease",
            }}
          >
            {displayedText}
          </h1>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 4: AI Audio Generation Demo (510-720) ──────────────────────────
function Scene4({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 510;
  const outOpacity = fadeOutConfig(localFrame, 210);

  const headerGroup = fadeSlide(localFrame, 10, fps, -50);
  const coreGroup = fadeSlide(localFrame, 30, fps, 50);

  return (
    <AbsoluteFill
      style={{
        opacity: outOpacity,
        justifyContent: "center",
        alignItems: "center",
        padding: "100px",
      }}
    >
      <AmbientBlob
        frame={localFrame}
        color={"#7c3aed"}
        size={900}
        startX={960}
        startY={540}
        speed={0.02}
      />

      <div
        style={{
          transform: `translateY(${headerGroup.y}px)`,
          opacity: headerGroup.opacity,
          textAlign: "center",
          marginBottom: 80,
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: BRAND_COLORS.white,
            fontFamily: "Fraunces, serif",
            margin: "0 0 20px 0",
          }}
        >
          Personalized AI Soundscapes
        </h2>
        <p
          style={{
            color: BRAND_COLORS.zinc,
            fontSize: 28,
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
        >
          Tune the scriptures to your exact study, sleep, or worship mood.
        </p>
      </div>

      <div
        style={{
          transform: `translateY(${coreGroup.y}px)`,
          opacity: coreGroup.opacity,
          display: "flex",
          width: "100%",
          maxWidth: 1200,
          gap: 40,
        }}
      >
        {/* Mock Prompt Input */}
        <div
          style={{
            flex: 1,
            background: "rgba(24,24,27,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 30,
            padding: 40,
            backdropFilter: "blur(20px)",
          }}
        >
          <p
            style={{
              color: BRAND_COLORS.gold,
              fontSize: 16,
              fontFamily: "Plus Jakarta Sans",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            The Prompt
          </p>
          <p
            style={{
              color: BRAND_COLORS.white,
              fontSize: 32,
              fontFamily: "Fraunces, serif",
              lineHeight: 1.4,
            }}
          >
            "Create a cinematic, softly building ambient piano track backing an
            English reading of Isaiah 40."
          </p>
          <div
            style={{
              marginTop: 40,
              height: 6,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {/* Progress bar animation */}
            <div
              style={{
                width: `${Math.min(100, (localFrame / 150) * 100)}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${BRAND_COLORS.gold}, ${BRAND_COLORS.lightGold})`,
              }}
            />
          </div>
        </div>

        {/* Mock Output Output */}
        <div
          style={{
            flex: 1,
            background: "rgba(24,24,27,0.5)",
            border: "1px solid rgba(201,160,66,0.3)",
            borderRadius: 30,
            padding: 40,
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow:
              localFrame > 50 ? "0 0 80px rgba(201,160,66,0.15)" : "none",
            transition: "all 1s ease",
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${BRAND_COLORS.gold}, ${BRAND_COLORS.lightGold})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              marginBottom: 30,
              boxShadow: `0 10px 40px rgba(201, 160, 66, 0.4)`,
              opacity: localFrame > 50 ? 1 : 0.3,
              transform: localFrame > 50 ? "scale(1)" : "scale(0.8)",
              transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            🎶
          </div>
          <h3
            style={{
              fontSize: 28,
              color: BRAND_COLORS.white,
              fontFamily: "Fraunces, serif",
              margin: "0 0 10px 0",
              opacity: localFrame > 50 ? 1 : 0.3,
              transition: "all 1s ease",
            }}
          >
            Isaiah 40 (Cinematic)
          </h3>
          <p
            style={{
              fontSize: 18,
              color: BRAND_COLORS.lightGold,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              margin: 0,
              opacity: localFrame > 50 ? 1 : 0,
              transition: "all 1s ease",
            }}
          >
            ✨ AI Generated
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 5: Outro / CTA (720-850) ───────────────────────────────────────
function Scene5({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - 720;

  const mainSlide = fadeSlide(localFrame, 10, fps, 40);
  const ctaSlide = fadeSlide(localFrame, 30, fps, 40);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AmbientBlob
        frame={localFrame}
        color={BRAND_COLORS.gold}
        size={1500}
        startX={1920 / 2}
        startY={1080 / 2}
        speed={0.01}
      />

      <div
        style={{
          transform: `translateY(${mainSlide.y}px)`,
          opacity: mainSlide.opacity,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <h1
          style={{
            fontSize: 110,
            fontWeight: 800,
            color: BRAND_COLORS.white,
            fontFamily: "Fraunces, serif",
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Experience Zamir.
        </h1>
        <p
          style={{
            color: BRAND_COLORS.zinc,
            fontSize: 32,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            marginTop: 20,
          }}
        >
          Available on iOS, Android, and Web.
        </p>
      </div>

      <div
        style={{
          transform: `translateY(${ctaSlide.y}px)`,
          opacity: ctaSlide.opacity,
          display: "flex",
          gap: 30,
        }}
      >
        <div
          style={{
            padding: "28px 64px",
            borderRadius: 60,
            background: BRAND_COLORS.white,
            color: BRAND_COLORS.black,
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          Download Now
        </div>
        <div
          style={{
            padding: "28px 64px",
            borderRadius: 60,
            border: `2px solid rgba(255,255,255,0.2)`,
            color: BRAND_COLORS.white,
            fontSize: 24,
            fontWeight: 600,
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
        >
          Learn More
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: ctaSlide.opacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Img
          src={staticFile("zamir_icon.png")}
          style={{ width: 60, height: 60, borderRadius: "20%" }}
        />
        <span
          style={{
            color: BRAND_COLORS.zinc,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 20,
            letterSpacing: 4,
            fontWeight: 500,
          }}
        >
          ZAMIR.APP
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Root Composition ─────────────────────────────────────────────────────────
// Total: 850 frames = 28.3 seconds @ 30fps
export const MarketingVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BRAND_COLORS.black }}>
      <Sequence from={0} durationInFrames={150} name="Intro">
        <Scene1 frame={useCurrentFrame()} />
      </Sequence>

      <Sequence from={150} durationInFrames={180} name="Feature 1">
        <Scene2 frame={useCurrentFrame()} />
      </Sequence>

      <Sequence from={330} durationInFrames={180} name="Feature 2">
        <Scene3 frame={useCurrentFrame()} />
      </Sequence>

      <Sequence from={510} durationInFrames={210} name="Feature 3">
        <Scene4 frame={useCurrentFrame()} />
      </Sequence>

      <Sequence from={720} durationInFrames={130} name="Outro">
        <Scene5 frame={useCurrentFrame()} />
      </Sequence>

      {/* Background World Class Music Track */}
      {/* Note: In production this plays the High Quality ambient_music.wav. */}
      {/* We duck the main track during the AI generation showcase scene */}
      <Audio
        src={staticFile("ambient_music_long.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 60, 520, 550, 700, 720, 820, 850],
            [0, 0.4, 0.4, 0.05, 0.05, 0.4, 0.4, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }
      />

      {/* The AI Generated Melody Demonstration for Scene 4 */}
      <Sequence from={540} durationInFrames={180}>
        <Audio
          src={staticFile("cinematic_ambient.wav")}
          volume={(f) =>
            interpolate(f, [0, 30, 150, 180], [0, 0.8, 0.8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </Sequence>

      {/* Transition Impacts */}
      <Sequence from={150} durationInFrames={45}>
        <Audio src={staticFile("whoosh.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={330} durationInFrames={45}>
        <Audio src={staticFile("whoosh.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={510} durationInFrames={45}>
        <Audio src={staticFile("whoosh.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={720} durationInFrames={60}>
        <Audio src={staticFile("impact.wav")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
