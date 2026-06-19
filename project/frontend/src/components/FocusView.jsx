import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playPop, playSuccess } from '../sound';

export default function FocusView({ steps, currentIndex, onComplete, onReset, onReplaceStep, currentTaskName, t, theme, toggleTheme, soundEnabled, toggleSound, language }) {
  const [message, setMessage] = useState(t.motivational[0]);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [isGenerating, setIsGenerating] = useState(false);

  // Change motivational message when advancing a step
  useEffect(() => {
    if (currentIndex > 0) {
      const randomMsg = t.motivational[Math.floor(Math.random() * t.motivational.length)];
      setMessage(randomMsg);
    }
    setStepStartTime(Date.now());
  }, [currentIndex, t]);

  const currentStep = steps[currentIndex];
  const total = steps.length;
  const progress = Math.round(((currentIndex) / total) * 100);
  const isLastStep = currentIndex + 1 === total;

  const handleComplete = () => {
    const timeSpentInSeconds = Math.max(0, Math.floor((Date.now() - stepStartTime) / 1000));
    if (isLastStep) {
      if (soundEnabled) playSuccess();
      // Fire confetti!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899'] // Indigo, Purple, Pink
      });
    } else {
      if (soundEnabled) playPop();
    }
    onComplete(timeSpentInSeconds);
  };

  const handleSuggestAlternative = async () => {
    setIsGenerating(true);
    try {
      if (import.meta.env.VITE_MOCK === 'true') {
        await new Promise((r) => setTimeout(r, 1000));
        onReplaceStep("Hazlo de una manera distinta y súper fácil: " + currentStep.slice(0, 15) + "...");
      } else {
        const response = await fetch('http://localhost:3000/api/letsgo/v1/alternate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: currentTaskName, currentStep, language }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch alternative');
        }

        const data = await response.json();
        if (data.step) {
          onReplaceStep(data.step);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-8 relative overflow-hidden transition-colors duration-300">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header with theme toggle */}
      <div className="text-center relative">
        <div className="flex justify-end mb-3 gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 transition-all text-base"
            aria-label="Toggle sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 transition-all text-base"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Let's Go</h1>
        <div className="inline-block bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-zinc-400">
          {t.step} {currentIndex + 1} {t.of} {total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current step */}
      <div className="bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700/50 rounded-2xl p-8 min-h-[160px] flex flex-col items-center justify-center relative shadow-lg transition-colors duration-300">
        {currentIndex > 0 && (
          <span className="absolute top-3 text-xs font-bold text-emerald-500 dark:text-emerald-400 animate-pulse">
            {message} (+10 pts)
          </span>
        )}
        <p className="text-xl font-medium text-gray-900 dark:text-zinc-100 text-center leading-relaxed mt-4">
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2 text-indigo-500 animate-pulse">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ...
            </span>
          ) : currentStep}
        </p>
      </div>

      {/* Suggest another step button */}
      <div className="flex justify-center -mt-4">
        <button
          onClick={handleSuggestAlternative}
          disabled={isGenerating}
          className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full"
        >
          💡 {t.suggestAnother || "Sugiéreme otra cosa"}
        </button>
      </div>

      {/* Upcoming steps preview */}
      {!isLastStep && (
        <div className="space-y-2 bg-gray-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-gray-200/50 dark:border-zinc-800/50 transition-colors duration-300">
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{t.comingUp}</p>
          {steps.slice(currentIndex + 1, currentIndex + 3).map((step, i) => (
            <p key={i} className="text-sm text-gray-500 dark:text-zinc-400 pl-3 border-l-2 border-gray-300 dark:border-zinc-800 py-1 opacity-70">
              {step}
            </p>
          ))}
          {steps.length - currentIndex > 3 && (
            <p className="text-xs text-gray-400 dark:text-zinc-600 pl-3 italic">
              {t.andMore.replace('{count}', steps.length - currentIndex - 3)}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4 relative">
        <button
          onClick={handleComplete}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
        >
          {isLastStep ? `${t.allDone} (+50 pts)` : t.doneNextStep}
        </button>

        <button
          onClick={onReset}
          className="w-full text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 text-sm py-2 transition-colors font-medium"
        >
          {t.startOver}
        </button>
      </div>
    </div>
  );
}
