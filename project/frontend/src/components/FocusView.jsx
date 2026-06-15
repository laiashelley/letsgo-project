import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const MOTIVATIONAL_MESSAGES = [
  "¡Vas por muy buen camino!",
  "¡Un pasito menos!",
  "¡Lo estás haciendo genial!",
  "¡Poco a poco, sin prisa!",
  "¡Eso es! Sigue así.",
  "¡Muy bien! Tómate un respiro si lo necesitas."
];

export default function FocusView({ steps, currentIndex, onComplete, onReset }) {
  const [message, setMessage] = useState(MOTIVATIONAL_MESSAGES[0]);

  // Cambiar el mensaje motivacional cuando avanzamos de paso
  useEffect(() => {
    if (currentIndex > 0) {
      const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      setMessage(randomMsg);
    }
  }, [currentIndex]);

  const currentStep = steps[currentIndex];
  const total = steps.length;
  const progress = Math.round(((currentIndex) / total) * 100);
  const isLastStep = currentIndex + 1 === total;

  const handleComplete = () => {
    if (isLastStep) {
      // Tirar confeti!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899'] // Indigo, Purple, Pink
      });
    }
    onComplete();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 space-y-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="text-center relative">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Venga</h1>
        <div className="inline-block bg-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-zinc-400">
          Paso {currentIndex + 1} de {total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current step */}
      <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl p-8 min-h-[160px] flex flex-col items-center justify-center relative shadow-lg">
        {currentIndex > 0 && (
          <span className="absolute top-3 text-xs font-bold text-emerald-400 animate-pulse">
            {message} (+10 pts)
          </span>
        )}
        <p className="text-xl font-medium text-zinc-100 text-center leading-relaxed mt-4">
          {currentStep}
        </p>
      </div>

      {/* Upcoming steps preview */}
      {!isLastStep && (
        <div className="space-y-2 bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">A continuación</p>
          {steps.slice(currentIndex + 1, currentIndex + 3).map((step, i) => (
            <p key={i} className="text-sm text-zinc-400 pl-3 border-l-2 border-zinc-800 py-1 opacity-70">
              {step}
            </p>
          ))}
          {steps.length - currentIndex > 3 && (
            <p className="text-xs text-zinc-600 pl-3 italic">...y {steps.length - currentIndex - 3} más</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4 relative">
        <button
          onClick={handleComplete}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all text-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
        >
          {isLastStep ? '¡Todo listo! (+50 pts)' : 'Hecho — siguiente paso'}
        </button>

        <button
          onClick={onReset}
          className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2 transition-colors font-medium"
        >
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}
