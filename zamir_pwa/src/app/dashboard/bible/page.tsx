"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Settings2,
  BookOpen,
  Share2,
  Copy,
  Heart,
  Star,
} from "lucide-react";
import { NEW_TESTAMENT, VERSIONS, BibleBook } from "@/lib/bible-nt";
import { VerseActionModal } from "./BibleComponents";

type ViewState = "books" | "chapters" | "verses" | "search";

export default function BiblePage() {
  const [view, setView] = useState<ViewState>("books");
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedVersion, setSelectedVersion] = useState("niv");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVerse, setActiveVerse] = useState<{
    number: number;
    text: string;
  } | null>(null);
  const [verses, setVerses] = useState<{ number: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtered books for initial list
  const filteredBooks = useMemo(() => {
    return NEW_TESTAMENT.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Mock loading verses for the demo
  const loadVerses = async (book: string, chapter: number, version: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 600));

    // Some real sample verses for John 1 (TPT/NIV/NKJV mix/mock)
    if (book === "John" && chapter === 1) {
      const john1 = [
        {
          number: 1,
          text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        },
        { number: 2, text: "He was with God in the beginning." },
        {
          number: 3,
          text: "Through him all things were made; without him nothing was made that has been made.",
        },
        {
          number: 4,
          text: "In him was life, and that life was the light of all mankind.",
        },
        {
          number: 5,
          text: "The light shines in the darkness, and the darkness has not overcome it.",
        },
      ];
      setVerses(john1);
    } else {
      // General mock for others
      setVerses(
        Array.from({ length: 20 }, (_, i) => ({
          number: i + 1,
          text: `This is verse ${i + 1} of ${book} chapter ${chapter} in the ${version.toUpperCase()} version. Zamir brings you closer to the Word through music and reflection.`,
        })),
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedBook && selectedChapter) {
      loadVerses(selectedBook.name, selectedChapter, selectedVersion);
    }
  }, [selectedBook, selectedChapter, selectedVersion]);

  const handleBookClick = (book: BibleBook) => {
    setSelectedBook(book);
    setView("chapters");
  };

  const handleChapterClick = (chapter: number) => {
    setSelectedChapter(chapter);
    setView("verses");
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (view === "verses") setView("chapters");
    else if (view === "chapters") setView("books");
    else if (view === "search") setView("books");
  };

  return (
    <div className="min-h-screen pb-36 bg-[#09090B] text-[#FAFAFA]">
      {/* Dynamic Header */}
      <div className="sticky top-0 z-30 px-5 pt-12 pb-5 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {view !== "books" && (
              <button
                onClick={goBack}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <p className="text-[#C9A042] text-[10px] font-bold uppercase tracking-[4px]">
                {view === "books" ? "Scripture" : selectedBook?.name}
              </p>
              <h1 className="text-xl font-serif">
                {view === "books" && "The Holy Bible"}
                {view === "chapters" && "Select Chapter"}
                {view === "verses" && `Chapter ${selectedChapter}`}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="bg-[#18181B] border border-white/10 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-[#C9A042] focus:outline-none transition-all cursor-pointer"
            >
              {VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {view === "books" && (
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search chapters or verses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18181B] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#C9A042] transition-colors placeholder-slate-600"
            />
          </div>
        )}
      </div>

      <div className="px-5 mt-6">
        <AnimatePresence mode="wait">
          {/* Books View */}
          {view === "books" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500 mb-2">
                New Testament
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBookClick(book)}
                    className="glass rounded-[24px] p-4 flex items-center justify-between cursor-pointer group hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#C9A042]/10 flex items-center justify-center text-xl text-[#C9A042] group-hover:scale-110 transition-transform">
                        📖
                      </div>
                      <div>
                        <h3 className="font-bold text-[#FAFAFA]">
                          {book.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                          {book.chapters} Chapters · NT
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-white/10 group-hover:text-[#C9A042] transition-colors"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chapters View */}
          {view === "chapters" && selectedBook && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2"
            >
              {Array.from({ length: selectedBook.chapters }, (_, i) => (
                <motion.button
                  key={i + 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChapterClick(i + 1)}
                  className="aspect-square rounded-2xl bg-[#18181B] border border-white/5 flex items-center justify-center text-lg font-bold hover:border-[#C9A042] hover:text-[#C9A042] transition-all"
                >
                  {i + 1}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Verses View */}
          {view === "verses" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-8 pt-4"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-10 h-10 border-2 border-[#C9A042] border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Illuminating the Word
                  </p>
                </div>
              ) : (
                verses.map((v) => (
                  <motion.div
                    key={v.number}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setActiveVerse(v)}
                    className="relative group cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <span className="text-[#C9A042] font-serif font-bold text-sm mt-1 shrink-0">
                        {v.number}
                      </span>
                      <p className="text-lg leading-relaxed text-slate-200 font-medium selection:bg-[#C9A042]/30 transition-colors group-hover:text-white">
                        {v.text}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}

              {!loading && (
                <div className="pt-10 pb-5 border-t border-white/5 flex flex-col items-center text-center">
                  <div className="w-1.5 h-1.5 bg-[#C9A042] rounded-full mb-8 shadow-[0_0_10px_rgba(201,160,66,0.5)]" />
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[4px]">
                    End of Chapter
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Verse Action Modal */}
      <AnimatePresence>
        {activeVerse && selectedBook && selectedChapter && (
          <VerseActionModal
            verse={{
              book: selectedBook.name,
              chapter: selectedChapter,
              number: activeVerse.number,
              text: activeVerse.text,
              version: selectedVersion,
            }}
            onClose={() => setActiveVerse(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Verse of the Day (Only on Books view) */}
      {view === "books" && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-28 left-5 right-5 z-20"
        >
          <div className="glass rounded-[32px] p-6 border border-[#C9A042]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A042] opacity-[0.03] blur-3xl" />
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-[#C9A042]" />
              <span className="text-[10px] font-bold text-[#C9A042] uppercase tracking-[2px]">
                Verse of the Day
              </span>
            </div>
            <p className="text-sm font-serif italic text-slate-200 mb-3 leading-relaxed">
              "Every word of God is flawless; he is a shield to those who take
              refuge in him."
            </p>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest">
              PROVERBS 30:5 · NIV
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
