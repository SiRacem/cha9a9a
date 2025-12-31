import React, { useState, useEffect } from 'react';
import { AppState, Goal } from './types';
import { STORAGE_KEY } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import GoalList from './components/GoalList';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    goals: [],
    activeGoalId: null,
    isCreating: false
  });
  const [loading, setLoading] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setAppState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load state", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    }
  }, [appState, loading]);

  const handleCreateGoal = (newGoal: Goal) => {
    setAppState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
      isCreating: false
      // Optional: Automatically enter the new goal?
      // activeGoalId: newGoal.id
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setAppState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
      activeGoalId: prev.activeGoalId === id ? null : prev.activeGoalId
    }));
  };

  const handleUpdateBatch = (batchId: string, isCompleted: boolean) => {
    if (!appState.activeGoalId) return;

    setAppState(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === prev.activeGoalId 
          ? {
              ...goal,
              batches: goal.batches.map(b => 
                b.id === batchId 
                  ? { ...b, isCompleted, completedAt: isCompleted ? Date.now() : undefined } 
                  : b
              )
            }
          : goal
      )
    }));
  };

  const activeGoal = appState.goals.find(g => g.id === appState.activeGoalId);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
      {/* Scenario 1: Active Goal (Dashboard) */}
      {activeGoal ? (
        <Dashboard 
          goal={activeGoal} 
          onUpdateBatch={handleUpdateBatch}
          onBack={() => setAppState(prev => ({ ...prev, activeGoalId: null }))}
        />
      ) : (
        /* Scenario 2: Creating a new Goal */
        (appState.isCreating || appState.goals.length === 0) ? (
          <div className="flex items-center justify-center min-h-screen">
            <WelcomeScreen 
              onCreate={handleCreateGoal} 
              onCancel={appState.goals.length > 0 ? () => setAppState(prev => ({ ...prev, isCreating: false })) : undefined}
              hasExistingGoals={appState.goals.length > 0}
            />
          </div>
        ) : (
          /* Scenario 3: List of Goals */
          <GoalList 
            goals={appState.goals}
            onSelect={(id) => setAppState(prev => ({ ...prev, activeGoalId: id }))}
            onCreateNew={() => setAppState(prev => ({ ...prev, isCreating: true }))}
            onDelete={handleDeleteGoal}
          />
        )
      )}
    </div>
  );
};

export default App;