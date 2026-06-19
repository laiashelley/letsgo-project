import React, { useState } from 'react';

const AVATARS = ['🦊', '🦉', '🐢', '🦖', '🚀', '🌟', '👾', '🌈'];
const AVATAR_LEVELS = { '🦊': 1, '🦉': 1, '🐢': 1, '🦖': 1, '🚀': 3, '🌟': 5, '👾': 10, '🌈': 15 };

const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'ca', label: 'Català' },
];

export default function ProfileView({ profile, score, history, onBack, onChangeAvatar, t, theme, toggleTheme, soundEnabled, toggleSound, language, onChangeLanguage }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  // Simple level calculation: 1 level per 200 points
  const level = Math.floor(score / 200) + 1;
  const nextLevelScore = level * 200;
  const progress = ((score % 200) / 200) * 100;

  // Streak logic
  const getStreak = () => {
    if (!history || history.length === 0) return 0;
    
    // Sort descending by date
    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Unique dates (ignoring time)
    const uniqueDates = [];
    sorted.forEach(h => {
      const d = new Date(h.date).toDateString();
      if (!uniqueDates.includes(d)) uniqueDates.push(d);
    });

    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    // If latest task wasn't today or yesterday, streak is 0
    const latestDate = new Date(uniqueDates[0]);
    latestDate.setHours(0,0,0,0);
    
    const diffDays = Math.floor((checkDate - latestDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;

    // Count backwards
    let expectedDate = new Date(latestDate);
    for (let i = 0; i < uniqueDates.length; i++) {
      const d = new Date(uniqueDates[i]);
      d.setHours(0,0,0,0);
      if (d.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getStreak();

  // Weekly chart logic
  const getWeeklyData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = history.filter(h => new Date(h.date).toDateString() === dateStr).length;
      data.push({ day: d.toLocaleDateString(undefined, { weekday: 'short' }), count });
    }
    return data;
  };

  const weeklyData = getWeeklyData();
  const maxTasks = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6 w-full max-w-md mx-auto relative overflow-hidden flex flex-col h-[85vh] transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="relative shrink-0">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 text-sm font-medium transition-colors flex items-center gap-2"
          >
            &larr; {t.back}
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => onChangeLanguage(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 pr-8 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">▼</span>
            </div>
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
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="relative z-10">
            <button 
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors rounded-2xl border-2 border-indigo-500/30 flex items-center justify-center text-4xl shadow-lg shadow-indigo-500/10 group"
              title="Cambiar avatar"
            >
              <span className="group-hover:scale-110 transition-transform">{profile.avatar}</span>
              <div className="absolute inset-0 bg-black/30 dark:bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <span className="text-white text-xl">✎</span>
              </div>
            </button>
            
            {isEditingAvatar && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsEditingAvatar(false)} />
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl p-3 z-50 flex gap-2 flex-wrap w-[220px]">
                  {AVATARS.map(a => {
                    const reqLevel = AVATAR_LEVELS[a];
                    const isLocked = level < reqLevel;
                    return (
                      <button
                        key={a}
                        disabled={isLocked}
                        onClick={() => {
                          if (onChangeAvatar && !isLocked) onChangeAvatar(a);
                          setIsEditingAvatar(false);
                        }}
                        className={`group text-2xl p-2 rounded-xl transition-all relative ${
                          profile.avatar === a 
                            ? 'bg-indigo-500/20 ring-2 ring-indigo-500 scale-110' 
                            : isLocked 
                              ? 'opacity-40 cursor-not-allowed bg-gray-50 dark:bg-zinc-800'
                              : 'hover:bg-gray-100 dark:hover:bg-zinc-700 hover:scale-110'
                        }`}
                      >
                        <span className={isLocked ? 'grayscale opacity-50' : ''}>{a}</span>
                        {isLocked && (
                          <>
                            <span className="absolute -bottom-1 -right-1 text-xs group-hover:scale-110 transition-transform">🔒</span>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                              {t.levelRequired ? t.levelRequired.replace('{reqLevel}', reqLevel) : `Nivel ${reqLevel} requerido`}
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{profile.name}</h2>
              {streak > 0 && (
                <span className="text-orange-500 bg-orange-100 dark:bg-orange-900/30 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800 flex items-center gap-1">
                  🔥 {streak}
                </span>
              )}
            </div>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">{t.level} {level}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-700/50 mb-2 transition-colors duration-300">
          <div className="flex justify-between text-xs text-gray-400 dark:text-zinc-400 font-medium mb-2 uppercase tracking-wider">
            <span>{t.progress}</span>
            <span>{score} / {nextLevelScore} pts</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-950 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Weekly Chart */}
        {history.length > 0 && (
          <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-xl p-3 border border-gray-200 dark:border-zinc-700/50 mb-4 transition-colors duration-300 flex items-end justify-between h-20 gap-1">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex flex-col items-center justify-end flex-1 h-full gap-1 group">
                <div 
                  className={`w-full max-w-[12px] rounded-t-sm transition-all duration-500 ${d.count > 0 ? 'bg-indigo-400 dark:bg-indigo-500 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400' : 'bg-gray-200 dark:bg-zinc-800'}`}
                  style={{ height: `${(d.count / maxTasks) * 100}%`, minHeight: d.count === 0 ? '4px' : '0' }}
                  title={`${d.count} tareas`}
                />
                <span className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase">{d.day.slice(0,2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History List */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-3 shrink-0">{t.yourAchievements} ({history.length})</h3>
        
        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-gray-200/50 dark:border-zinc-800/50 transition-colors duration-300">
            <span className="text-4xl mb-3 opacity-50">🌱</span>
            <p className="text-gray-500 dark:text-zinc-400 text-sm">{t.noTasksYet}</p>
            <p className="text-gray-400 dark:text-zinc-500 text-xs mt-1">{t.goodDayToStart}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-2">
            {history.map((item, i) => (
              <div key={i} className="bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/40 rounded-xl overflow-hidden hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <button 
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  className="w-full p-3.5 flex justify-between items-center text-left"
                >
                  <div className="flex flex-col pr-3 overflow-hidden">
                    <span className="text-gray-800 dark:text-zinc-200 font-medium text-sm truncate">{item.task}</span>
                    <span className="text-gray-400 dark:text-zinc-500 text-xs mt-0.5">
                      {new Date(item.date).toLocaleDateString()}
                      {item.timeSpent > 0 && ` • ${Math.floor(item.timeSpent / 60)}${t.minutes} ${item.timeSpent % 60}${t.seconds}`}
                    </span>
                  </div>
                  <div className="shrink-0 text-indigo-600 dark:text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2 py-1 rounded-lg">
                    +{item.points}
                  </div>
                </button>
                {expandedIndex === i && item.steps && (
                  <div className="px-3.5 pb-3.5 bg-white/50 dark:bg-black/20">
                    <div className="border-t border-gray-200 dark:border-zinc-700/50 pt-3">
                      <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">{t.stepsSummary}:</p>
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-gray-600 dark:text-zinc-400 marker:text-indigo-500/50">
                        {item.steps.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">{step}</li>
                        ))}
                      </ul>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-500 mt-3 pt-2 border-t border-gray-200/50 dark:border-zinc-700/30">
                        <span>{item.steps.length} {t.pointsPerStep ? t.pointsPerStep.toLowerCase() : 'pasos'} (10 pts)</span>
                        <span>{t.bonus}: 50 pts</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
