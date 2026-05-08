
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student, StudentCategory, Batch } from '../types';

interface StudentManagementProps {
  onStudentsUpdate: () => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ onStudentsUpdate }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    age: 15,
    category: StudentCategory.BATSMAN,
    joinDate: new Date().toISOString().split('T')[0],
    batchId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sData, bData] = await Promise.all([api.getStudents(), api.getBatches()]);
      setStudents(sData);
      setBatches(bData);
    } catch (e) {
      console.error("Failed to load RCA data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent.id, formData);
      } else {
        await api.createStudent(formData);
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ name: '', age: 15, category: StudentCategory.BATSMAN, joinDate: new Date().toISOString().split('T')[0], batchId: '' });
      onStudentsUpdate();
    } catch (e) {
      alert("Operation failed. check administrative status.");
    }
  };

  const handleEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({
      name: s.name,
      age: s.age,
      category: s.category,
      joinDate: s.joinDate,
      batchId: s.batchId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove athlete from RCA Roster?")) return;
    try {
      await api.deleteStudent(id);
      onStudentsUpdate();
    } catch (e) {
      alert("Deletion failed.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h3 className="text-3xl font-black text-[#252968] heading-font uppercase tracking-tighter italic">Athlete Registry</h3>
          <p className="text-sm text-slate-500 font-medium">Official Enrollment & Profile Management for Academy Athletes</p>
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setShowModal(true); }}
          className="bg-[#252968] text-[#f2ad3f] px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl border border-[#f2ad3f]/30 hover:bg-[#1a1d4a] transition-all"
        >
          Enroll New Athlete
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[#252968] text-[10px] font-black uppercase tracking-widest border-b">
            <tr>
              <th className="p-8">Athlete Profile</th>
              <th className="p-8">Category</th>
              <th className="p-8">Batch</th>
              <th className="p-8">Enrollment</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students
             .slice()
             .sort((a, b) => a.name.localeCompare(b.name))
             .map(s => (

              <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-8">
                  {batches.find(b => b.id === s.batchId)?.name || '—'}
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#252968] text-[#f2ad3f] flex items-center justify-center font-black text-lg border-2 border-[#f2ad3f]/20 shadow-lg">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800 tracking-tight italic uppercase">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Age: {s.age} • RCA-{s.id.slice(-4)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${s.category === StudentCategory.ALL_ROUNDER ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700'}`}>
                    {s.category}
                  </span>
                </td>
                <td className="p-8 text-slate-500 font-black text-xs uppercase tracking-widest">{s.joinDate}</td>
                <td className="p-8 text-right">
                  <div className="flex justify-end space-x-3">
                    <button onClick={() => handleEdit(s)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase text-slate-300 tracking-[0.5em]">Synchronizing Records...</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#252968]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="bg-[#252968] p-10 text-[#f2ad3f] flex justify-between items-center">
              <h4 className="font-black heading-font uppercase tracking-widest text-2xl">{editingStudent ? 'Edit Athlete' : 'RCA Enrollment'}</h4>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968]" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age Group</label>
                  <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as StudentCategory})} className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968] bg-white">
                    {Object.values(StudentCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Batch</label>
                <select value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} className="w-full border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#252968] bg-white">
                  <option value="">Unassigned</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-[#f2ad3f] text-[#252968] py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-yellow-500 transition-all">Confirm Enrollment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
