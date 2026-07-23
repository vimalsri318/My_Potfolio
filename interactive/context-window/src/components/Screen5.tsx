import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { MessageSquare, FileText, Cpu, Image as ImageIcon, ArrowRight, RefreshCcw } from 'lucide-react';

export default function Screen5() {
  const [isMulti, setIsMulti] = useState(false);
  const [step, setStep] = useState(0); 
  const [iteration, setIteration] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      if (step < 4) {
        timer = setTimeout(() => setStep(s => s + 1), 700);
      } else {
        if (isMulti && iteration < 2) {
          timer = setTimeout(() => {
            setStep(0);
            setIteration(i => i + 1);
          }, 1200);
        } else {
          timer = setTimeout(() => setIsPlaying(false), 500);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [step, isPlaying, isMulti, iteration]);

  const startFlow = () => {
    setStep(0);
    setIteration(0);
    setIsPlaying(true);
  };

  const getBoxStyle = (iter: number) => {
    switch (iter) {
      case 0: return { bg: "bg-blue-100 dark:bg-blue-900/60", border: "border-blue-400 dark:border-blue-500", text: "text-blue-800 dark:text-blue-200" };
      case 1: return { bg: "bg-purple-100 dark:bg-purple-900/60", border: "border-purple-400 dark:border-purple-500", text: "text-purple-800 dark:text-purple-200" };
      case 2: return { bg: "bg-orange-100 dark:bg-orange-900/60", border: "border-orange-400 dark:border-orange-500", text: "text-orange-800 dark:text-orange-200" };
      default: return { bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-600", text: "text-slate-700 dark:text-slate-300" };
    }
  };

  const currentStyle = getBoxStyle(iteration);

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 sm:gap-6 md:gap-10 w-full">
      <div className="text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 text-slate-900 dark:text-white">
          Why image generation breaks even faster
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
          Chatbots can't actually edit images. When you ask to "change the background," it has to write a brand new prompt and generate a brand new image from scratch.
        </p>
      </div>

      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-14 shadow-xl">
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-8 md:mb-16">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner w-full sm:w-auto">
            <button 
              onClick={() => { setIsMulti(false); setIsPlaying(false); setStep(0); setIteration(0); }}
              className={cn("flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all", !isMulti ? "bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
            >
              Single request
            </button>
            <button 
              onClick={() => { setIsMulti(true); setIsPlaying(false); setStep(0); setIteration(0); }}
              className={cn("flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all", isMulti ? "bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
            >
              Multi-step edit
            </button>
          </div>
          
          <button 
            onClick={startFlow}
            disabled={isPlaying}
            className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full font-bold transition-all shadow-lg text-sm sm:text-base active:scale-95 w-full sm:w-auto"
          >
            <RefreshCcw className={cn("w-5 h-5", isPlaying && "animate-spin")} />
            {isPlaying ? 'Running Simulation...' : 'Run Simulation'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full h-auto md:h-[250px]">
          
          <div className="flex-1 flex flex-row md:flex-col items-center gap-4 w-full md:w-auto">
            <div className={cn("w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500", step >= 1 ? "bg-slate-800 text-white shadow-lg scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
              <MessageSquare className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <span className={cn("text-sm md:text-base font-bold transition-colors flex-1 md:flex-none text-left md:text-center", step >= 1 ? "text-slate-900 dark:text-white" : "text-slate-400")}>
              1. Chat History
            </span>
          </div>

          <ArrowRight className={cn("w-6 h-6 md:w-8 md:h-8 hidden md:block transition-colors", step >= 2 ? "text-blue-500" : "text-slate-200 dark:text-slate-700")} />

          <div className="flex-1 flex flex-row md:flex-col items-center gap-4 relative w-full md:w-auto">
            <div className={cn("w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 z-10 relative", step >= 2 ? `${currentStyle.bg} ${currentStyle.text} border-[3px] ${currentStyle.border} shadow-lg scale-110` : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
              <FileText className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <span className={cn("text-sm md:text-base font-bold transition-colors flex-1 md:flex-none text-left md:text-center", step >= 2 ? "text-slate-900 dark:text-white" : "text-slate-400")}>
              2. New Prompt Guess
            </span>
          </div>

          <ArrowRight className={cn("w-6 h-6 md:w-8 md:h-8 hidden md:block transition-colors", step >= 3 ? "text-blue-500" : "text-slate-200 dark:text-slate-700")} />

          <div className="flex-1 flex flex-row md:flex-col items-center gap-4 relative w-full md:w-auto">
            <div className={cn("w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 z-10", step >= 3 ? "bg-indigo-600 text-white shadow-xl scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
              <Cpu className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <span className={cn("text-sm md:text-base font-bold transition-colors flex-1 md:flex-none text-left md:text-center", step >= 3 ? "text-slate-900 dark:text-white" : "text-slate-400")}>
              3. Image Model
            </span>
          </div>

          <ArrowRight className={cn("w-6 h-6 md:w-8 md:h-8 hidden md:block transition-colors", step >= 4 ? "text-blue-500" : "text-slate-200 dark:text-slate-700")} />

          <div className="flex-1 flex flex-row md:flex-col items-center gap-4 w-full md:w-auto">
            <div className="relative shrink-0">
              <AnimatePresence>
                {step >= 4 && iteration > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.6, scale: 1, rotate: -8, x: -10, y: 3 }}
                    className="absolute inset-0 bg-blue-300 dark:bg-blue-600 rounded-2xl md:rounded-3xl z-0 shadow-sm border border-blue-400"
                  />
                )}
                {step >= 4 && iteration > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.6, scale: 1, rotate: 8, x: 10, y: -3 }}
                    className="absolute inset-0 bg-purple-300 dark:bg-purple-600 rounded-2xl md:rounded-3xl z-0 shadow-sm border border-purple-400"
                  />
                )}
              </AnimatePresence>
              
              <div className={cn(
                "w-16 h-16 md:w-28 md:h-28 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 z-10 relative", 
                step >= 4 ? `${currentStyle.bg} border-[3px] md:border-4 ${currentStyle.border} ${currentStyle.text} shadow-2xl scale-110` : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              )}>
                <ImageIcon className="w-8 h-8 md:w-12 md:h-12" />
              </div>
            </div>
            
            <div className="flex flex-col md:items-center mt-0 md:mt-2 flex-1 md:flex-none text-left md:text-center justify-center">
              <span className={cn("text-sm md:text-base font-bold transition-colors", step >= 4 ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                4. Brand New Image
              </span>
              {isMulti && step >= 4 && (
                <span className="text-[10px] md:text-sm text-slate-500 font-semibold mt-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 md:px-3 md:py-1 rounded-full self-start md:self-center">Generation {iteration + 1} of 3</span>
              )}
            </div>
          </div>

        </div>

      </div>

      <div className="px-4 py-3 md:px-8 md:py-5 bg-orange-50 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200 rounded-2xl text-center max-w-3xl border border-orange-200 dark:border-orange-800/50 text-sm md:text-lg font-medium shadow-sm">
        There is no shared file being edited. Each image is repainted from a re-guessed prompt — so small ambiguities compound fast, leading to unintended changes.
      </div>
    </div>
  );
}
