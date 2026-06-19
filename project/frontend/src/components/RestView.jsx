import { useState, useEffect } from 'react';

export default function RestView({ onComplete, t, theme, toggleTheme, soundEnabled, toggleSound }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalTime, setTotalTime] = useState(60);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onComplete]);

  const addTime = (seconds) => {
    setTimeLeft(prev => prev + seconds);
    setTotalTime(prev => prev + seconds);
  };

  const skipRest = () => {
    onComplete();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-8 relative overflow-hidden transition-colors duration-300 min-h-[400px] flex flex-col items-center justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 transition-all text-lg"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 transition-all text-lg"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="text-center z-10 w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">{t.missionAccomplished || '¡Misión Cumplida!'}</h2>
        <p className="text-gray-500 dark:text-zinc-400">{t.takeABreath || 'Tómate un respiro antes de seguir.'}</p>
      </div>

      {/* Breathing Circle */}
      <div className="relative w-48 h-48 flex items-center justify-center my-8 z-10">
        <div 
          className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"
        />
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96" cy="96" r="94"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-emerald-500 transition-all duration-1000 ease-linear"
            strokeDasharray={2 * Math.PI * 94}
            strokeDashoffset={(2 * Math.PI * 94) * (1 - progress / 100)}
          />
        </svg>

        <div className={`w-32 h-32 bg-emerald-500/20 rounded-full flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${!isPaused && timeLeft % 8 < 4 ? 'scale-110' : 'scale-90'}`}>
          <div className="w-24 h-24 bg-emerald-500/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="z-10 w-full flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <button onClick={() => addTime(-30)} disabled={timeLeft <= 30} className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm text-gray-600 dark:text-zinc-300 disabled:opacity-50">
            -30s
          </button>
          <button onClick={() => setIsPaused(!isPaused)} className="px-4 py-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-bold text-gray-800 dark:text-zinc-200">
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button onClick={() => addTime(30)} className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm text-gray-600 dark:text-zinc-300">
            +30s
          </button>
        </div>
        
        <button onClick={skipRest} className="text-sm text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors underline decoration-dotted underline-offset-4 mt-2">
          {t.skipRest || 'Saltar descanso (Tengo prisa)'}
        </button>
      </div>
    </div>
  );
}
