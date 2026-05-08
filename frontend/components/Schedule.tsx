
import React, { useState } from 'react';
import { Match, User } from '../types';
import { api } from '../services/api';

interface ScheduleProps {
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  user: User;
}

const Schedule: React.FC<ScheduleProps> = ({ matches, setMatches, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  
  const [formData, setFormData] = useState<Partial<Match>>({
    opponent: '',
    date: '',
    time: '',
    venue: '',
    format: 'T20',
    status: 'Scheduled'
  });

  const isAdmin = user.role === 'Admin';

  const handleSave = async () => {
    if (!isAdmin) return;
    if (!formData.opponent || !formData.date) return;
    setLoading(true);
    try {
      if (editingMatch) {
        const updated = await api.updateMatch(editingMatch.id, formData);
        setMatches(matches.map(m => m.id === editingMatch.id ? updated : m));
      } else {
        const match = await api.createMatch(formData);
        setMatches([...matches, match]);
      }
      setShowModal(false);
      setEditingMatch(null);
      setFormData({ opponent: '', date: '', time: '', venue: '', format: 'T20', status: 'Scheduled' });
      alert('Match Protocol Finalized.');
    } catch (err) {
      alert('Protocol sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this match from schedule?")) return;
    try {
        await api.deleteMatch(id);
        setMatches(matches.filter(m => m.id !== id));
    } catch (e) {
        alert("Operation failed.");
    }
  };

  const openEdit = (m: Match) => {
    setEditingMatch(m);
    setFormData(m);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-slate-100">
        <div>
          <h3 className="text-4xl font-black text-[#252968] heading-font uppercase tracking-tighter">
  Match Schedule
</h3>

          <p className="text-sm text-slate-500 font-medium">Official RCA Inter-Academy Tournament & Elite Match Schedule</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setEditingMatch(null); setShowModal(true); }}
            className="bg-[#252968] text-[#f2ad3f] px-10 py-4 rounded-full font-black hover:bg-[#1a1d4a] transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-widest border-2 border-[#f2ad3f]/30"
          >
            Schedule New Match
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.length > 0 ? matches.map((match) => (
          <div key={match.id} className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all relative">
            <div className={`p-6 text-white flex justify-between items-center border-b-8 ${match.status === 'Cancelled' ? 'bg-red-900 border-red-500' : 'bg-[#252968] border-[#f2ad3f]'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f2ad3f]">{match.format}</span>
              <span className="bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">{match.status}</span>
            </div>
            <div className="p-10 space-y-6">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2">VS OPPONENT</p>
                <h4 className="font-black text-[#252968] text-2xl italic uppercase tracking-tighter leading-none">{match.opponent}</h4>
              </div>
              <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                <div className="flex items-center space-x-4 text-slate-600 text-sm font-black uppercase tracking-widest">
                    <span className="text-lg">📅</span> <span>{match.date}</span>
                </div>
                <div className="flex items-center space-x-4 text-slate-600 text-sm font-black uppercase tracking-widest">
                    <span className="text-lg">📍</span> <span className="truncate">{match.venue || 'RCA ARENA'}</span>
                </div>
                <div className="flex items-center space-x-4 text-slate-600 text-sm font-black uppercase tracking-widest">
                    <span className="text-lg">🕒</span> <span>{match.time || 'TBD'}</span>
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                    <button onClick={() => openEdit(match)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#252968] hover:text-[#f2ad3f] transition-all">Edit</button>
                    <button onClick={() => handleDelete(match.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">Delete</button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-4 border-dashed border-slate-200">
            <div className="text-6xl mb-6 opacity-10">🏟️</div>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">No Combat Fixtures Announced</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#252968]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-t-8 border-[#f2ad3f]">
            <div className="p-10 border-b flex justify-between items-center">
              <h4 className="font-black text-[#252968] heading-font uppercase tracking-widest text-2xl">{loading ? 'Saving...' : 'Save Match Schedule'}</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-10 space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Opponent</label>
                    <input type="text" className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-[#252968]" value={formData.opponent} onChange={e => setFormData({...formData, opponent: e.target.value})} placeholder="e.g. Royal Bengal Academy" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deployment Date</label>
                        <input type="date" className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-[#252968]" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Engagement Time</label>
                        <input type="time" className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-[#252968]" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Format</label>
                        <select className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-[#252968] bg-white" value={formData.format} onChange={e => setFormData({...formData, format: e.target.value as Match['format']})}>
                            <option value="T20">T20 (Elite)</option>
                            <option value="ODI">ODI (Long Format)</option>
                            <option value="Test">Academy Test</option>
                            <option value="Friendly">Friendly Scrimmage</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                        <select className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-[#252968] bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Match['status']})}>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleSave} disabled={loading} className="w-full bg-[#f2ad3f] text-[#252968] py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-yellow-500 transition-all flex items-center justify-center space-x-2">
                    {loading ? <div className="w-6 h-6 border-4 border-[#252968] border-t-transparent animate-spin rounded-full"></div> : <span>Broadcast Protocol</span>}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
