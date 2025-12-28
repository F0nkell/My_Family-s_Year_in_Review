
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FamilyMember } from '../constants';

interface FinalWishesProps {
  wish: string;
  members: FamilyMember[];
  onRestart: () => void;
}

const FlyingPigeon = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64">
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      {/* Тело */}
      <path d="M100 110 C 100 85, 150 85, 160 110 C 160 135, 140 145, 110 145 C 80 145, 70 135, 70 115" fill="#f8f9fa" stroke="#4a4a4a" strokeWidth="1.5" />
      <path d="M110 100 C 130 100, 155 110, 160 130 L 140 135 C 130 120, 110 115, 110 115 Z" fill="#b0b5b9" stroke="#4a4a4a" strokeWidth="1.5" />
      
      {/* Крыло верхнее (анимированное) */}
      <motion.path 
        d="M130 95 C 110 70, 100 50, 120 40 C 140 30, 160 50, 150 80 Z" 
        fill="#f8f9fa" 
        stroke="#4a4a4a" 
        strokeWidth="1.5"
        animate={{ d: [
          "M130 95 C 110 70, 100 50, 120 40 C 140 30, 160 50, 150 80 Z",
          "M130 95 C 120 85, 130 80, 145 75 C 160 70, 170 85, 150 95 Z"
        ]}}
        transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Голова */}
      <circle cx="85" cy="85" r="25" fill="#f8f9fa" stroke="#4a4a4a" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="2.5" fill="#000" />
      <path d="M72 82 L65 85 L72 88 Z" fill="#4a4a4a" />

      {/* Шапочка */}
      <path d="M65 75 C 65 55, 105 55, 105 75 L 105 82 L 65 82 Z" fill="#9ec1c1" stroke="#4a4a4a" strokeWidth="1.5" />
      <circle cx="85" cy="55" r="5" fill="#9ec1c1" stroke="#4a4a4a" strokeWidth="1.5" />

      {/* Шарфик */}
      <path d="M65 100 C 65 92, 110 92, 110 100 L 110 115 L 65 115 Z" fill="#fcf5e5" stroke="#4a4a4a" strokeWidth="1.5" />
      <motion.path 
        d="M110 105 C 130 100, 160 100, 175 105" 
        fill="none" 
        stroke="#fcf5e5" 
        strokeWidth="12" 
        strokeLinecap="round"
        animate={{ d: [
          "M110 105 C 130 100, 160 100, 175 105",
          "M110 105 C 130 110, 160 115, 175 120"
        ]}}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
      />
      
      {/* Лапки */}
      <path d="M100 145 L95 155 M115 145 L110 155" stroke="#e67e80" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

const FinalWishes: React.FC<FinalWishesProps> = ({ wish, members, onRestart }) => {
  const [step, setStep] = useState<'writing' | 'folding' | 'bird' | 'done'>('writing');
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(`January 1, ${now.getFullYear() + 1} 00:00:00`);
      const diff = target.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${d}д ${h}ч ${m}м ${s}с`);
    };
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
    setStep('folding');
    setTimeout(() => setStep('bird'), 2000);
    setTimeout(() => setStep('done'), 7500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full max-w-3xl mx-auto px-4 py-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'writing' && (
          <motion.div 
            key="paper"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0, scale: 0.8 }}
            className="paper-texture p-8 md:p-20 shadow-2xl w-full border border-slate-100 relative rounded-sm"
          >
            <h2 className="text-4xl md:text-5xl font-handwriting text-emerald-950 mb-10 border-b border-emerald-900/10 pb-4 tracking-tighter">
              Семейное письмо
            </h2>
            <p className="text-2xl md:text-3xl font-handwriting text-slate-700 leading-relaxed mb-16 italic">
              {wish}
            </p>
            <button
              onClick={handleSend}
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-6 rounded-sm shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-[0.4em] text-xs"
            >
              Передать голубю
            </button>
          </motion.div>
        )}

        {step === 'folding' && (
          <motion.div 
            key="folding"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-64 h-40 md:w-80 md:h-52 bg-white envelope-edge p-2 shadow-2xl flex items-center justify-center rounded-sm"
          >
            <div className="w-full h-full bg-white flex flex-col items-center justify-center border border-slate-100">
               <div className="text-emerald-900 font-serif text-2xl italic">2026</div>
               <div className="w-10 h-10 bg-red-700 rounded-full mt-4 flex items-center justify-center shadow-lg">
                  <div className="text-white">★</div>
               </div>
            </div>
          </motion.div>
        )}

        {step === 'bird' && (
          <motion.div 
            key="bird-flight"
            className="relative w-full h-[400px] flex items-center justify-center"
          >
            <motion.div
              initial={{ x: 1000, y: 0 }}
              animate={{ x: -1000, y: -100 }}
              transition={{ duration: 5.5, ease: "linear" }}
              className="relative flex items-center scale-x-[-1]"
            >
              <FlyingPigeon />
              {/* Конверт в клюве */}
              <div className="absolute top-[45%] right-[-5%] w-24 h-16 bg-white envelope-edge p-[2px] shadow-xl rotate-[15deg]">
                 <div className="w-full h-full bg-white flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-700 opacity-30"></div>
                 </div>
              </div>
            </motion.div>
            <div className="absolute bottom-0 text-emerald-900/40 font-serif italic text-2xl animate-pulse">
              Голубь улетает в Новый Год...
            </div>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div 
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-10 md:p-16 bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-2xl"
          >
            <div className="text-emerald-950 font-serif text-4xl md:text-6xl mb-8">Письмо в пути!</div>
            <p className="text-slate-600 mb-12 max-w-sm mx-auto text-lg leading-relaxed font-light">
              Ваш почтовый голубь уже пересекает границы времени. Конверт будет открыт ровно в полночь.
            </p>
            <div className="bg-emerald-900/5 p-12 rounded-2xl border border-emerald-900/10 mb-12">
              <div className="text-xs tracking-[0.4em] text-emerald-800 uppercase mb-4 font-bold">Осталось подождать:</div>
              <div className="text-4xl md:text-6xl font-serif text-emerald-950 tracking-tighter tabular-nums">{countdown}</div>
            </div>
            <button
              onClick={onRestart}
              className="text-xs tracking-[0.5em] uppercase text-emerald-900/40 hover:text-red-700 transition-colors font-black"
            >
              Вернуться в начало
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalWishes;
