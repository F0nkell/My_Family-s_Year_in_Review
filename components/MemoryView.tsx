import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '../constants';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MemoryViewProps {
  memory: Memory;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
}

const MemoryView: React.FC<MemoryViewProps> = ({ memory, onNext, onBack, isFirst, isLast, progress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [memory.id]);

  const handleScreenClick = (e: React.MouseEvent) => {
    const width = window.innerWidth;
    const x = e.clientX;
    
    if (isExpanded) return;

    if (x < width * 0.2) {
      onBack();
      return;
    }
    
    if (x > width * 0.8) {
      onNext();
      return;
    }

    setIsExpanded(true);
  };

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-black select-none">
      
      {/* --- СЛОЙ 1: Медиа (Умное отображение) --- */}
      <div 
        className="absolute inset-0 z-0 cursor-pointer flex items-center justify-center overflow-hidden"
        onClick={handleScreenClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={memory.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* 1.1 ЗАДНИЙ ФОН (Размытый и растянутый) */}
            <div className="absolute inset-0 z-0">
               {memory.type === 'video' ? (
                 <video
                   src={memory.source}
                   className="w-full h-full object-cover blur-2xl scale-110 opacity-60 brightness-50"
                   autoPlay muted loop playsInline
                 />
               ) : (
                 <img 
                   src={memory.source} 
                   className="w-full h-full object-cover blur-2xl scale-110 opacity-60 brightness-50"
                   alt="bg"
                 />
               )}
            </div>

            {/* 1.2 ПЕРЕДНИЙ ПЛАН (Целиком, с сохранением пропорций) */}
            <div className="relative z-10 w-full h-full max-w-[100%] max-h-[100%] p-0 md:p-4 flex items-center justify-center">
              {memory.type === 'video' ? (
                <motion.video
                  src={memory.source}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                  autoPlay muted loop playsInline
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.img 
                  src={memory.source} 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                  alt={memory.title}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>

            {/* Затемнение только в самом низу для текста, чтобы не перекрывать фото */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-20"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- СЛОЙ 2: Индикатор прогресса --- */}
      <div className="absolute top-4 left-0 w-full px-4 z-30 flex gap-1">
        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
           <motion.div 
             className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
             animate={{ width: `${progress}%` }}
             transition={{ duration: 0.3 }}
           />
        </div>
      </div>

      {/* --- СЛОЙ 3: Заголовок и Стрелка --- */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 w-full p-8 pb-12 z-30 flex flex-col items-center text-center cursor-pointer pointer-events-none"
          >
            <h2 className="text-white font-serif text-2xl md:text-4xl mb-3 drop-shadow-lg tracking-wide">
              {memory.title}
            </h2>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-white/90"
            >
              <ChevronUp size={36} strokeWidth={2} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- СЛОЙ 4: Панель с текстом --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-40 bg-[#fdfbf7] text-emerald-950 flex flex-col"
          >
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors z-50"
            >
              <ChevronDown size={24} className="text-black/60" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-20 text-center overflow-y-auto">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-8 mx-auto shrink-0"></div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-3xl md:text-5xl mb-6 text-emerald-900 shrink-0"
              >
                {memory.title}
              </motion.h2>

              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-0.5 bg-red-700 mb-8 shrink-0"
              />

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="overflow-y-auto px-2 mb-6 max-h-[40vh]"
              >
                <p className="text-lg md:text-xl font-light leading-relaxed text-slate-700 italic font-serif">
                  {memory.description}
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="mt-auto px-8 py-4 bg-emerald-900 text-white rounded-full text-xs uppercase tracking-[0.2em] hover:bg-emerald-800 transition-transform active:scale-95 shadow-xl shrink-0"
              >
                {isLast ? 'Завершить' : 'Далее'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MemoryView;