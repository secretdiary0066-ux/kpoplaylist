/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Music, 
  Heart, 
  Smile, 
  Frown, 
  Zap, 
  Moon, 
  Sun, 
  Coffee, 
  PartyPopper, 
  Sparkles,
  RefreshCw,
  ChevronRight,
  Play
} from "lucide-react";
import { getKPopRecommendations, Song } from "./services/geminiService";

type Mood = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

const MOODS: Mood[] = [
  { id: "happy", label: "행복해요 (Happy)", icon: <Smile className="w-6 h-6" />, color: "bg-yellow-400" },
  { id: "sad", label: "슬퍼요 (Sad)", icon: <Frown className="w-6 h-6" />, color: "bg-blue-500" },
  { id: "energetic", label: "신나요 (Energetic)", icon: <Zap className="w-6 h-6" />, color: "bg-orange-500" },
  { id: "romantic", label: "사랑스러워요 (Romantic)", icon: <Heart className="w-6 h-6" />, color: "bg-pink-500" },
  { id: "chill", label: "편안해요 (Chill)", icon: <Coffee className="w-6 h-6" />, color: "bg-green-500" },
  { id: "gloomy", label: "우울해요 (Gloomy)", icon: <Moon className="w-6 h-6" />, color: "bg-indigo-600" },
  { id: "excited", label: "설레요 (Excited)", icon: <PartyPopper className="w-6 h-6" />, color: "bg-red-500" },
  { id: "dreamy", label: "몽환적이에요 (Dreamy)", icon: <Sparkles className="w-6 h-6" />, color: "bg-purple-500" },
  { id: "fresh", label: "상쾌해요 (Fresh)", icon: <Sun className="w-6 h-6" />, color: "bg-cyan-400" },
];

export default function App() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"select" | "result">("select");

  const toggleMood = (id: string) => {
    setSelectedMoods(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const generatePlaylist = async () => {
    if (selectedMoods.length === 0) return;
    
    setIsLoading(true);
    const recommendations = await getKPopRecommendations(selectedMoods);
    setPlaylist(recommendations);
    setIsLoading(false);
    setStep("result");
  };

  const reset = () => {
    setSelectedMoods([]);
    setPlaylist([]);
    setStep("select");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 max-w-4xl mx-auto">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music className="w-8 h-8 text-kpop-pink" />
          <h1 className="text-4xl md:text-5xl font-black gradient-text">K-Pop Mood</h1>
        </div>
        <p className="text-white/60 text-lg">당신의 감정에 딱 맞는 케이팝을 추천해드려요.</p>
      </motion.header>

      <main className="w-full flex-1">
        <AnimatePresence mode="wait">
          {step === "select" ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => toggleMood(mood.id)}
                    className={`
                      relative overflow-hidden p-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300
                      ${selectedMoods.includes(mood.id) 
                        ? "ring-2 ring-kpop-pink bg-white/10 scale-105" 
                        : "bg-white/5 hover:bg-white/10"}
                    `}
                  >
                    <div className={`p-3 rounded-full ${mood.color} text-white shadow-lg`}>
                      {mood.icon}
                    </div>
                    <span className="font-medium text-sm md:text-base">{mood.label}</span>
                    {selectedMoods.includes(mood.id) && (
                      <motion.div 
                        layoutId="check"
                        className="absolute top-2 right-2 w-2 h-2 rounded-full bg-kpop-pink"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={generatePlaylist}
                  disabled={selectedMoods.length === 0 || isLoading}
                  className="kpop-button-primary flex items-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      플레이리스트 생성 중...
                    </>
                  ) : (
                    <>
                      추천 받기
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="text-kpop-blue" />
                  당신을 위한 플레이리스트
                </h2>
                <button 
                  onClick={reset}
                  className="kpop-button-secondary flex items-center gap-2 py-2 px-4 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 하기
                </button>
              </div>

              <div className="space-y-4">
                {playlist.map((song, index) => (
                  <motion.div
                    key={`${song.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-5 flex items-center gap-4 group hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-kpop-pink/20 to-kpop-blue/20 flex items-center justify-center text-kpop-pink group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{song.title}</h3>
                      <p className="text-white/60 text-sm truncate">{song.artist}</p>
                    </div>
                    <div className="hidden md:block text-right max-w-[200px]">
                      <span className="inline-block px-2 py-1 rounded-md bg-white/5 text-[10px] uppercase tracking-wider text-kpop-blue mb-1">
                        {song.mood}
                      </span>
                      <p className="text-xs text-white/40 italic line-clamp-1">{song.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {playlist.length === 0 && !isLoading && (
                <div className="text-center py-12 glass-card">
                  <p className="text-white/60">추천 결과가 없습니다. 다시 시도해주세요.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-white/20 text-xs text-center">
        Powered by Gemini AI • K-Pop Mood Playlist
      </footer>
    </div>
  );
}

