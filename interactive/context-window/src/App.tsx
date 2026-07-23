/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen4 from './components/Screen4';
import Screen5 from './components/Screen5';
import Screen6 from './components/Screen6';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';

const SCREENS = [
  { id: 'screen-1', title: 'Growing Transcript' },
  { id: 'screen-2', title: 'Re-reading' },
  { id: 'screen-3', title: 'Lost in Middle' },
  { id: 'screen-4', title: 'The Drift' },
  { id: 'screen-5', title: 'Image Compounding' },
  { id: 'screen-6', title: 'Case Study' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SCREENS.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) setActiveScreen(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    const elements = document.querySelectorAll('.screen-section');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (index: number) => {
    const el = document.getElementById(SCREENS[index].id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 scroll-smooth snap-y snap-mandatory" ref={containerRef}>
      <ThemeToggle />
      <Navigation activeScreen={activeScreen} screens={SCREENS} onNavigate={scrollTo} />
      
      <main className="flex flex-col w-full">
        <ScreenSection id={SCREENS[0].id} index={0} onNext={() => scrollTo(1)} />
        <ScreenSection id={SCREENS[1].id} index={1} onPrev={() => scrollTo(0)} onNext={() => scrollTo(2)} />
        <ScreenSection id={SCREENS[2].id} index={2} onPrev={() => scrollTo(1)} onNext={() => scrollTo(3)} />
        <ScreenSection id={SCREENS[3].id} index={3} onPrev={() => scrollTo(2)} onNext={() => scrollTo(4)} />
        <ScreenSection id={SCREENS[4].id} index={4} onPrev={() => scrollTo(3)} onNext={() => scrollTo(5)} />
        <ScreenSection id={SCREENS[5].id} index={5} onPrev={() => scrollTo(4)} />
      </main>
    </div>
  );
}

function ScreenSection({ id, index, onPrev, onNext }: { id: string, index: number, onPrev?: () => void, onNext?: () => void }) {
  const Components = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6];
  const Component = Components[index];

  return (
    <section id={id} className="screen-section shrink-0 min-h-screen w-full flex flex-col items-center px-4 py-24 sm:p-12 md:p-24 relative snap-start">
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center pb-8 sm:pb-0">
        <Component />
      </div>
      <div className="absolute bottom-6 left-0 right-0 w-full flex justify-between px-6 sm:px-12 max-w-[1400px] mx-auto z-50">
        {onPrev ? (
          <button onClick={onPrev} className="px-6 py-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-medium text-sm">
            Back
          </button>
        ) : <div />}
        {onNext ? (
          <button onClick={onNext} className="px-6 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium text-sm shadow-sm">
            Next
          </button>
        ) : <div />}
      </div>
    </section>
  );
}
