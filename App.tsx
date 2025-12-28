
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEMORIES, FAMILY_MEMBERS, FINAL_WISH } from './constants';
import MemoryView from './components/MemoryView';
import FinalWishes from './components/FinalWishes';
import { TreePine, Snowflake, Cookie } from 'lucide-react';

const Snowfall = () => {
  const [flakes] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 20 + Math.random() * 15,
    size: 3 + Math.random() * 5
  })));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {flakes.map(flake => (
        <motion.div
          key={flake.id}
          initial={{ top: -20, left: flake.left, opacity: 0 }}
          animate={{ 
            top: '105vh', 
            opacity: [0, 0.8, 0.8, 0], 
            x: [0, 30, -30, 0],
            rotate: 360
          }}
          transition={{ duration: flake.duration, repeat: Infinity, delay: flake.delay, ease: "linear" }}
          style={{ width: flake.size, height: flake.size }}
          className="absolute bg-white rounded-full blur-[0.5px]"
        />
      ))}
    </div>
  );
};

const HolidayDecor = () => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {/* Еловые ветки - адаптивные размеры */}
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-16 -left-16 text-emerald-900/10 rotate-[135deg]">
      <TreePine size={240} strokeWidth={0.5} className="md:w-[400px] md:h-[400px]" />
    </motion.div>
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-16 -right-16 text-emerald-900/10 -rotate-[135deg]">
      <TreePine size={240} strokeWidth={0.5} className="md:w-[400px] md:h-[400px]" />
    </motion.div>
    
    {/* Мандаринки */}
    <motion.div 
      animate={{ rotate: [0, 8, -8, 0], y: [0, 5, 0] }} 
      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      className="absolute bottom-6 right-6 md:bottom-12 md:right-12 w-12 h-12 md:w-20 md:h-20 bg-orange-500 rounded-full shadow-lg border-b-4 border-orange-600 flex items-center justify-center"
    >
      <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-emerald-900/40 rounded-full mb-10 md:mb-16"></div>
      <div className="absolute inset-0 bg-white/10 rounded-full"></div>
    </motion.div>
    
    {/* Снеговик */}
    <div className="absolute bottom-6 left-6 opacity-30 scale-75 md:scale-100">
       <div className="w-12 h-12 bg-white rounded-full border border-slate-100 shadow-sm"></div>
       <div className="w-10 h-10 bg-white rounded-full -mt-3 mx-auto border border-slate-100 shadow-sm"></div>
       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mx-auto relative -top-5 left-1"></div>
    </div>
  </div>
);

type AppState = 'hero' | 'year-selection' | 'memories' | 'final';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('hero');
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);

  useEffect(() => {
    if (view === 'hero') {
      const timer = setTimeout(() => setView('year-selection'), 3000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden selection:bg-red-100 bg-[#fafafa]">
      <Snowfall />
      <HolidayDecor />
      
      <AnimatePresence mode="wait">
        {view === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            className="z-20 text-center px-6"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotate: -20 }} 
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="mb-6 inline-block"
            >
               < Snowflake size={48} className="text-emerald-800/60 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-serif text-emerald-950 mb-4 tracking-tight">
              Итоги 2025
            </h1>
            <p className="text-red-800 font-handwriting text-2xl md:text-4xl italic opacity-80">Наша семейная история</p>
          </motion.div>
        )}

        {view === 'year-selection' && (
          <motion.div
            key="year-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="z-20 flex flex-col items-center px-4"
          >
            <div className="text-[9px] md:text-[10px] tracking-[0.6em] uppercase text-emerald-900/50 mb-10 font-bold text-center">Открой книгу воспоминаний</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('memories')}
              className="bg-white p-3 md:p-4 rounded-2xl shadow-2xl border-b-4 md:border-b-8 border-red-800 group relative"
            >
              <div className="bg-emerald-950 p-10 md:p-16 rounded-xl w-52 h-72 md:w-64 md:h-80 flex flex-col items-center justify-center text-white relative overflow-hidden transition-colors group-hover:bg-emerald-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30"></div>
                <div className="text-5xl md:text-6xl font-serif text-white mb-2 z-10 drop-shadow-md">2025</div>
                <div className="text-[8px] md:text-[10px] tracking-[0.4em] text-emerald-400 font-bold z-10 opacity-70">НАША КНИГА</div>
                <div className="mt-8 text-red-500 z-10 animate-bounce">
                   {/* Removed non-existent md:size prop which was causing a TypeScript error */}
                   <Cookie size={32} />
                </div>
              </div>
              {/* Закладка */}
              <div className="absolute top-0 right-8 w-4 h-12 md:w-6 md:h-16 bg-red-700 rounded-b-lg shadow-sm"></div>
            </motion.button>
          </motion.div>
        )}

        {view === 'memories' && (
          <motion.div key="memories-container" className="z-20 w-full h-full flex items-center justify-center">
            <MemoryView 
              memory={MEMORIES[currentMemoryIndex]} 
              onNext={() => currentMemoryIndex < MEMORIES.length - 1 ? setCurrentMemoryIndex(v => v + 1) : setView('final')}
              onBack={() => currentMemoryIndex > 0 ? setCurrentMemoryIndex(v => v - 1) : setView('year-selection')}
              isFirst={currentMemoryIndex === 0}
              isLast={currentMemoryIndex === MEMORIES.length - 1}
              progress={((currentMemoryIndex + 1) / MEMORIES.length) * 100}
            />
          </motion.div>
        )}

        {view === 'final' && (
          <motion.div key="final" className="z-20 w-full flex items-center justify-center">
            <FinalWishes 
              wish={FINAL_WISH} 
              members={FAMILY_MEMBERS} 
              onRestart={() => { setCurrentMemoryIndex(0); setView('year-selection'); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
