import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Screen2() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [cycle, setCycle] = useState(0);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setCycle(c => c + 1);
    }, 4500);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 sm:gap-6 md:gap-10 w-full">
      <div className="text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 text-slate-900 dark:text-white">
          The whole transcript gets re-read, every single turn
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
          The model has no ongoing "train of thought." To reply to message 10, it must re-read messages 1 through 9 all over again, crunching the entire history into one giant block of text.
        </p>
      </div>

      <div className="w-full max-w-3xl relative h-[380px] sm:h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col items-center overflow-hidden">
        
        <div className="flex-1 w-full relative flex items-center justify-center">
          
          <AnimatePresence>
            {!isAnimating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute flex flex-col gap-2.5 sm:gap-3 w-64 sm:w-72"
              >
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={cn(
                    "h-9 sm:h-10 rounded-xl w-full flex items-center px-4 text-xs sm:text-sm font-medium shadow-sm",
                    i % 2 !== 0 ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 ml-4 sm:ml-6" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mr-4 sm:mr-6"
                  )}>
                    Message {i + (cycle * 2)}
                  </div>
                ))}
                <div className="h-9 sm:h-10 rounded-xl w-full bg-blue-600 text-white flex items-center px-4 text-xs sm:text-sm font-medium shadow-md ml-4 sm:ml-6 mt-1 sm:mt-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  <span className="relative z-10">New request {5 + (cycle * 2)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isAnimating && (
              <motion.div 
                className="absolute w-full h-full flex items-center justify-between px-1 sm:px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Tape */}
                <motion.div 
                  className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 sm:p-2 gap-1.5 sm:gap-2 overflow-hidden h-10 sm:h-14 items-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? "130px" : "220px", opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-slate-300 dark:bg-slate-700 rounded-md sm:rounded-lg shrink-0"></div>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-slate-400 dark:bg-slate-600 rounded-md sm:rounded-lg shrink-0"></div>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-slate-300 dark:bg-slate-700 rounded-md sm:rounded-lg shrink-0"></div>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-slate-400 dark:bg-slate-600 rounded-md sm:rounded-lg shrink-0"></div>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-blue-500 rounded-md sm:rounded-lg shrink-0"></div>
                </motion.div>

                {/* Feeding line */}
                <motion.div 
                  className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 mx-2 sm:mx-6 relative overflow-hidden rounded-full shrink-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.div 
                    className="absolute top-0 left-0 w-6 sm:w-12 h-full bg-blue-500 rounded-full"
                    animate={{ x: [0, 100] }}
                    transition={{ duration: 1.5, delay: 1, repeat: 1 }}
                  />
                </motion.div>

                {/* Model Box */}
                <motion.div 
                  className="w-16 h-16 sm:w-36 sm:h-36 bg-slate-900 dark:bg-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center relative z-10 shrink-0 shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.8 }}
                >
                  <span className="text-white dark:text-slate-900 font-bold tracking-widest text-[10px] sm:text-base uppercase">Model</span>
                  
                  <motion.div
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl border-[3px] sm:border-4 border-blue-500"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: [0, 1, 0], scale: 1.15 }}
                    transition={{ duration: 1, delay: 2, repeat: 1 }}
                  />
                </motion.div>

                {/* Output */}
                <motion.div 
                  className="ml-2 sm:ml-8 shrink-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3.2 }}
                >
                  <div className="px-2 py-1.5 sm:px-5 sm:py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg sm:rounded-2xl shadow-lg text-[10px] sm:text-base font-semibold border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    Reply {6 + (cycle * 2)}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <button 
          onClick={startAnimation}
          disabled={isAnimating}
          className="mt-4 sm:mt-8 flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-lg z-20 shrink-0"
        >
          {isAnimating ? 'Crunching data...' : 'Send next message'}
          <Play className={cn("w-4 h-4 sm:w-5 sm:h-5", isAnimating && "animate-pulse")} />
        </button>
      </div>
    </div>
  );
}
