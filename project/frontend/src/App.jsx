import { useState, useEffect, useCallback } from 'react';
import CaptureView from './components/CaptureView';
import FocusView from './components/FocusView';
import ProfileView from './components/ProfileView';
import RestView from './components/RestView';
import WelcomeView from './components/WelcomeView';
import { translations } from './translations';

const STORAGE_KEYS = {
  steps: 'unjira_steps',
  index: 'unjira_index',
  score: 'unjira_score',
  history: 'unjira_history',
  taskName: 'unjira_task_name',
  profile: 'unjira_profile',
  language: 'unjira_language',
  theme: 'unjira_theme',
  taskTime: 'unjira_task_time',
  sound: 'unjira_sound',
  taskPoints: 'unjira_task_points'
};

export default function App() {
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [currentTaskName, setCurrentTaskName] = useState('');
  const [taskTimeSpent, setTaskTimeSpent] = useState(0);
  const [taskPoints, setTaskPoints] = useState(0);
  const [lastStepPoints, setLastStepPoints] = useState(0);

  // Profile state (null means not set up yet)
  const [userProfile, setUserProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Language & Theme
  const [language, setLanguage] = useState('es');
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Translation helper
  const t = translations[language] || translations.es;

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEYS.theme, next);
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.sound, String(next));
      return next;
    });
  }, []);

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.language, lang);
  }, []);

  const handleChangeAvatar = useCallback((newAvatar) => {
    setUserProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, avatar: newAvatar };
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedSteps = localStorage.getItem(STORAGE_KEYS.steps);
    const savedIndex = localStorage.getItem(STORAGE_KEYS.index);
    const savedScore = localStorage.getItem(STORAGE_KEYS.score);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.history);
    const savedTaskName = localStorage.getItem(STORAGE_KEYS.taskName);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.profile);
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    const savedTaskTime = localStorage.getItem(STORAGE_KEYS.taskTime);
    const savedSound = localStorage.getItem(STORAGE_KEYS.sound);
    const savedTaskPoints = localStorage.getItem(STORAGE_KEYS.taskPoints);

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { }
    }
    if (savedTaskName) setCurrentTaskName(savedTaskName);
    if (savedProfile) {
      try { setUserProfile(JSON.parse(savedProfile)); } catch (e) { }
    }
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
    if (savedTaskTime) {
      setTaskTimeSpent(parseInt(savedTaskTime, 10));
    }
    if (savedTaskPoints) {
      setTaskPoints(parseInt(savedTaskPoints, 10));
    }

    if (savedSteps) {
      try {
        const parsed = JSON.parse(savedSteps);
        if (Array.isArray(parsed)) {
          setSteps(parsed);
          setCurrentIndex(parseInt(savedIndex || '0', 10) || 0);
        }
      } catch (e) {
        console.error('Failed to restore state from localStorage:', e);
      }
    }
    setIsInitializing(false);
  }, []);

  // Persist steps, index and task name to localStorage
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem(STORAGE_KEYS.steps, JSON.stringify(steps));
      localStorage.setItem(STORAGE_KEYS.index, String(currentIndex));
      localStorage.setItem(STORAGE_KEYS.taskName, currentTaskName);
      localStorage.setItem(STORAGE_KEYS.taskTime, String(taskTimeSpent));
      localStorage.setItem(STORAGE_KEYS.taskPoints, String(taskPoints));
    }
  }, [steps, currentIndex, currentTaskName, taskTimeSpent, taskPoints]);

  // Persist score, history, and profile
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.score, String(score));
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    if (userProfile) {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(userProfile));
    }
  }, [score, history, userProfile]);

  const handleTaskSubmit = async (task) => {
    setLoading(true);
    setError(null);
    setCurrentTaskName(task);

    try {
      let newSteps;

      if (import.meta.env.VITE_MOCK === 'true') {
        await new Promise((r) => setTimeout(r, 1500));
        newSteps = t.mockSteps.map(step => step.replace('{task}', task.slice(0, 30)));
      } else {
        const response = await fetch('/api/letsgo/v1/breakdown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task, language }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to decompose task');
        }

        const data = await response.json();
        newSteps = data.steps;
      }

      setSteps(newSteps);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = (stepTimeInSeconds = 0) => {
    const nextIndex = currentIndex + 1;
    const newTotalTime = taskTimeSpent + stepTimeInSeconds;
    setTaskTimeSpent(newTotalTime);

    // Dynamic points based on effort (time). 
    // Base 10. +2 points per minute spent, up to max 20 points per step.
    const effortBonus = Math.floor(stepTimeInSeconds / 60) * 2;
    const stepPoints = Math.min(20, 10 + effortBonus);

    setLastStepPoints(stepPoints);
    setScore(prev => prev + stepPoints);
    setTaskPoints(prev => prev + stepPoints);

    if (nextIndex < steps.length) {
      setCurrentIndex(nextIndex);
    } else {
      setScore(prev => prev + 50); // Bonus por acabar la tarea

      const finalPoints = taskPoints + stepPoints + 50;

      const newHistoryItem = {
        task: currentTaskName,
        date: new Date().toISOString(),
        points: finalPoints,
        timeSpent: newTotalTime,
        steps: steps
      };

      setHistory(prev => [newHistoryItem, ...prev]);

      setSteps([]);
      setCurrentIndex(0);
      setCurrentTaskName('');
      setTaskTimeSpent(0);
      setTaskPoints(0);
      localStorage.removeItem(STORAGE_KEYS.steps);
      localStorage.removeItem(STORAGE_KEYS.index);
      localStorage.removeItem(STORAGE_KEYS.taskName);
      localStorage.removeItem(STORAGE_KEYS.taskTime);
      localStorage.removeItem(STORAGE_KEYS.taskPoints);

      setIsResting(true);
    }
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentIndex(0);
    setError(null);
    setCurrentTaskName('');
    setTaskTimeSpent(0);
    setTaskPoints(0);
    localStorage.removeItem(STORAGE_KEYS.steps);
    localStorage.removeItem(STORAGE_KEYS.index);
    localStorage.removeItem(STORAGE_KEYS.taskName);
    localStorage.removeItem(STORAGE_KEYS.taskTime);
    localStorage.removeItem(STORAGE_KEYS.taskPoints);
  };

  if (isInitializing) return null; // Avoid flicker

  const inFocusMode = steps.length > 0;

  // Shared props for all views
  const sharedProps = { t, theme, toggleTheme, language, onChangeLanguage: changeLanguage, soundEnabled, toggleSound };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 font-sans transition-colors duration-300">
      <div className="w-full max-w-md">
        {!userProfile ? (
          <WelcomeView
            onComplete={(profile) => setUserProfile(profile)}
            {...sharedProps}
          />
        ) : showProfile ? (
          <ProfileView
            profile={userProfile}
            score={score}
            history={history}
            onBack={() => setShowProfile(false)}
            onChangeAvatar={handleChangeAvatar}
            {...sharedProps}
          />
        ) : isResting ? (
          <RestView onComplete={() => setIsResting(false)} {...sharedProps} />
        ) : inFocusMode ? (
          <FocusView
            steps={steps}
            currentIndex={currentIndex}
            onComplete={handleStepComplete}
            onReset={handleReset}
            lastStepPoints={lastStepPoints}
            userName={userProfile?.name}
            onReplaceStep={(newStep) => {
              setSteps(prev => {
                const updated = [...prev];
                updated[currentIndex] = newStep;
                return updated;
              });
            }}
            currentTaskName={currentTaskName}
            {...sharedProps}
          />
        ) : (
          <CaptureView
            onSubmit={handleTaskSubmit}
            loading={loading}
            error={error}
            score={score}
            userProfile={userProfile}
            onShowProfile={() => setShowProfile(true)}
            {...sharedProps}
          />
        )}
      </div>
    </div>
  );
}
