/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Atom, FlaskConical, CircleDollarSign, LibraryBig, BookOpen, Download } from 'lucide-react';
import { MathMode } from './components/MathMode';
import { PhysicsMode } from './components/PhysicsMode';
import { ChemistryMode } from './components/ChemistryMode';
import { CurrencyMode } from './components/CurrencyMode';
import { FormulaLibraryMode } from './components/FormulaLibraryMode';
import { BooksMode } from './components/BooksMode';

type Mode = 'math' | 'physics' | 'chemistry' | 'currency' | 'formulas' | 'books';

export default function App() {
  const [mode, setMode] = useState<Mode>('math');
  const [hasStarted, setHasStarted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Basic iOS detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream) {
      setIsIOS(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      alert('To install on iOS: Tap the Share button at the bottom of the screen, then select "Add to Home Screen".');
    } else {
      alert('App installation is not supported by your browser or is already installed.');
    }
  };

  const navItem = (id: Mode, icon: ReactNode, label: string, colorClass: string) => (
    <button 
      onClick={() => setMode(id)}
      className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 touch-manipulation ${
        mode === id 
          ? `bg-${colorClass}-500/20 text-${colorClass}-400 shadow-[0_0_15px_rgba(var(--${colorClass}),0.3)]` 
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
      }`}
    >
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] bg-grid-pattern flex items-center justify-center p-0 sm:p-4 selection:bg-transparent font-sans">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-[100dvh] sm:h-[850px] sm:max-w-[400px] bg-black/80 backdrop-blur-xl sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:border sm:border-zinc-800/80 flex flex-col items-center justify-center relative overflow-hidden p-8 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.15),transparent_70%)] pointer-events-none"></div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative p-8 rounded-3xl bg-black border-2 border-lime-500/40 shadow-[0_0_40px_rgba(163,230,53,0.2)] mb-8 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-3xl border border-lime-400/20 shadow-[inset_0_0_20px_rgba(163,230,53,0.3)]"></div>
              <Calculator size={80} className="text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]" strokeWidth={1.5} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 
                className="text-4xl sm:text-5xl font-extrabold tracking-tight glitch drop-shadow-lg mb-2 text-white" 
                data-text="Mahraj Calculas."
              >
                Mahraj Calculas.
              </h1>
              <p className="text-zinc-400 mb-12 max-w-[250px] mx-auto text-sm leading-relaxed">
                Advanced scientific calculator with physics, chemistry, and forex features.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full relative z-10 flex flex-col gap-3"
            >
              <button
                onClick={() => setHasStarted(true)}
                className="w-full relative group overflow-hidden rounded-2xl bg-lime-500 text-black font-bold text-lg py-5 shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-transform active:scale-95"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative flex items-center justify-center gap-2">
                  START CALCULATING
                  <Calculator size={20} />
                </span>
              </button>

              {(deferredPrompt || isIOS) && (
                <button
                  onClick={handleInstallClick}
                  className="w-full relative group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-sm py-3.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  INSTALL APP
                </button>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.0, ease: "easeOut" }}
          className="w-full h-[100dvh] sm:h-[850px] sm:max-w-[400px] bg-black/80 backdrop-blur-xl sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] sm:border sm:border-zinc-800/80 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-20"></div>
          
          {/* Top Bar Label */}
          <div className="pt-4 pb-2 px-6 flex justify-center items-center z-20 relative">
             <div className="px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-bold tracking-widest text-zinc-400 uppercase">
               {mode === 'math' && <span className="text-lime-400">MATH CALC</span>}
               {mode === 'physics' && <span className="text-lime-400">PHYSICS</span>}
               {mode === 'chemistry' && <span className="text-cyan-400">CHEMISTRY</span>}
               {mode === 'currency' && <span className="text-amber-400">CURRENCY</span>}
               {mode === 'formulas' && <span className="text-indigo-400">FORMULA LIB</span>}
               {mode === 'books' && <span className="text-rose-400">BOOKS</span>}
             </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 flex relative overflow-hidden bg-[#050505]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex"
              >
                {mode === 'math' && <MathMode />}
                {mode === 'physics' && <PhysicsMode />}
                {mode === 'chemistry' && <ChemistryMode />}
                {mode === 'currency' && <CurrencyMode />}
                {mode === 'formulas' && <FormulaLibraryMode />}
                {mode === 'books' && <BooksMode />}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Bar */}
          <div className="h-20 bg-zinc-950 border-t border-zinc-800/80 rounded-b-[2.5rem] flex items-center justify-between px-2 overflow-x-auto custom-scrollbar z-20 relative pb-2 sm:pb-0 gap-1 touch-manipulation">
             {navItem('math', <Calculator size={20} className={mode === 'math' ? 'text-lime-400' : ''} />, 'Math', 'lime')}
             {navItem('physics', <Atom size={20} className={mode === 'physics' ? 'text-lime-400' : ''} />, 'Physics', 'lime')}
             {navItem('chemistry', <FlaskConical size={20} className={mode === 'chemistry' ? 'text-cyan-400' : ''} />, 'Chem', 'cyan')}
             {navItem('currency', <CircleDollarSign size={20} className={mode === 'currency' ? 'text-amber-400' : ''} />, 'Forex', 'amber')}
             {navItem('formulas', <LibraryBig size={20} className={mode === 'formulas' ? 'text-indigo-400' : ''} />, 'Formulas', 'indigo')}
             {navItem('books', <BookOpen size={20} className={mode === 'books' ? 'text-rose-400' : ''} />, 'Books', 'rose')}
          </div>
          
          {/* iOS-style bottom safety area */}
          <div className="h-1.5 sm:hidden absolute bottom-1 w-full flex justify-center z-30">
            <div className="w-1/3 h-1 bg-zinc-700/50 rounded-full"></div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
