import React, { useState } from 'react';
import { Student, AttendanceRecord, User } from '../types';
import { api } from '../services/api';

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceRecord[];
  setAttendance: (records: AttendanceRecord[]) => void;
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ students, attendance, setAttendance, user }) => {
  const today = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(today);
  const [markedIds, setMarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleToggle = (id: string) => {
    if (user.role === 'Student') return;
    setMarkedIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.saveAttendance(currentDate, markedIds);
      const newRecord: AttendanceRecord = { date: currentDate, presentIds: markedIds };
      setAttendance([...attendance.filter(r => r.date !== currentDate), newRecord]);
      alert("Attendance synced successfully for " + currentDate);
    } catch (err: any) {
      alert(err.message || "Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b pb-8">
        <div>
          <h3 className="text-3xl font-black text-[#252968] heading-font uppercase tracking-tighter italic">Roll Call</h3>
          <p className="text-sm text-slate-500 font-medium">Daily attendance tracking for Rajendra Cricket Academy</p>
        </div>
        <div className="flex items-center space-x-6">
          <input 
            type="date" 
            value={currentDate} 
            onChange={e => setCurrentDate(e.target.value)}
            className="border-2 border-slate-100 rounded-2xl p-3 font-bold outline-none focus:border-[#252968] bg-slate-50 text-xs"
          />
          {user.role !== 'Student' && (
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-[#252968] text-[#f2ad3f] px-10 py-3 rounded-2xl font-black hover:bg-[#1a1d4a] transition-all shadow-xl text-xs uppercase tracking-widest flex items-center space-x-3"
            >
              {loading ? <div className="w-4 h-4 border-2 border-[#f2ad3f] border-t-transparent animate-spin rounded-full"></div> : null}
              <span>Sync Cloud</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[#252968] text-[10px] font-black uppercase tracking-widest">
              <th className="p-8">Athlete Profile</th>
              <th className="p-8">Category</th>
              <th className="p-8 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-[#252968] text-[#f2ad3f] rounded-2xl flex items-center justify-center font-black text-lg border-2 border-[#f2ad3f]/20 shadow-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block font-black text-slate-800 uppercase italic">{student.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">ID: RCA-{student.id.padStart(3, '0')}</span>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase border border-slate-200">
                    {student.category}
                  </span>
                </td>
                <td className="p-8 text-center">
                  <button
                    onClick={() => handleToggle(student.id)}
                    disabled={user.role === 'Student'}
                    className={`min-w-[120px] py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                      markedIds.includes(student.id)
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}
                  >
                    {markedIds.includes(student.id) ? '✓ PRESENT' : '✗ ABSENT'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
