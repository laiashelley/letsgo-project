import { useState, useEffect, useRef } from 'react';
import { LANGUAGE_OPTIONS } from '../constants';

export default function CaptureView({ onSubmit, loading, error, score, userProfile, onShowProfile, t, theme, toggleTheme, language, onChangeLanguage, soundEnabled, toggleSound }) {
  const [task, setTask] = useState('');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    if (!langMenuOpen) return;
    const handleOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [langMenuOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task.trim());
      setTask('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Top bar: settings & profile */}
      <div className="relative flex justify-between items-start">
        <div className="text-left min-w-0 flex-1 mr-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-100 mb-1 tracking-tight">Let's Go.</h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm truncate">{t.letsgoSubtitle}, {userProfile?.name.split(' ')[0]}</p>
        </div>

        <div className="flex items-stretch gap-2">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="group flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 transition-all min-w-[52px]"
            aria-label="Toggle sound"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{soundEnabled ? '🔊' : '🔇'}</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="group flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 transition-all min-w-[52px]"
            aria-label="Toggle theme"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          {/* Language quick-switch */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(prev => !prev)}
              className="flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 transition-all min-w-[52px] h-full"
              aria-label="Change language"
            >
              <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-transform">
                {LANGUAGE_OPTIONS.find(l => l.code === language)?.flag || '🌍'}
              </span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl p-1.5 z-50 min-w-[52px]">
                {LANGUAGE_OPTIONS.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { onChangeLanguage(lang.code); setLangMenuOpen(false); }}
                    className={`block w-full text-center p-1.5 rounded-lg text-base transition-all ${
                      language === lang.code ? 'bg-indigo-500/20' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-bold">{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile button */}
          <button
            onClick={onShowProfile}
            className="group flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 transition-all min-w-[52px]"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">{userProfile?.avatar}</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300">{score}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div>
          <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
            {t.whatBlocksYou}
          </label>
          <textarea
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder={t.taskPlaceholder}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-gray-900 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner text-base"
            rows="4"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-700 dark:text-red-300">{t.errorTitle}</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !task.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-500 disabled:border-gray-300 dark:disabled:border-zinc-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.breakingDown}
            </>
          ) : t.breakDownBtn}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400 dark:text-zinc-500 pt-2 border-t border-gray-200/50 dark:border-zinc-800/50">
        <p>{t.privacyText}</p>
      </div>
    </div>
  );
}
