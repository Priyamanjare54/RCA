
import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord, Match, User } from './types';
import { MOCK_STUDENTS, MOCK_MATCHES, MOTIVATIONAL_QUOTES } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Performance from './components/Performance';
import Schedule from './components/Schedule';
import VideoAnalysis from './components/VideoAnalysis';
import Chatbot from './components/Chatbot';
import Auth from './components/Auth';
import StaffManagement from './components/StaffManagement';
import StudentManagement from './components/StudentManagement';
import { api } from './services/api';

export type View = 'Dashboard' | 'Attendance' | 'Performance' | 'Schedule' | 'VideoAI' | 'Chat' | 'Staff' | 'Students';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [dailyQuote, setDailyQuote] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setDailyQuote(randomQuote);

    // Restore Session
    const savedUser = localStorage.getItem('rca_user');
    const savedToken = localStorage.getItem('rca_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      initData();
    }

    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetView = customEvent.detail;
      const viewMap: Record<string, View> = {
        'attendance': 'Attendance',
        'performance': 'Performance',
        'students': 'Students',
        'matches': 'Schedule'
      };
      if (viewMap[targetView]) {
        setActiveView(viewMap[targetView]);
      }
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const initData = async () => {
    try {
      const [fetchedStudents, fetchedMatches] = await Promise.all([
        api.getStudents(),
        api.getMatches()
      ]);
      if (fetchedStudents?.length > 0) setStudents(fetchedStudents);
      if (fetchedMatches?.length > 0) setMatches(fetchedMatches);
      setIsOnline(true);
    } catch (err) {
      console.warn('Operating in local mode.');
      setIsOnline(false);
    }
  };

  const handleLogin = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem('rca_token', token);
    localStorage.setItem('rca_user', JSON.stringify(newUser));
    initData();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rca_token');
    localStorage.removeItem('rca_user');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderView = () => {
    // Role-based view protection
    const isRestricted = (v: View) => v === 'Staff' && user.role !== 'Admin';
    if (isRestricted(activeView)) {
      return <Dashboard students={students} matches={matches} quote={dailyQuote} />;
    }

    switch (activeView) {
      case 'Dashboard': return <Dashboard students={students} matches={matches} quote={dailyQuote} />;
      case 'Attendance': return <Attendance students={students} attendance={attendance} setAttendance={setAttendance} user={user} />;
      case 'Performance': return <Performance students={students} user={user} />;
      case 'Schedule': return <Schedule matches={matches} setMatches={setMatches} user={user} />;
      case 'VideoAI': return <VideoAnalysis />;
      case 'Chat': return <Chatbot />;
      case 'Staff': return <StaffManagement />;
      case 'Students': return <StudentManagement onStudentsUpdate={initData} user={user} />;
      default: return <Dashboard students={students} matches={matches} quote={dailyQuote} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 z-10 shadow-sm">
          <div className="flex items-center space-x-6">
            <h2 className="text-2xl font-black text-[#252968] heading-font uppercase tracking-tighter italic">{activeView}</h2>
            <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${isOnline ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 animate-pulse'}`}></div>
              <span>{isOnline ? 'RCA CLOUD ACTIVE' : 'OFFLINE SYNC ACTIVE'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-xs text-slate-400 font-black uppercase tracking-widest">{new Date().toDateString()}</span>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black border-2 shadow-xl uppercase transform transition-transform hover:rotate-3 ${user.role === 'Admin' ? 'bg-[#f2ad3f] text-[#252968] border-[#252968]' : 'bg-[#252968] text-[#f2ad3f] border-[#f2ad3f]'}`}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
