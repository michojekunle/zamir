"use client";

import { motion } from "framer-motion";
import {
  Copy,
  Share2,
  Image as ImageIcon,
  Check,
  X,
  Music,
  Disc3,
} from "lucide-react";
import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";

interface VerseActionModalProps {
  verses: {
    number: number;
    text: string;
  }[];
  bookId: string;
  bookName: string;
  chapter: number;
  version: string;
  onClose: () => void;
}

export function VerseActionModal({
  verses,
  bookId,
  bookName,
  chapter,
  version,
  onClose,
}: VerseActionModalProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isMultiple = verses.length > 1;
  const verseNumbers = verses.map((v) => v.number).join(",");
  const verseRange = isMultiple
    ? `${verses[0].number}-${verses[verses.length - 1].number}`
    : verses[0].number;

  const fullReference = `${bookName} ${chapter}:${verseRange} (${version.toUpperCase()})`;
  const combinedText = verses.map((v) => v.text).join(" ");
  const appLink = `https://play.zamir.app/dashboard/bible?book=${bookId}&chapter=${chapter}&verses=${verseNumbers}`;

  // Dynamic Font Size Calculation based on character count
  // We use inline styles for the card to handle this perfectly
  const getFontSize = (text: string) => {
    const chars = text.length;
    if (chars < 120) return "64px";
    if (chars < 250) return "48px";
    if (chars < 450) return "36px";
    if (chars < 700) return "28px";
    return "24px";
  };

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    await navigator.clipboard.writeText(
      `${combinedText}\n\n— ${fullReference}\nRead at: ${appLink}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareText = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Zamir Bible Share",
          text: `${combinedText}\n\n— ${fullReference}\n\nRead more at:\n${appLink}\n\nplay.zamir.app`,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      handleCopy();
    }
  };

  const handleShareImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "bible-verse.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Zamir Bible Verse",
        });
      } else {
        const link = document.createElement("a");
        link.download = "zamir-verse.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full bg-[#18181B] rounded-t-[32px] p-6 border-t border-white/10 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden pointer-events-auto"
      >
        <div className="-z-10 absolute top-0 right-0 w-32 h-32 bg-[#C9A042] opacity-[0.05] blur-3xl" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#C9A042] rounded-full" />
            <div>
              <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[3px]">
                {fullReference}
              </p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[1px] mt-0.5 opacity-60">
                {verses.length} {verses.length === 1 ? "Verse" : "Verses"}{" "}
                Selected
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Preview Card (Hidden) */}
        <div className="fixed -left-[9999px] top-0">
          <div
            ref={cardRef}
            className="w-[1080px] h-[1080px] bg-[#09090B] flex flex-col items-center justify-center p-24 text-center relative overflow-hidden"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C9A042] opacity-[0.15] blur-[150px] rounded-full -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A042] opacity-[0.05] blur-[120px] rounded-full -ml-30 -mb-30" />

            <div className="relative z-10 max-w-[850px] flex flex-col items-center">
              <span className="text-[#C9A042] text-[180px] leading-none mb-4 opacity-30 select-none">
                “
              </span>
              <p
                className="text-[#FAFAFA] font-medium mb-12 italic leading-[1.5]"
                style={{ fontSize: getFontSize(combinedText) }}
              >
                {combinedText}
              </p>
              <div className="w-40 h-1 bg-[#C9A042] mb-10 opacity-40 rounded-full" />
              <p className="text-[rgba(250,250,250,0.6)] text-3xl uppercase tracking-[12px] font-sans font-bold">
                {fullReference}
              </p>
              <div className="mt-20 flex flex-col items-center gap-6">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-[#C9A042] rounded-3xl flex items-center justify-center text-5xl shadow-lg shadow-[#C9A042]/20">
                    📖
                  </div>
                  <span className="text-[#FAFAFA] text-5xl font-sans font-bold tracking-[8px] opacity-40">
                    ZAMIR
                  </span>
                </div>
                <span className="text-[#C9A042] text-2xl font-sans font-bold tracking-[6px] opacity-60 uppercase">
                  play.zamir.app
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ActionBtn
            onClick={handleCopy}
            icon={
              copied ? <Check className="text-green-500" /> : <Copy size={16} />
            }
            label={copied ? "Copied" : "Copy"}
          />
          <ActionBtn
            onClick={handleShareText}
            icon={<Share2 size={16} />}
            label="Share Link"
          />
          <ActionBtn
            onClick={handleShareImage}
            icon={<ImageIcon size={16} />}
            label={generating ? "Creating..." : "Share Card"}
            disabled={generating}
          />
          <ActionBtn
            onClick={() => {
              const params = new URLSearchParams({
                text: combinedText,
                ref: fullReference,
              });
              router.push(`/dashboard/generate?${params.toString()}`);
            }}
            icon={<Music size={16} />}
            label="As Music"
            highlight
          />
        </div>
      </motion.div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  disabled,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 w-full p-3 rounded-[20px] transition-all relative overflow-hidden group ${
        highlight
          ? "bg-[#C9A042]/10 border border-[#C9A042]/20 hover:bg-[#C9A042]/20"
          : "bg-white/5 border border-white/5 hover:bg-white/10"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
          highlight
            ? "bg-[#C9A042] text-[#09090B]"
            : "bg-white/5 text-[#C9A042] group-hover:bg-[#C9A042]/10"
        }`}
      >
        {icon}
      </div>
      <span
        className={`font-bold text-[11px] uppercase tracking-wider ${highlight ? "text-[#FAFAFA]" : "text-slate-300 group-hover:text-white"}`}
      >
        {label}
      </span>
    </button>
  );
}
