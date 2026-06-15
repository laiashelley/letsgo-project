import { useState } from 'react';

export default function CaptureView({ onSubmit, loading, error, score, userProfile, onShowProfile }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task.trim());
      setTask('');
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative flex justify-between items-start">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-zinc-100 mb-1 tracking-tight">Venga.</h1>
          <p className="text-zinc-400 text-sm">Sin agobios, {userProfile?.name.split(' ')[0]}</p>
        </div>
        
        <button 
          onClick={onShowProfile}
          className="group flex flex-col items-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-3 py-2 transition-all min-w-[70px]"
        >
          <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{userProfile?.avatar}</span>
          <span className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300">{score}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div>
          <label htmlFor="task" className="block text-sm font-medium text-zinc-300 mb-2">
            ¿Qué es eso que te está bloqueando?
          </label>
          <textarea
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Ej: Escribir el informe de gastos..."
            className="w-full px-4 py-4 bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
            rows="5"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-300">Uy, algo falló</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !task.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Desglosando tarea...
            </>
          ) : 'Desglosar en micro-pasos'}
        </button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-800/50">
        <p>Todo se guarda en tu dispositivo. Tu privacidad es tuya.</p>
      </div>
    </div>
  );
}
