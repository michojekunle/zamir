"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, ChevronRight, Bookmark } from "lucide-react";

const books = [
  { name: "Genesis", chapters: 50, testament: "OT" },
  { name: "Psalms", chapters: 150, testament: "OT" },
  { name: "Proverbs", chapters: 31, testament: "OT" },
  { name: "Isaiah", chapters: 66, testament: "OT" },
  { name: "Matthew", chapters: 28, testament: "NT" },
  { name: "John", chapters: 21, testament: "NT" },
  { name: "Romans", chapters: 16, testament: "NT" },
  { name: "Ephesians", chapters: 6, testament: "NT" },
  { name: "Philippians", chapters: 4, testament: "NT" },
  { name: "Revelation", chapters: 22, testament: "NT" },
];

const bookColors: Record<string, string> = {
  Genesis: "#C9A042",
  Psalms: "#3B82F6",
  Proverbs: "#10B981",
  Isaiah: "#8B5CF6",
  Matthew: "#EC4899",
  John: "#E6C57A",
  Romans: "#F59E0B",
  Ephesians: "#06B6D4",
  Philippians: "#14B8A6",
  Revelation: "#EF4444",
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function BiblePage() {
  const [query, setQuery] = useState("");
  const [bookmarked, setBookmarked] = useState<string[]>(["Psalms", "John"]);

  const filtered = books.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  const toggleBookmark = (name: string) =>
    setBookmarked((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name],
    );

  return (
    <div className="min-h-screen pb-36 overflow-y-auto scrollbar-none">
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-5"
        style={{
          background: "rgba(15,27,46,0.9)",
          backdropFilter: "blur(20px)",
        }}
      >
        <p className="text-[#C9A042] text-xs font-bold uppercase tracking-[3px] mb-1">
          Scripture
        </p>
        <h1 className="text-2xl font-serif text-[#F7F3EC] mb-4">
          The Holy Bible
        </h1>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#1A263C] border border-[#2B3B54] rounded-2xl py-3 pl-11 pr-4 text-sm text-[#F7F3EC] focus:outline-none focus:border-[#C9A042] transition-colors placeholder-slate-600"
          />
        </div>
      </div>

      <div className="px-5 mt-2 space-y-6">
        {/* Bookmarked */}
        {bookmarked.length > 0 && !query && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Bookmarked
            </h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
              {bookmarked.map((name) => {
                const book = books.find((b) => b.name === name)!;
                const color = bookColors[name] || "#C9A042";
                return (
                  <motion.div
                    key={name}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 w-28 h-28 rounded-[20px] flex flex-col items-center justify-center gap-2 glass cursor-pointer"
                    style={{ border: `1px solid ${color}40` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${color}22` }}
                    >
                      📖
                    </div>
                    <span className="text-[#F7F3EC] text-sm font-bold">
                      {name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {book.chapters} ch
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Books list */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {query ? `Results (${filtered.length})` : "All Books"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={query}
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {filtered.map((book) => {
                const color = bookColors[book.name] || "#C9A042";
                const isMarked = bookmarked.includes(book.name);
                return (
                  <motion.div
                    key={book.name}
                    variants={item}
                    whileTap={{ scale: 0.98 }}
                    className="glass rounded-[20px] p-4 flex items-center gap-4 cursor-pointer hover:border-[#2B3B54] transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ background: `${color}22` }}
                    >
                      📖
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#F7F3EC]">{book.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {book.chapters} chapters ·{" "}
                        {book.testament === "OT"
                          ? "Old Testament"
                          : "New Testament"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(book.name);
                        }}
                        whileTap={{ scale: 0.8 }}
                      >
                        <Bookmark
                          size={18}
                          fill={isMarked ? color : "none"}
                          style={{ color: isMarked ? color : "#4B6080" }}
                        />
                      </motion.button>
                      <ChevronRight size={16} className="text-[#2B3B54]" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
