import { useState } from 'react';

const AVATARS = ['🦊', '🦉', '🐢', '🦖', '🚀', '🌟', '👾', '🌈'];

export default function WelcomeView({ onComplete }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({ name: name.trim(), avatar });
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6 w-full max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative text-center">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">¡Hola!</h1>
        <p className="text-zinc-400">Antes de empezar, personaliza tu perfil local.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3 text-center">
            Elige tu avatar
          </label>
          <div className="flex flex-wrap justify-center gap-3">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                className={`text-3xl p-2 rounded-xl transition-all ${
                  avatar === a 
                    ? 'bg-indigo-500/20 ring-2 ring-indigo-500 scale-110' 
                    : 'bg-zinc-800/50 hover:bg-zinc-800 hover:scale-105 opacity-60 hover:opacity-100'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
            ¿Cómo te llamas?
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre o apodo..."
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-inner"
            required
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none"
        >
          ¡Empezar a vencer tareas!
        </button>
      </form>
    </div>
  );
}
