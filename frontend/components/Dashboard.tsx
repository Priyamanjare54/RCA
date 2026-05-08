
import React, { useState, useEffect } from 'react';
import { Student, Match, DashboardStats } from '../types';
import { api } from '../services/api';

interface DashboardProps {
  students: Student[];
  matches: Match[];
  quote: string;
}

const Dashboard: React.FC<DashboardProps> = ({ students, matches, quote }) => {
  const [stats, setStats] = useState<DashboardStats>({
    studentCount: students.length,
    matchCount: matches.length,
    batchCount: 0,
    attendanceRate: '...'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      console.warn("Real stats unavailable, using cached.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Motivational Hero */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#252968] to-[#1a1d4a] p-12 text-white shadow-2xl border-b-8 border-[#f2ad3f]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10 md:w-3/4">
          <div className="mb-6 inline-block px-4 py-1.5 bg-[#f2ad3f] text-[#252968] text-[10px] font-black uppercase rounded-full tracking-widest shadow-lg">Daily Mastery Prompt</div>
          <h2 className="text-5xl font-bold heading-font mb-8 italic leading-none tracking-tighter uppercase">" {quote} "</h2>
          <p className="text-blue-100 mb-10 font-medium text-xl max-w-xl border-l-4 border-[#f2ad3f] pl-6 italic">Every session at Rajendra Cricket Academy is a step toward greatness. Own the field today, dominate the world tomorrow.</p>
          <div className="flex space-x-4">
             <button className="bg-[#f2ad3f] text-[#252968] px-10 py-4 rounded-full font-black hover:bg-yellow-500 transition-all shadow-xl uppercase tracking-widest text-xs transform hover:scale-105 active:scale-95 border border-[#252968]/20">
              Access RCA Playbook
            </button>
          </div>
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] opacity-20 rotate-12">
            <svg width="400" height="400" viewBox="0 0 24 24" fill="#f2ad3f">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
        </div>
      </div>

      {/* Today's Actions */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {[
    { label: 'Mark Attendance', action: 'attendance', icon: '📝', color: 'bg-[#252968]' },
    { label: 'Add Performance', action: 'performance', icon: '📊', color: 'bg-[#f2ad3f]' },
    { label: 'Add Player', action: 'students', icon: '➕', color: 'bg-[#252968]' },
    { label: 'Schedule Match', action: 'matches', icon: '🗓️', color: 'bg-[#f2ad3f]' },
  ].map((btn, i) => (
    <button
      key={i}
      onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: btn.action }))}
      className={`${btn.color} text-white rounded-[28px] p-8 shadow-xl hover:scale-[1.03] active:scale-95 transition-all flex flex-col items-center justify-center space-y-4`}
    >
      <span className="text-4xl">{btn.icon}</span>
      <span className="font-black uppercase tracking-widest text-xs">{btn.label}</span>
    </button>
  ))}
</div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'RCA Athletes', value: stats.studentCount, color: 'text-[#252968]', icon: '👥' },
          { label: 'Upcoming Fixtures', value: stats.matchCount, color: 'text-[#f2ad3f]', icon: '🏏' },
          { label: 'Attendance Rate', value: stats.attendanceRate, color: 'text-[#252968]', icon: '📊' },
          { label: 'Active Batches', value: stats.batchCount, color: 'text-blue-900', icon: '⚡' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-slate-50 flex items-center justify-between hover:shadow-xl transition-all group hover:-translate-y-1">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Schedule */}
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
                <h3 className="font-black text-[#252968] heading-font uppercase tracking-widest">Active Match Fixtures</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Academy Schedule</p>
            </div>
            <button className="text-[#f2ad3f] text-[10px] font-black uppercase tracking-widest hover:underline border-2 border-[#f2ad3f]/30 px-4 py-2 rounded-full">Academy Calendar</button>
          </div>
          <div className="divide-y divide-slate-50">
            {matches.slice(0, 4).map((match) => (
              <div key={match.id} className="p-6 hover:bg-blue-50/30 transition-colors flex items-center space-x-6 group">
                <div className="bg-[#252968] text-[#f2ad3f] w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
                  <span className="text-[10px] font-black uppercase opacity-80">{match.date.split('-')[1]}</span>
                  <span className="text-3xl font-black leading-none">{match.date.split('-')[2]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight italic">{match.opponent}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{match.venue}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f2ad3f]"></div>
                    <p className="text-[#252968] font-black text-xs uppercase tracking-widest">{match.format}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="px-4 py-1.5 bg-[#f2ad3f]/10 text-[#252968] rounded-full text-[10px] font-black uppercase border border-[#f2ad3f]/20 shadow-sm">
                    {match.status}
                    </span>
                    <p className="text-[10px] text-slate-300 font-black mt-2">{match.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RCA High Performance Feed */}
        <div className="space-y-6">
            <div className="bg-[#252968] rounded-[32px] p-8 text-white shadow-2xl border border-[#f2ad3f]/30 flex flex-col justify-between relative overflow-hidden h-full min-h-[400px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ad3f] opacity-10 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-[#f2ad3f] rounded-xl flex items-center justify-center text-xl shadow-lg transform -rotate-6">⚡</div>
                  <h3 className="font-black uppercase tracking-[0.2em] text-[#f2ad3f] text-xs">RCA Performance Feed</h3>
                </div>
                <p className="text-blue-50 text-xl italic leading-relaxed mb-8 font-black tracking-tight border-l-2 border-[#f2ad3f]/50 pl-6">
                  "The difference between a good cricketer and an elite one is the willingness to focus on basics when everyone else is looking for shortcuts."
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-[11px] text-[#f2ad3f] font-black italic border border-white/10 uppercase tracking-widest shadow-inner space-y-2">
                <p>NEXT CAMP: RCA PRO INTENSIVE</p>
                <p className="text-white/60">Target: High-Impact Power Hitting</p>
                <div className="pt-4 flex justify-between items-center border-t border-white/10 mt-4">
                    <span>12 ATHLETES SELECTED</span>
                    <span className="bg-[#f2ad3f] text-[#252968] px-2 py-0.5 rounded text-[8px]">INVITE ONLY</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
