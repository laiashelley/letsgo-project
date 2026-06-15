import React from 'react';

export default function ProfileView({ profile, score, history, onBack }) {
  // Simple level calculation: 1 level per 200 points
  const level = Math.floor(score / 200) + 1;
  const nextLevelScore = level * 200;
  const progress = ((score % 200) / 200) * 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6 w-full max-w-md mx-auto relative overflow-hidden flex flex-col h-[85vh]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="relative shrink-0">
        <button 
          onClick={onBack}
          className="text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors flex items-center gap-2 mb-6"
        >
          &larr; Volver
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-zinc-800 rounded-2xl border-2 border-indigo-500/30 flex items-center justify-center text-4xl shadow-lg shadow-indigo-500/10">
            {profile.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">{profile.name}</h2>
            <p className="text-indigo-400 font-medium">Nivel {level}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 mb-2">
          <div className="flex justify-between text-xs text-zinc-400 font-medium mb-2 uppercase tracking-wider">
            <span>Progreso</span>
            <span>{score} / {nextLevelScore} pts</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 shrink-0">Tus Logros ({history.length})</h3>
        
        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
            <span className="text-4xl mb-3 opacity-50">🌱</span>
            <p className="text-zinc-400 text-sm">Aún no hay tareas completadas.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-2">
            {history.map((item, i) => (
              <div key={i} className="bg-zinc-800/60 border border-zinc-700/40 rounded-xl p-3.5 flex justify-between items-center hover:bg-zinc-800 transition-colors">
                <div className="flex flex-col pr-3 overflow-hidden">
                  <span className="text-zinc-200 font-medium text-sm truncate">{item.task}</span>
                  <span className="text-zinc-500 text-xs mt-0.5">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="shrink-0 text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2 py-1 rounded-lg">
                  +{item.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
