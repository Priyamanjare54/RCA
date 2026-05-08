
import React, { useState } from 'react';
import { Student, AttendanceRecord } from '../types';
import { api } from '../services/api';

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceRecord[];
  setAttendance: (records: AttendanceRecord[]) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ students, attendance, setAttendance }) => {
  const today = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(today);
  const [markedIds, setMarkedIds] = useState<string[]>(
  students.map(s => s.id)
);

  const [loading, setLoading] = useState(false);

  const handleToggle = (id: string) => {
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
      alert("Attendance synced to RCA Cloud for " + currentDate);
    } catch (err) {
  alert("Failed to save attendance. Please retry.");
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b pb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#252968] heading-font uppercase">Roll Call</h3>
          <p className="text-sm text-slate-500">Log attendance for today's session at Rajendra Cricket Academy</p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
  <h3 className="text-2xl font-bold text-[#252968] heading-font uppercase">
    Today’s Attendance
  </h3>
  <p className="text-sm text-slate-500">
    {new Date().toDateString()} • Rajendra Cricket Academy
  </p>
</div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#252968] text-[#f2ad3f] px-8 py-2 rounded-lg font-black hover:bg-[#1a1d4a] transition-all shadow-md text-sm uppercase tracking-widest border border-[#f2ad3f]/30 flex items-center space-x-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-[#f2ad3f] border-t-transparent animate-spin rounded-full"></div> : null}
            <span>{loading ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[#252968] text-xs font-black uppercase tracking-widest">
              <th className="py-4 px-6 rounded-tl-lg">Student Profile</th>
              <th className="py-4 px-6">Field Category</th>
              <th className="py-4 px-6 text-center rounded-tr-lg">Presence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="py-5 px-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#252968] text-[#f2ad3f] rounded-full flex items-center justify-center font-black text-sm border-2 border-[#f2ad3f]/20 shadow-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                        <span className="block font-bold text-slate-800">{student.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">ID: RCA-{student.id.padStart(3, '0')}</span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                    {student.category}
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <button
                    onClick={() => handleToggle(student.id)}
                    className={`min-w-[100px] px-4 py-2 rounded-lg text-xs font-black transition-all transform active:scale-95 ${
                      markedIds.includes(student.id)
  ? 'bg-green-600 text-white'
  : 'bg-red-100 text-red-700'

                    }`}
                  >
                    {markedIds.includes(student.id) ? 'PRESENT' : 'ABSENT'}

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
