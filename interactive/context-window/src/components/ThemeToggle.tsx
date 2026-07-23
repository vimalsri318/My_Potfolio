import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // Start in light mode by default (ignore the OS preference). The reader
  // can still switch to dark with the toggle.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
