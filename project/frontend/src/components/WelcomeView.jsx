import { useState } from 'react';

const AVATARS = ['🦊', '🦉', '🐢', '🦖', '🚀', '🌟', '👾', '🌈'];

const LANGUAGE_OPTIONS = [
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'ca', label: 'Català', flag: 'CA' },
];

export default function WelcomeView({ onComplete, t, theme, toggleTheme, language, onChangeLanguage, soundEnabled, toggleSound }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({ name: name.trim(), avatar });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6 w-full max-w-md mx-auto relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      
      {/* Theme and Sound toggles */}
      <div className="relative flex justify-end gap-2">
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 transition-all text-lg"
          aria-label="Toggle sound"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 transition-all text-lg"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="relative text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">{t.welcomeTitle}</h1>
        <p className="text-gray-500 dark:text-zinc-400">{t.welcomeSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {/* Language selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3 text-center">
            {t.chooseLanguage}
          </label>
          <div className="flex justify-center gap-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => onChangeLanguage(lang.code)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  language === lang.code
                    ? 'bg-indigo-500/20 dark:bg-indigo-500/20 ring-2 ring-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Avatar selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3 text-center">
            {t.chooseAvatar}
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
                    : 'bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-800 hover:scale-105 opacity-60 hover:opacity-100'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
            {t.whatsYourName}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-inner"
            required
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none"
        >
          {t.startButton}
        </button>
      </form>
    </div>
  );
}
