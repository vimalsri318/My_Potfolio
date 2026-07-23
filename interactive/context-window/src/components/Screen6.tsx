import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Screen6() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 sm:gap-6 md:gap-10 w-full">
      <div className="text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 text-slate-900 dark:text-white">
          The concrete example: a 3-slide LinkedIn post
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
          Here is what happens when you try to generate a consistent multi-slide carousel in a single long conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl mt-4">
        
        <div className="flex flex-row md:flex-col gap-4 md:gap-6">
          <div className="w-1/3 md:w-full aspect-square bg-slate-950 rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col justify-center items-center shadow-xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="text-emerald-400 font-bold text-lg md:text-3xl mb-1 md:mb-3 tracking-widest uppercase">Launch</div>
            <div className="w-10 md:w-20 h-1 md:h-1.5 bg-emerald-400 rounded-full mb-2 md:mb-6"></div>
            <p className="text-slate-300 text-center text-xs md:text-base px-1 md:px-4 hidden sm:block">Clean, corporate typography. Perfect contrast.</p>
          </div>
          <div className="w-2/3 md:w-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/60 p-4 md:p-5 rounded-2xl flex-1 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm md:text-base mb-1 md:mb-2">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> Slide 1
            </div>
            <p className="text-xs md:text-base text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">Correct — first generation, least accumulated drift.</p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-4 md:gap-6">
          <div className="w-1/3 md:w-full aspect-square bg-slate-900 rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col justify-center items-center shadow-xl border border-slate-700 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="absolute top-2 left-2 md:top-6 md:left-6 text-emerald-400/20 font-bold text-sm md:text-2xl uppercase transform -rotate-12 blur-[2px] select-none pointer-events-none">Launch</div>
            
            <div className="text-blue-400 font-bold text-lg md:text-3xl mb-1 md:mb-3 tracking-widest uppercase z-10">Features</div>
            <div className="w-12 md:w-24 h-1 md:h-1.5 bg-blue-400 rounded-full mb-2 md:mb-6 z-10"></div>
            <p className="text-slate-300 text-center text-xs md:text-base px-1 md:px-4 z-10 hidden sm:block">Layout shifted slightly. Previous text hallucinated into background.</p>
          </div>
          <div className="w-2/3 md:w-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/60 p-4 md:p-5 rounded-2xl flex-1 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500 font-bold text-sm md:text-base mb-1 md:mb-2">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" /> Slide 2
            </div>
            <p className="text-xs md:text-base text-amber-800/90 dark:text-amber-300/90 leading-relaxed">Content from Slide 1 leaks in — the model still "remembers" what it just made.</p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-4 md:gap-6">
          <div className="w-1/3 md:w-full aspect-square bg-indigo-100 dark:bg-indigo-950 rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col justify-center items-center shadow-xl border border-indigo-200 dark:border-indigo-800 relative overflow-hidden group hover:border-red-500/50 transition-colors">
            <div className="text-indigo-900 dark:text-indigo-200 font-serif text-xl md:text-4xl mb-2 md:mb-6 italic">Pricing</div>
            <div className="w-full h-px bg-indigo-300 dark:bg-indigo-700 mb-2 md:mb-6"></div>
            <p className="text-indigo-800 dark:text-indigo-300 text-center font-serif text-xs md:text-lg px-1 md:px-4 hidden sm:block">A completely different aesthetic. Brand guidelines forgotten.</p>
          </div>
          <div className="w-2/3 md:w-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/60 p-4 md:p-5 rounded-2xl flex-1 shadow-sm">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm md:text-base mb-1 md:mb-2">
              <XCircle className="w-4 h-4 md:w-5 md:h-5" /> Slide 3
            </div>
            <p className="text-xs md:text-base text-red-800/90 dark:text-red-300/90 leading-relaxed">Drifts to a new theme — original instructions are now in the "lost middle" zone.</p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-lg mt-4 md:mt-8">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">Practical Takeaways</h3>
        <ul className="flex flex-col gap-4 md:gap-6">
          <li className="flex gap-3 md:gap-4 items-start">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 mt-0.5 text-blue-700 dark:text-blue-400 font-bold text-sm md:text-base">1</div>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-lg leading-relaxed"><strong className="text-slate-900 dark:text-white">Restate instructions:</strong> Ask for one slide per message, restating full instructions each time — don't just say "like the previous one."</p>
          </li>
          <li className="flex gap-3 md:gap-4 items-start">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 mt-0.5 text-blue-700 dark:text-blue-400 font-bold text-sm md:text-base">2</div>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-lg leading-relaxed"><strong className="text-slate-900 dark:text-white">Reset context:</strong> Start a new chat if you notice drift — a shorter context window means less dilution of your core instructions.</p>
          </li>
          <li className="flex gap-3 md:gap-4 items-start">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 mt-0.5 text-blue-700 dark:text-blue-400 font-bold text-sm md:text-base">3</div>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-lg leading-relaxed"><strong className="text-slate-900 dark:text-white">Use the right tool:</strong> For strict brand or layout consistency across multiple slides, use a dedicated design tool instead of a chat image model.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
