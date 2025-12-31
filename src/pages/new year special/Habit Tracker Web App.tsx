import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Calendar, TrendingUp, Target } from 'lucide-react';

export default function HabitTrackerApp() {
  const [habits, setHabits] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('habits');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('health');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  const categories = [
    { id: 'health', name: 'Health', color: 'bg-green-500' },
    { id: 'productivity', name: 'Productivity', color: 'bg-blue-500' },
    { id: 'mindfulness', name: 'Mindfulness', color: 'bg-purple-500' },
    { id: 'learning', name: 'Learning', color: 'bg-yellow-500' },
    { id: 'fitness', name: 'Fitness', color: 'bg-red-500' }
  ];



  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      category: selectedCategory,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter((h: any) => h.id !== id));
  };

  const toggleHabitCompletion = (habitId: number, date: Date) => {
    setHabits(habits.map((habit: any) => {
      if (habit.id === habitId) {
        const dateStr = date.toISOString().split('T')[0];
        const isCompleted = habit.completedDates.includes(dateStr);
        
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter((d: any) => d !== dateStr)
            : [...habit.completedDates, dateStr]
        };
      }
      return habit;
    }));
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const isHabitCompletedOnDate = (habit: any, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habit.completedDates.includes(dateStr);
  };

  const getCompletionRate = (habit: any) => {
    const last7Days = getLast7Days();
    const completed = last7Days.filter((date: any) => 
      isHabitCompletedOnDate(habit, date)
    ).length;
    return Math.round((completed / 7) * 100);
  };

  const getTotalStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter((h: any) => 
      h.completedDates.includes(today)
    ).length;
    const totalHabits = habits.length;
    
    return { completedToday, totalHabits };
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || 'bg-gray-500';
  };

  const stats = getTotalStats();
  const last7Days = getLast7Days();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Habit Tracker
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Build better habits, one day at a time
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg hover:scale-105 transition-transform`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Today's Progress</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.completedToday}/{stats.totalHabits}
                </p>
              </div>
              <Check className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Habits</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {habits.length}
                </p>
              </div>
              <Target className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Streak</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalHabits > 0 ? '🔥 7' : '0'}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Add Habit Form */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg mb-8`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Add New Habit
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              placeholder="Enter habit name..."
              className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} focus:border-indigo-500 outline-none transition-colors`}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} focus:border-indigo-500 outline-none transition-colors`}
            >
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={addHabit}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Habit
            </button>
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center shadow-lg`}>
              <Calendar className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No habits yet. Start by adding your first habit above!
              </p>
            </div>
          ) : (
            habits.map((habit: any) => (
              <div
                key={habit.id}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(habit.category)}`} />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {habit.name}
                    </h3>
                    <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {categories.find(c => c.id === habit.category)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        7-Day Rate
                      </p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getCompletionRate(habit)}%
                      </p>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Last 7 Days */}
                <div className="flex gap-2">
                  {last7Days.map((date: any, idx: number) => {
                    const isCompleted = isHabitCompletedOnDate(habit, date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleHabitCompletion(habit.id, date)}
                        className={`flex-1 p-3 rounded-lg transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-100 hover:bg-gray-200'
                        } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                      >
                        <div className="text-center">
                          <p className={`text-xs mb-1 ${isCompleted ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <p className={`text-sm font-bold ${isCompleted ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {date.getDate()}
                          </p>
                          {isCompleted && (
                            <Check className="w-4 h-4 mx-auto mt-1" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}