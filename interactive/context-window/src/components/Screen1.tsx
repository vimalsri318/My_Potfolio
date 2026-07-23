import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Screen1() {
  const [turns, setTurns] = useState<number>(3);
  const maxTurns = 15;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  const addTurn = () => {
    if (turns < maxTurns) setTurns(t => t + 1);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 sm:gap-6 md:gap-10 w-full">
      <div className="text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 text-slate-900 dark:text-white">
          There's no real memory, just a growing transcript
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
          When you chat with an AI, it doesn't remember your past messages like a human does. 
          Instead, the app copies everything said so far and pastes it into every new request.
        </p>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[400px] sm:h-[500px]">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-center text-sm font-medium text-slate-500 flex justify-between items-center">
          <span>Under the hood</span>
          <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md">{turns} turns</span>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scroll-smooth">
          <AnimatePresence initial={false}>
            {Array.from({ length: turns }).map((_, i) => {
              const isUser = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "px-4 py-3 rounded-2xl max-w-[85%] text-base shadow-sm",
                    isUser 
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-br-sm self-end" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm self-start"
                  )}
                >
                  {isUser ? `User message ${Math.floor(i/2) + 1}` : `AI reply ${Math.floor(i/2) + 1}`}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button 
            onClick={addTurn}
            disabled={turns >= maxTurns}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add a turn ({turns}/{maxTurns})
          </button>
        </div>
      </div>

      <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 rounded-2xl text-center max-w-2xl border border-slate-200 dark:border-slate-800/80 text-sm md:text-base">
        <span className="font-bold text-slate-900 dark:text-white block mb-1">Live payload size: ~{turns * 150} tokens</span>
        Every time you send a message, ALL of this gets resent to the model — from scratch.
      </div>
    </div>
  );
}
