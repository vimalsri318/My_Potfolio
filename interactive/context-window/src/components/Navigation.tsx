import { cn } from '@/lib/utils';

export default function Navigation({ activeScreen, screens, onNavigate }: { activeScreen: number, screens: any[], onNavigate: (index: number) => void }) {
  return (
    <div className="fixed top-0 left-0 w-full z-50 p-3 md:p-4 flex justify-center pointer-events-none">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-800/50 pointer-events-auto flex gap-1.5 md:gap-3 items-center">
        {screens.map((s: any, i: number) => (
          <button
            key={s.id}
            onClick={() => onNavigate(i)}
            className="group relative flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full transition-all"
            aria-label={`Go to screen ${i + 1}`}
          >
            <div
              className={cn(
                "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300",
                activeScreen === i 
                  ? "bg-slate-900 dark:bg-white scale-125" 
                  : "bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
