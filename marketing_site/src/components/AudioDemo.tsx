import React, { useState } from "react";
import { Play, Pause } from "lucide-react";

const tracks = [
  { id: 1, title: "Morning Prayer", duration: "2:30" },
  { id: 2, title: "Meditation", duration: "5:45" },
  { id: 3, title: "Evening Reflection", duration: "3:15" },
];

export const AudioDemo: React.FC = () => {
  const [playing, setPlaying] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    if (playing === id) {
      setPlaying(null);
    } else {
      setPlaying(id);
    }
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Audio Experience
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                playing === track.id
                  ? "bg-blue-900/30 border border-blue-500/50"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => togglePlay(track.id)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  {playing === track.id ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} />
                  )}
                </button>
                <div>
                  <h3 className="font-semibold text-lg">{track.title}</h3>
                  <p className="text-sm text-gray-400">Cinematic Audio</p>
                </div>
              </div>
              <span className="text-gray-400 font-mono">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
