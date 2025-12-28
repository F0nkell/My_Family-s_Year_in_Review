import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory, LayoutType } from '../constants';

interface MemoryViewProps {
  memory: Memory;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
}

const LayoutWrapper: React.FC<{ layout: LayoutType; children: React.ReactNode }> = ({ layout, children }) => {
  const styles: Record<LayoutType, string> = {
    'bottom-left': 'absolute bottom-6 left-6 md:bottom-12 md:left-12 text-left',
    'top-right': 'absolute top-6 right-6 md:top-12 md:right-12 text-right',
    'centered-float': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
    'side-strip': 'absolute top-0 right-0 h-full w-full md:w-1/3 flex items-center bg-white/95 md:bg-white/95 p-6 md:p-12 text-left border-l border-emerald-900/10'
  };
  
  const responsiveBase = "z-30 w-[calc(100%-3rem)] md:max-w-lg pointer-events-none";
  
  return <div className={`${responsiveBase} ${styles[layout]}`}>{children}</div>;
};

const MemoryView: React.FC<MemoryViewProps> = ({ memory, onNext, onBack, isFirst, isLast, progress }) => {
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    setShowDescription(false);
    const timer = setTimeout(() => setShowDescription(true), 600);
    return () => clearTimeout(timer);
  }, [memory.id]);

  const handleScreenClick = (e: React.MouseEvent) => {
    const x = e.clientX;
    const width = window.innerWidth;
    if (x < width / 2) {
      onBack();
    } else {
      onNext();
    }
  };

  return (
    <div 
      className="w-full h-[100dvh] flex flex-col items-center justify-center p-4 relative cursor-pointer select-none"
      onClick={handleScreenClick}
    >
      {/* Подсказки для навигации */}
      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed inset-0 pointer-events-none flex justify-between px-10 items-center z-50 text-emerald-900/20 text-xs tracking-widest uppercase font-bold"
      >
        <div className="md:block hidden">← Назад</div>
        <div className="md:block hidden">Вперед →</div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, scale: 0.8, rotateY: 30, z: -100 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
          exit={{ opacity: 0, scale: 1.1, rotateY: -30, z: 100 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8 
          }}
          className="relative w-full max-w-5xl aspect-[4/5] md:aspect-[16/10] bg-white p-2 md:p-4 rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] overflow-hidden preserve-3d"
        >
          <div className="w-full h-full relative overflow-hidden rounded-2xl border border-slate-100 bg-black/5">
            {memory.type === 'video' ? (
              <motion.video
                src={memory.source}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
              />
            ) : (
              <motion.img 
                src={memory.source} 
                className="w-full h-full object-cover grayscale-[0.1]"
                animate={{ 
                  scale: [1, 1.05, 1],
                  x: [0, 10, -10, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-none"></div>
            {/* Иней по краям */}
            <div className="absolute inset-0 pointer-events-none border-[10px] md:border-[20px] border-white/10 blur-sm"></div>
          </div>

          <AnimatePresence>
            {showDescription && (
              <LayoutWrapper layout={memory.layout}>
                <motion.div
                  initial={{ x: 50, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ x: -50, opacity: 0 }}
                  className="bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-2xl border-t-8 border-red-700 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-50/50 -rotate-45 translate-x-10 -translate-y-10"></div>
                  <h3 className="text-2xl md:text-4xl font-serif text-emerald-950 mb-3 md:mb-5 leading-tight">{memory.title}</h3>
                  <p className="text-slate-700 font-light leading-relaxed mb-6 md:mb-8 text-sm md:text-lg italic">
                    {memory.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="font-handwriting text-3xl md:text-4xl text-emerald-800">#{memory.id}</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">Листай дальше</div>
                  </div>
                </motion.div>
              </LayoutWrapper>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-8 md:bottom-12 w-full max-w-4xl px-8 z-40 pointer-events-none">
        <div className="flex flex-col items-center space-y-5">
          <div className="w-full h-1.5 bg-slate-200/40 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              className="h-full bg-gradient-to-r from-red-800 to-red-600 shadow-[0_0_15px_rgba(185,28,28,0.4)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "circOut" }}
            />
          </div>
          <div className="font-serif italic text-sm md:text-base text-emerald-950/60 bg-white/60 px-5 py-1.5 rounded-full border border-white/80">
            {memory.id} из 10
          </div>
        </div>
      </div>
      
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};

export default MemoryView;