import { useState, useEffect } from 'react';
import CaptureView from './components/CaptureView';
import FocusView from './components/FocusView';
import ProfileView from './components/ProfileView';
import WelcomeView from './components/WelcomeView';

const STORAGE_KEYS = {
  steps: 'unjira_steps',
  index: 'unjira_index',
  score: 'unjira_score',
  history: 'unjira_history',
  taskName: 'unjira_task_name',
  profile: 'unjira_profile'
};

export default function App() {
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [currentTaskName, setCurrentTaskName] = useState('');
  
  // New profile state (null means not set up yet)
  const [userProfile, setUserProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedSteps = localStorage.getItem(STORAGE_KEYS.steps);
    const savedIndex = localStorage.getItem(STORAGE_KEYS.index);
    const savedScore = localStorage.getItem(STORAGE_KEYS.score);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.history);
    const savedTaskName = localStorage.getItem(STORAGE_KEYS.taskName);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.profile);

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
    if (savedTaskName) setCurrentTaskName(savedTaskName);
    if (savedProfile) {
      try { setUserProfile(JSON.parse(savedProfile)); } catch (e) {}
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
    }
  }, [steps, currentIndex, currentTaskName]);

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
        newSteps = [
          `Prepara tu entorno: despeja tu mesa o abre solo lo que necesites para "${task.slice(0, 30)}..."`,
          `Haz la parte más ridículamente fácil y pequeña de esta tarea. Solo eso.`,
          `Continúa durante solo 5 minutos. Si luego quieres parar, puedes hacerlo.`,
          `Anota en un papel cuál será tu siguiente paso cuando vuelvas a ello.`,
          `Tómate un respiro, bebe agua y prémiate por haber avanzado.`,
        ];
      } else {
        const response = await fetch('http://localhost:3000/api/un-jira/v1/breakdown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task }),
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

  const handleStepComplete = () => {
    const nextIndex = currentIndex + 1;
    
    setScore(prev => prev + 10);
    
    if (nextIndex < steps.length) {
      setCurrentIndex(nextIndex);
    } else {
      setScore(prev => prev + 50);
      
      const newHistoryItem = {
        task: currentTaskName,
        date: new Date().toISOString(),
        points: (steps.length * 10) + 50
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);

      setSteps([]);
      setCurrentIndex(0);
      setCurrentTaskName('');
      localStorage.removeItem(STORAGE_KEYS.steps);
      localStorage.removeItem(STORAGE_KEYS.index);
      localStorage.removeItem(STORAGE_KEYS.taskName);
    }
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentIndex(0);
    setError(null);
    setCurrentTaskName('');
    localStorage.removeItem(STORAGE_KEYS.steps);
    localStorage.removeItem(STORAGE_KEYS.index);
    localStorage.removeItem(STORAGE_KEYS.taskName);
  };

  if (isInitializing) return null; // Avoid flicker

  const inFocusMode = steps.length > 0;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 font-sans">
      <div className="w-full max-w-md">
        {!userProfile ? (
          <WelcomeView onComplete={(profile) => setUserProfile(profile)} />
        ) : showProfile ? (
          <ProfileView 
            profile={userProfile} 
            score={score} 
            history={history} 
            onBack={() => setShowProfile(false)} 
          />
        ) : inFocusMode ? (
          <FocusView
            steps={steps}
            currentIndex={currentIndex}
            onComplete={handleStepComplete}
            onReset={handleReset}
          />
        ) : (
          <CaptureView
            onSubmit={handleTaskSubmit}
            loading={loading}
            error={error}
            score={score}
            userProfile={userProfile}
            onShowProfile={() => setShowProfile(true)}
          />
        )}
      </div>
    </div>
  );
}
