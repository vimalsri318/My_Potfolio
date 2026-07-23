import { useState } from 'react';

export default function Screen3() {
  const [turns, setTurns] = useState(7);

  // Calculate attention weight (0 to 1) based on position
  const getWeight = (index: number, total: number) => {
    if (index === 0) return 1; // System prompt / first message
    if (index >= total - 2) return 1; // Recency bias
    
    // Middle items drop off sharply
    const distanceToEnds = Math.min(index, total - 1 - index);
    const dipFactor = Math.max(0.05, 1 - (distanceToEnds / (total / 2)) * 0.95);
    return dipFactor;
  };

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 sm:gap-6 md:gap-10 w-full">
      <div className="text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 text-slate-900 dark:text-white">
          Lost in the middle
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
          Even though the model reads the whole transcript, it suffers from "attention bias." It strongly weighs the very beginning and the very end, but often ignores things buried in the middle.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2rem] p-6 pb-10 md:p-10 md:pb-16 shadow-xl flex flex-col items-center">
        
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-8 md:mb-16 gap-4 md:gap-6">
          <label className="text-base font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            Conversation length: {turns} turns
          </label>
          <input 
            type="range" 
            min="3" 
            max="20" 
            value={turns} 
            onChange={(e) => setTurns(Number(e.target.value))}
            className="w-full max-w-lg accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
        </div>

        <div className="relative w-full h-[200px] md:h-[400px] flex flex-col justify-between">
          
          <div className="flex justify-between items-center w-full z-10 relative">
            {Array.from({ length: turns }).map((_, i) => {
              const weight = getWeight(i, turns);
              return (
                <div 
                  key={i} 
                  className="flex flex-col items-center gap-3 group relative"
                  style={{ width: `${100/turns}%` }}
                >
                  <div 
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-10 md:h-10 rounded-sm sm:rounded-md md:rounded-xl transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700/50"
                    style={{ 
                      backgroundColor: `rgba(37, 99, 235, ${Math.max(0.1, weight)})`,
                      transform: `scale(${Math.max(0.6, weight)})`,
                      borderColor: `rgba(37, 99, 235, ${Math.max(0.2, weight + 0.2)})`
                    }}
                  />
                  {turns <= 12 && (
                    <span className="text-[9px] sm:text-[11px] md:text-sm font-medium text-slate-500 absolute -top-6 md:-top-8">
                      T{i+1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
            {Array.from({ length: turns }).map((_, i) => {
              const weight = getWeight(i, turns);
              const xPercent = (i + 0.5) * (100 / turns);
              
              return (
                <line 
                  key={`line-${i}`}
                  x1={`${xPercent}%`} 
                  y1="48px" 
                  x2="50%" 
                  y2="calc(100% - 64px)" 
                  stroke="currentColor"
                  className="text-blue-500 transition-all duration-300"
                  strokeWidth={Math.max(1.5, weight * 8)}
                  strokeOpacity={Math.max(0.05, weight * 0.8)}
                />
              );
            })}
          </svg>

          <div className="flex justify-center w-full z-10 relative mt-auto">
            <div className="px-4 py-2 md:px-8 md:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl md:rounded-2xl font-bold shadow-xl text-sm md:text-lg border-2 border-slate-800 dark:border-slate-200">
              Current Message
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl text-slate-600 dark:text-slate-400 text-sm md:text-base bg-slate-100 dark:bg-slate-800/60 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60">
        <span className="font-semibold block mb-1">Line thickness = Attention weight</span>
        Turns in the middle get the least attention — even if they contained your most important instructions. They are mathematically deprioritized compared to the newest inputs.
      </div>
    </div>
  );
}
