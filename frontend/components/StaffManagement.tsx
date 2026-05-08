
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Batch } from '../types';

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeTab, setActiveTab] = useState<'personnel' | 'batches'>('personnel');
  const [loading, setLoading] = useState(true);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  // Form state for batch
  const [batchForm, setBatchForm] = useState({
    name: '',
    coachId: '',
    schedule: '',
    level: 'Intermediate' as Batch['level']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffData, batchData] = await Promise.all([
        api.getUsers(),
        api.getBatches()
      ]);
      setStaff(staffData);
      setBatches(batchData);
    } catch (err) {
      console.error('Failed to load RCA personnel data');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBatch) {
        await api.updateBatch(editingBatch.id, batchForm);
        alert('Batch updated successfully');
      } else {
        await api.createBatch(batchForm);
        alert('New training batch inaugurated');
      }
      setShowBatchModal(false);
      setEditingBatch(null);
      setBatchForm({ name: '', coachId: '', schedule: '', level: 'Intermediate' });
      fetchData();
    } catch (err) {
      alert('Operation failed. Check administrative permissions.');
    }
  };

  const openEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setBatchForm({
      name: batch.name,
      coachId: batch.coachId || '',
      schedule: batch.schedule,
      level: batch.level
    });
    setShowBatchModal(true);
  };

  const deleteBatch = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this batch?')) return;
    try {
      await api.deleteBatch(id);
      fetchData();
    } catch (err) {
      alert('Deletion failed');
    }
  };

  const coaches = staff.filter(s => s.role === 'Coach');

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6 border-slate-100">
        <div>
          <h3 className="text-3xl font-black text-[#252968] heading-font uppercase tracking-tighter italic">Academy Personnel & Batches</h3>
          <p className="text-sm text-slate-500 font-medium">Manage Coach profiles and Administrative training clusters</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab('personnel')} 
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'personnel' ? 'bg-[#252968] text-[#f2ad3f] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Personnel
          </button>
          <button 
            onClick={() => setActiveTab('batches')} 
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'batches' ? 'bg-[#252968] text-[#f2ad3f] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Training Batches
          </button>
        </div>
      </div>

      {activeTab === 'personnel' ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[#252968] text-[10px] font-black uppercase tracking-widest border-b">
              <tr>
                <th className="py-4 px-8">Staff Member</th>
                <th className="py-4 px-8">Access Role</th>
                <th className="py-4 px-8 text-right">System ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${u.role === 'Admin' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium lowercase">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${u.role === 'Admin' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right font-mono text-[10px] text-slate-300">
                    {u.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="p-20 text-center animate-pulse">
              <span className="text-slate-300 font-black uppercase text-xs tracking-[0.5em]">Fetching Personnel...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
             <button 
              onClick={() => { setShowBatchModal(true); setEditingBatch(null); }}
              className="bg-[#252968] text-[#f2ad3f] px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#1a1d4a] transition-all border border-[#f2ad3f]/30"
            >
              Initialize New Batch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div key={batch.id} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all">
                <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${batch.level === 'Elite' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {batch.level}
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => openEditBatch(batch)} className="text-slate-400 hover:text-[#252968] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </button>
                    <button onClick={() => deleteBatch(batch.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black text-[#252968] uppercase tracking-tighter mb-4 italic">{batch.name}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#252968] font-black text-[10px]">CO</div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Assigned Coach</p>
                        <p className="font-bold text-slate-700">{batch.coachName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-[#f2ad3f] font-black text-[10px]">SC</div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Schedule</p>
                        <p className="font-bold text-slate-700 text-xs">{batch.schedule}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {batches.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-400 font-bold uppercase tracking-widest">No training batches established</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-[#252968]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#252968] p-8 text-[#f2ad3f] flex justify-between items-center">
              <h4 className="font-black heading-font uppercase tracking-widest text-xl">{editingBatch ? 'Edit Training Unit' : 'New Training Batch'}</h4>
              <button onClick={() => setShowBatchModal(false)} className="text-white/50 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleBatchSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Designation</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Under-16 Elite Batting"
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968] transition-all"
                  value={batchForm.name}
                  onChange={e => setBatchForm({...batchForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Coach</label>
                <select 
                  required
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968] bg-white transition-all"
                  value={batchForm.coachId}
                  onChange={e => setBatchForm({...batchForm, coachId: e.target.value})}
                >
                  <option value="">Select a Coach</option>
                  {coaches.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proficiency Level</label>
                  <select 
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968] bg-white transition-all"
                    value={batchForm.level}
                    onChange={e => setBatchForm({...batchForm, level: e.target.value as Batch['level']})}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Schedule</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Mon/Wed/Fri 4PM"
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968] transition-all"
                    value={batchForm.schedule}
                    onChange={e => setBatchForm({...batchForm, schedule: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#f2ad3f] text-[#252968] py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-yellow-500 transition-all mt-4"
              >
                {editingBatch ? 'Confirm Modifications' : 'Initialize Batch Cluster'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
