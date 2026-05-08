
import React from 'react';
import { View } from '../App';
import { ICONS } from '../constants';
import { User } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, user, onLogout }) => {
  const menuItems: { name: View; icon: React.ReactNode; restricted?: boolean }[] = [
    { name: 'Dashboard', icon: ICONS.Dashboard },
    { 
        name: 'Students', 
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        restricted: true 
    },
    { name: 'Attendance', icon: ICONS.Attendance },
    { name: 'Performance', icon: ICONS.Performance },
    { name: 'Schedule', icon: ICONS.Schedule },
    { name: 'VideoAI', icon: ICONS.VideoAI },
    { name: 'Chat', icon: ICONS.Chat },
    { 
      name: 'Staff', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      restricted: true 
    },
  ];

  const filteredItems = menuItems.filter(item => {
    if (item.restricted && user.role !== 'Admin') return false;
    return true;
  });

  return (
    <div className="w-72 bg-[#252968] text-white flex flex-col h-full shadow-[10px_0_30px_rgba(0,0,0,0.1)] transition-all border-r-8 border-[#f2ad3f]">
      <div className="p-10">
        <h1 className="text-3xl font-black heading-font tracking-tighter italic leading-none">
          RAJENDRA <span className="text-[#f2ad3f]">CRICKET</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#f2ad3f] font-black opacity-80 mt-2">Elite Manager Pro</p>
      </div>

      <nav className="flex-1 mt-6 space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name)}
            className={`w-full flex items-center space-x-4 px-10 py-5 transition-all duration-300 relative group ${
              activeView === item.name
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {activeView === item.name && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#f2ad3f] shadow-[0_0_15px_rgba(242,173,63,0.5)]"></div>
            )}
            <span className={`transition-transform duration-300 group-hover:scale-110 ${activeView === item.name ? 'text-[#f2ad3f]' : ''}`}>{item.icon}</span>
            <span className="font-black text-xs uppercase tracking-widest">{item.name === 'VideoAI' ? 'AI Performance' : item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-10 border-t border-white/5 space-y-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transform transition-transform hover:rotate-6 ${user.role === 'Admin' ? 'bg-red-500/20 border-red-500/50' : 'bg-blue-500/20 border-[#f2ad3f]/50'}`}>
            <span className={`${user.role === 'Admin' ? 'text-red-400' : 'text-[#f2ad3f]'} font-black text-lg`}>{user.name.charAt(0)}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate uppercase tracking-tighter italic">{user.name}</p>
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${user.role === 'Admin' ? 'text-red-400' : 'text-[#f2ad3f]'}`}>{user.role} UNIT</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-3 py-3 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl border border-red-500/20 transition-all shadow-lg active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Deauthorize</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
