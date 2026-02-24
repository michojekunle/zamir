"use client";

import { motion } from "framer-motion";
import { Copy, Share2, Image as ImageIcon, Check, X } from "lucide-react";
import { useState, useRef } from "react";
import { toPng } from "html-to-image";

interface VerseActionModalProps {
  verse: {
    book: string;
    chapter: number;
    number: number;
    text: string;
    version: string;
  };
  onClose: () => void;
}

export function VerseActionModal({ verse, onClose }: VerseActionModalProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const fullReference = `${verse.book} ${verse.chapter}:${verse.number} (${verse.version.toUpperCase()})`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${verse.text}\n\n— ${fullReference}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareText = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Zamir Bible Share",
        text: `${verse.text}\n\n— ${fullReference}\nShared via Zamir App`,
      });
    } else {
      handleCopy();
    }
  };

  const handleShareImage = async () => {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-md bg-[#18181B] rounded-t-[32px] sm:rounded-[32px] p-6 border-t border-white/10 sm:border"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[#FAFAFA] font-bold text-lg">Verse Actions</h3>
            <p className="text-slate-500 text-sm">{fullReference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Preview Card for Image Generation (Hidden) */}
        <div className="fixed -left-[9999px] top-0">
          <div
            ref={cardRef}
            className="w-[1080px] h-[1080px] bg-[#09090B] flex flex-col items-center justify-center p-20 text-center relative overflow-hidden"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C9A042] opacity-[0.08] blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 opacity-[0.05] blur-[100px] rounded-full" />

            <div className="relative z-10 max-w-[800px] flex flex-col items-center">
              <span className="text-[#C9A042] text-8xl mb-12 opacity-40">
                “
              </span>
              <p className="text-[#FAFAFA] text-6xl leading-[1.3] font-medium mb-12">
                {verse.text}
              </p>
              <div className="w-24 h-1 bg-[#C9A042] mb-8" />
              <p className="text-[#A1A1AA] text-3xl uppercase tracking-[6px] font-sans font-bold">
                {fullReference}
              </p>

              <div className="mt-24 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#C9A042] rounded-xl flex items-center justify-center text-2xl">
                  📖
                </div>
                <span className="text-[#FAFAFA] text-3xl font-sans tracking-[4px] opacity-60">
                  ZAMIR
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <ActionBtn
            onClick={handleCopy}
            icon={
              copied ? <Check className="text-green-500" /> : <Copy size={20} />
            }
            label={copied ? "Copied!" : "Copy Text"}
          />
          <ActionBtn
            onClick={handleShareText}
            icon={<Share2 size={20} />}
            label="Share Text"
          />
          <ActionBtn
            onClick={handleShareImage}
            icon={<ImageIcon size={20} />}
            label={generating ? "Generating..." : "Share as Image"}
            disabled={generating}
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
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-4 w-full p-4 bg-[#27272A]/50 rounded-2xl hover:bg-[#27272A] transition-colors text-[#FAFAFA]"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-[#C9A042]">
        {icon}
      </div>
      <span className="font-semibold">{label}</span>
    </button>
  );
}
