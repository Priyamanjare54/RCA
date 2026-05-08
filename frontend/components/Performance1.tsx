
import React, { useState, useEffect, useMemo } from 'react';
import { JSX } from 'react';
import { Student, PerformanceMetric, FitnessTest } from '../types';
import { analyzePerformanceHistory } from '../services/gemini';
import { api } from '../services/api';

interface PerformanceProps {
  students: Student[];
}

type TabType = 'skills' | 'fitness' | 'fitnessHistory';

// Simple tooltip component for the charts
const Tooltip = ({ active, value, date, label }: { active: boolean, value: string | number, date: string, label: string }) => {
  if (!active) return null;
  return (
    <div className="absolute z-20 bg-[#252968] text-white p-3 rounded-xl shadow-2xl border border-[#f2ad3f]/30 text-[10px] -translate-y-full -translate-x-1/2 pointer-events-none animate-in fade-in zoom-in-95">
      <p className="font-black uppercase text-[#f2ad3f] mb-1">{label}</p>
      <p className="font-bold text-lg leading-none">{value}</p>
      <p className="opacity-60 font-medium mt-1">{date}</p>
    </div>
  );
};
const Input = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold focus:border-[#252968] outline-none"
    />
  </div>
);

const Performance: React.FC<PerformanceProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ idx: number, type: string } | null>(null);

  // Form states
  const [skillForm, setSkillForm] = useState({
  batting: { runs: '', balls: '' },
  bowling: { wickets: '', runsConceded: '', overs: '' },
  fielding: { catches: '', runOuts: '', stumpings: '' },
  note: ''
});

  const [fitnessForm, setFitnessForm] = useState({
    pushups: '', squats: '', burpees: '', plankHold: '', chairHold: '',
    sprint20m: '', sprint40m: '', sprint60m: '', yoyoTest: '', notes: ''
  });

  useEffect(() => {
    if (selectedStudent) {
      fetchHistory();
    }
  }, [selectedStudent]);

  const fetchHistory = async () => {
    if (!selectedStudent) return;
    setLoadingHistory(true);
    try {
      const data = await api.getHistory(selectedStudent.id);
      setHistory(data);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAIAnalysis = async () => {
    if (!selectedStudent) return;
    setLoadingAI(true);
    try {
      const historyData = skillHistory.map((h: any) => `
Date: ${h.date}
Batting: ${h.skill.batting.runs} runs off ${h.skill.batting.balls} balls
Bowling: ${h.skill.bowling.wickets}/${h.skill.bowling.runsConceded} in ${h.skill.bowling.overs} overs
Fielding: ${h.skill.fielding.catches} catches, ${h.skill.fielding.runOuts} run-outs, ${h.skill.fielding.stumpings} stumpings
Notes: ${h.skill.notes || 'N/A'}
`).join('\n');

      
      const insight = await analyzePerformanceHistory(
        selectedStudent.name, 
        selectedStudent.category, 
        historyData || "New player, no history yet."
      );
      setAiInsight(insight);
    } catch (e) {
      setAiInsight("AI analysis currently limited to local context. Check database connection.");
    } finally {
      setLoadingAI(false);
    }
  };

  const saveSkills = async () => {
    if (!selectedStudent) return;
    setSubmitting(true);
    try {
      await api.savePerformance({
  studentId: selectedStudent.id,
  date: new Date().toISOString().split('T')[0],
  skill: {
    batting: {
      runs: Number(skillForm.batting.runs),
      balls: Number(skillForm.batting.balls)
    },
    bowling: {
      wickets: Number(skillForm.bowling.wickets),
      runsConceded: Number(skillForm.bowling.runsConceded),
      overs: Number(skillForm.bowling.overs)
    },
    fielding: {
      catches: Number(skillForm.fielding.catches),
      runOuts: Number(skillForm.fielding.runOuts),
      stumpings: Number(skillForm.fielding.stumpings)
    },
    notes: skillForm.note
  }
});


      alert('Performance synced to RCA Database');
      setSkillForm({
        batting: { runs: '', balls: '' },
        bowling: { wickets: '', runsConceded: '', overs: '' },
        fielding: { catches: '', runOuts: '', stumpings: '' },
        note: ''
      });
      fetchHistory();
    } catch (e) {
      alert('Save failed. Database offline.');
    } finally {
      setSubmitting(false);
    }
  };

  const saveFitness = async () => {
  if (!selectedStudent) return;

  setSubmitting(true);

  try {
    await api.saveFitness({
      studentId: selectedStudent.id,
      date: new Date().toISOString().split('T')[0],
      metrics: {
        pushups: Number(fitnessForm.pushups) || 0,
        squats: Number(fitnessForm.squats) || 0,
        burpees: Number(fitnessForm.burpees) || 0,

        plankHold: Number(fitnessForm.plankHold) || 0,   // seconds
        chairHold: Number(fitnessForm.chairHold) || 0,   // seconds

        sprint20m: Number(fitnessForm.sprint20m) || 0,
        sprint40m: Number(fitnessForm.sprint40m) || 0,
        sprint60m: Number(fitnessForm.sprint60m) || 0,

        yoyoTest: fitnessForm.yoyoTest || '',
        notes: fitnessForm.notes || ''
      }
    });

    alert('Fitness test recorded successfully');

    // RESET FORM
    setFitnessForm({
      pushups: '',
      squats: '',
      burpees: '',
      plankHold: '',
      chairHold: '',
      sprint20m: '',
      sprint40m: '',
      sprint60m: '',
      yoyoTest: '',
      notes: ''
    });

    fetchHistory();
  } catch (error) {
    alert('Fitness save failed. Backend unavailable.');
  } finally {
    setSubmitting(false);
  }
};


  // Filter history to get only fitness records and reverse for chronological order
  const fitnessHistory = useMemo(() => {
  return history
    .filter(h => h.metrics)
    .sort((a, b) => a.date.localeCompare(b.date)) // OLDEST → NEWEST
    .slice(-10); // latest 10
}, [history]);


  // Filter history to get only skill records (those with runs or wickets)
  const skillHistory = useMemo(() => {
  return history
    .filter(h => h.skill)
    .sort((a, b) => a.date.localeCompare(b.date));
}, [history]);


  // Chart Helpers
  const getMax = (key: string) => {
    const vals = fitnessHistory.map(h => parseFloat(h.metrics[key]) || 0);
    return Math.max(...vals, 10); // Minimum scale of 10
  };

  const getYoYoValue = (val: string) => {
    if (!val) return 0;
    const parts = val.split('.');
    return parseFloat(parts[0]) + (parts[1] ? parseFloat(parts[1]) / 10 : 0);
  };

  const performerOfMonth = students[0]; 

  return (
    <div className="space-y-8 pb-12">
      {/* Performer of the Month Header */}
      <div className="bg-gradient-to-r from-[#252968] via-[#1a1d4a] to-[#252968] p-1 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="bg-[#252968]/90 rounded-[22px] p-6 flex flex-col md:flex-row items-center justify-between border border-[#f2ad3f]/30">
          <div className="flex items-center space-x-6 z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#f2ad3f] flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(242,173,63,0.4)] animate-pulse border-4 border-[#252968]">
                🏆
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-[#252968] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#f2ad3f]">
                MVP
              </div>
            </div>
            <div>
              <p className="text-[#f2ad3f] text-xs font-black uppercase tracking-[0.3em] mb-1">Elite Recognition</p>
              <h2 className="text-3xl font-black text-white heading-font italic tracking-tight uppercase">Performer of the Month</h2>
              <p className="text-blue-200 text-sm font-medium">Detected based on Elite Fitness & Match Contribution</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right z-10">
            <p className="text-white font-black text-2xl italic uppercase tracking-tighter">{performerOfMonth.name}</p>
            <p className="text-[#f2ad3f] text-[10px] font-bold uppercase tracking-widest">{performerOfMonth.category}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden h-fit">
          <div className="p-6 bg-[#252968] text-[#f2ad3f] flex justify-between items-center">
            <h3 className="font-black text-xs uppercase tracking-widest">RCA Athlete Directory</h3>
            <span className="text-[10px] bg-[#f2ad3f] text-[#252968] px-2 py-0.5 rounded font-black">PRO</span>
          </div>
          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedStudent(s); setAiInsight(''); setHistory([]); }}
                className={`w-full text-left p-6 hover:bg-blue-50/50 transition-all flex items-center justify-between group ${selectedStudent?.id === s.id ? 'bg-blue-50 border-r-8 border-[#f2ad3f]' : ''}`}
              >
                <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${selectedStudent?.id === s.id ? 'bg-[#252968] text-[#f2ad3f]' : 'bg-slate-100 text-slate-400'}`}>
                        {s.name.charAt(0)}
                    </div>
                    <div>
                        <p className={`font-bold transition-colors ${selectedStudent?.id === s.id ? 'text-[#252968]' : 'text-slate-700'}`}>{s.name}</p>
                        <p className="text-[10px] uppercase text-slate-400 tracking-widest font-black">{s.category}</p>
                    </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {selectedStudent ? (
            <>
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 border-b pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#252968] heading-font uppercase">{selectedStudent.name}'s Profile</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Comprehensive Performance Node</p>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner overflow-x-auto whitespace-nowrap">
                    <button onClick={() => setActiveTab('skills')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'skills' ? 'bg-[#252968] text-[#f2ad3f] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Skill Mastery</button>
                    <button onClick={() => setActiveTab('fitness')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'fitness' ? 'bg-[#252968] text-[#f2ad3f] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Fitness Lab</button>
                    <button onClick={() => setActiveTab('fitnessHistory')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'fitnessHistory' ? 'bg-[#252968] text-[#f2ad3f] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Fitness Trends</button>
                  </div>
                </div>

                {activeTab === 'skills' && (
  <div className="space-y-8 bg-slate-50/50 p-8 rounded-3xl border-2 border-slate-100">
    
    {/* Batting */}
    <div>
      <h4 className="font-black text-[#252968] uppercase text-xs tracking-widest mb-4">Batting</h4>
      <div className="grid grid-cols-2 gap-6">
        <input
          type="number"
          placeholder="Runs"
          className="input"
          value={skillForm.batting.runs}
          onChange={e =>
            setSkillForm({ ...skillForm, batting: { ...skillForm.batting, runs: e.target.value } })
          }
        />
        <input
          type="number"
          placeholder="Balls"
          className="input"
          value={skillForm.batting.balls}
          onChange={e =>
            setSkillForm({ ...skillForm, batting: { ...skillForm.batting, balls: e.target.value } })
          }
        />
      </div>
    </div>

    {/* Bowling */}
    <div>
      <h4 className="font-black text-[#252968] uppercase text-xs tracking-widest mb-4">Bowling</h4>
      <div className="grid grid-cols-3 gap-6">
        <input type="number" placeholder="Wickets" className="input"
          value={skillForm.bowling.wickets}
          onChange={e =>
            setSkillForm({ ...skillForm, bowling: { ...skillForm.bowling, wickets: e.target.value } })
          }
        />
        <input type="number" placeholder="Runs Conceded" className="input"
          value={skillForm.bowling.runsConceded}
          onChange={e =>
            setSkillForm({ ...skillForm, bowling: { ...skillForm.bowling, runsConceded: e.target.value } })
          }
        />
        <input type="text" placeholder="Overs (e.g. 4)" className="input"
          value={skillForm.bowling.overs}
          onChange={e =>
            setSkillForm({ ...skillForm, bowling: { ...skillForm.bowling, overs: e.target.value } })
          }
        />
      </div>
    </div>

    {/* Fielding */}
    <div>
      <h4 className="font-black text-[#252968] uppercase text-xs tracking-widest mb-4">Fielding</h4>
      <div className="grid grid-cols-3 gap-6">
        <input type="number" placeholder="Catches" className="input"
          value={skillForm.fielding.catches}
          onChange={e =>
            setSkillForm({ ...skillForm, fielding: { ...skillForm.fielding, catches: e.target.value } })
          }
        />
        <input type="number" placeholder="Run Outs" className="input"
          value={skillForm.fielding.runOuts}
          onChange={e =>
            setSkillForm({ ...skillForm, fielding: { ...skillForm.fielding, runOuts: e.target.value } })
          }
        />
        <input type="number" placeholder="Stumpings (if WK)" className="input"
          value={skillForm.fielding.stumpings}
          onChange={e =>
            setSkillForm({ ...skillForm, fielding: { ...skillForm.fielding, stumpings: e.target.value } })
          }
        />
      </div>
    </div>

    {/* Coach Note */}
    <div>
      <h4 className="font-black text-[#252968] uppercase text-xs tracking-widest mb-2">Coach Note</h4>
      <textarea
        rows={3}
        className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold outline-none focus:border-[#252968]"
        placeholder="One key observation..."
        value={skillForm.note}
        onChange={e => setSkillForm({ ...skillForm, note: e.target.value })}
      />
    </div>

    {/* Save */}
    <button
      onClick={saveSkills}
      disabled={submitting}
      className="w-full bg-[#252968] text-[#f2ad3f] py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl"
    >
      {submitting ? 'Saving...' : 'Save Performance'}
    </button>
  </div>
)}


                {activeTab === 'fitness' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Strength */}
  <Input label="Push-ups (reps)" value={fitnessForm.pushups} onChange={v => setFitnessForm({...fitnessForm, pushups: v})} />
  <Input label="Squats (reps)" value={fitnessForm.squats} onChange={v => setFitnessForm({...fitnessForm, squats: v})} />
  <Input label="Burpees (reps)" value={fitnessForm.burpees} onChange={v => setFitnessForm({...fitnessForm, burpees: v})} />

  {/* Holds */}
  <Input label="Plank Hold (sec)" value={fitnessForm.plankHold} onChange={v => setFitnessForm({...fitnessForm, plankHold: v})} />
  <Input label="Chair Hold (sec)" value={fitnessForm.chairHold} onChange={v => setFitnessForm({...fitnessForm, chairHold: v})} />

  {/* Speed */}
  <Input label="Sprint 20m (sec)" value={fitnessForm.sprint20m} onChange={v => setFitnessForm({...fitnessForm, sprint20m: v})} />
  <Input label="Sprint 40m (sec)" value={fitnessForm.sprint40m} onChange={v => setFitnessForm({...fitnessForm, sprint40m: v})} />
  <Input label="Sprint 60m (sec)" value={fitnessForm.sprint60m} onChange={v => setFitnessForm({...fitnessForm, sprint60m: v})} />

  {/* Endurance */}
  <Input label="Yo-Yo Test Level" value={fitnessForm.yoyoTest} onChange={v => setFitnessForm({...fitnessForm, yoyoTest: v})} />
</div>

                )}

                {activeTab === 'fitnessHistory' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-[#252968] text-sm uppercase tracking-widest">Longitudinal Fitness Data</h4>
                      <button onClick={fetchHistory} className="text-[10px] font-black uppercase text-[#f2ad3f] hover:underline">Refresh Feed</button>
                    </div>

                    {loadingHistory ? (
                      <div className="p-20 text-center animate-pulse">
                        <div className="inline-block w-8 h-8 border-4 border-[#252968] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Historical Vault...</p>
                      </div>
                    ) : fitnessHistory.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

  {/* 🟦 Strength */}
  {/* (Keep your existing Pushups + Squats bar chart here unchanged) */}

  {/* 🟨 Speed – Sprint 20 / 40 / 60 */}
  <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">
      Sprint Progression (Lower = Faster)
    </p>

    <div className="flex items-end h-48 space-x-2">
      {fitnessHistory.map((h, i) => {
        const max = Math.max(
          ...fitnessHistory.flatMap(x => [
            Number(x.metrics.sprint20m || 0),
            Number(x.metrics.sprint40m || 0),
            Number(x.metrics.sprint60m || 0)
          ])
        ) || 10;

        return (
          <div key={i} className="flex-1 flex flex-col space-y-1">
            <div className="bg-[#252968]" style={{ height: `${(h.metrics.sprint20m / max) * 100}%` }} title={`20m: ${h.metrics.sprint20m}s`} />
            <div className="bg-[#f2ad3f]" style={{ height: `${(h.metrics.sprint40m / max) * 100}%` }} title={`40m: ${h.metrics.sprint40m}s`} />
            <div className="bg-slate-400" style={{ height: `${(h.metrics.sprint60m / max) * 100}%` }} title={`60m: ${h.metrics.sprint60m}s`} />
          </div>
        );
      })}
    </div>
  </div>

  {/* 🟪 Holds – Plank & Chair */}
  <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">
      Static Holds Capacity
    </p>

    <div className="flex items-end h-48 space-x-2">
      {fitnessHistory.map((h, i) => {
        const max = Math.max(
          ...fitnessHistory.flatMap(x => [
            Number(x.metrics.plankHold || 0),
            Number(x.metrics.chairHold || 0)
          ])
        ) || 60;

        return (
          <div key={i} className="flex-1 flex flex-col space-y-1">
            <div className="bg-[#252968]" style={{ height: `${(h.metrics.plankHold / max) * 100}%` }} title={`Plank: ${h.metrics.plankHold}s`} />
            <div className="bg-[#f2ad3f]" style={{ height: `${(h.metrics.chairHold / max) * 100}%` }} title={`Chair: ${h.metrics.chairHold}s`} />
          </div>
        );
      })}
    </div>
  </div>
  
  {/* 🟢 Yo-Yo Endurance Trend */}
<div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner relative">
  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
    Yo-Yo Endurance Progression
  </p>
  <p className="text-[10px] text-slate-500 mb-4">
    Level achieved • Oldest → Latest (Last 10 Tests)
  </p>

  <div className="h-56 relative">
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">

      {/* Grid */}
      {[20, 40, 60, 80].map(y => (
        <line
          key={y}
          x1="0"
          x2="100"
          y1={y}
          y2={y}
          stroke="#e5e7eb"
          strokeDasharray="2"
        />
      ))}

      {fitnessHistory.length > 1 && (() => {
        const values = fitnessHistory.map(h => Number(h.metrics.yoyoTest || 0));
        const max = Math.max(...values, 15);
        const min = Math.min(...values, 10);
        const range = max - min || 1;

        const points = fitnessHistory.map((h, i) => {
          const x = (i / (fitnessHistory.length - 1)) * 100;
          const y = 100 - ((Number(h.metrics.yoyoTest) - min) / range) * 80 - 10;
          return { x, y, value: h.metrics.yoyoTest, date: h.date };
        });

        return (
          <>
            {/* Area */}
            <polyline
              points={`0,100 ${points.map(p => `${p.x},${p.y}`).join(' ')} 100,100`}
              fill="url(#yoyoFill)"
              opacity="0.25"
            />

            {/* Line */}
            <polyline
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#252968"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Points + Hover */}
            {points.map((p, i) => (
              <g key={i}>
                {/* Vertical hover guide */}
                {hoveredPoint?.idx === i && hoveredPoint?.type === 'yoyo' && (
                  <line
                    x1={p.x}
                    x2={p.x}
                    y1="0"
                    y2="100"
                    stroke="#f2ad3f"
                    strokeDasharray="4"
                    opacity="0.4"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.idx === i ? 6 : 4}
                  fill="#f2ad3f"
                  stroke="#252968"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint({ idx: i, type: 'yoyo' })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Tooltip */}
                <foreignObject
                  x={p.x - 30}
                  y={p.y - 50}
                  width="60"
                  height="40"
                  className="pointer-events-none overflow-visible"
                >
                  <Tooltip
                    active={hoveredPoint?.idx === i && hoveredPoint?.type === 'yoyo'}
                    value={`Level ${p.value}`}
                    date={p.date}
                    label="Yo-Yo Test"
                  />
                </foreignObject>
              </g>
            ))}

            <defs>
              <linearGradient id="yoyoFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#252968" />
                <stop offset="100%" stopColor="#252968" stopOpacity="0" />
              </linearGradient>
            </defs>
          </>
        );
      })()}
    </svg>

    {fitnessHistory.length < 2 && (
      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 font-black uppercase">
        Minimum 2 tests required
      </div>
    )}
  </div>
</div>


                        {/* Detailed Historical List */}
                        <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm bg-white">
                          <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                            <h5 className="text-[10px] font-black uppercase text-[#252968] tracking-widest">Full Historical Vault</h5>
                          </div>
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                              <tr>
                                <th className="p-6">Date Node</th>
                                <th className="p-6">Pushups</th>
                                <th className="p-6">Squats</th>
                                <th className="p-6">Yo-Yo</th>
                                <th className="p-6">Coach's Verdict</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                              {fitnessHistory.slice().reverse().map((h, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                  <td className="p-6 text-[#252968] font-black italic">{h.date}</td>
                                  <td className="p-6">{h.metrics.pushups} <span className="text-[8px] opacity-30 ml-1">REPS</span></td>
                                  <td className="p-6">{h.metrics.squats} <span className="text-[8px] opacity-30 ml-1">REPS</span></td>
                                  <td className="p-6 font-mono text-[#f2ad3f]">{h.metrics.yoyoTest || '-'}</td>
                                  <td className="p-6 italic text-slate-400 truncate max-w-[200px]">{h.metrics.notes || 'Routine elite evaluation'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                        <div className="text-4xl mb-4 opacity-20">📉</div>
                        <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No longitudinal data available for this athlete</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {aiInsight && (
                <div className="bg-gradient-to-br from-[#252968] to-[#1a1d4a] rounded-3xl p-10 text-white shadow-2xl border-l-8 border-[#f2ad3f] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                    <div className="relative z-10"><h4 className="font-black text-lg uppercase tracking-tight text-[#f2ad3f] mb-4">Advanced Performance Audit</h4>
                    <div className="prose prose-invert max-w-none text-blue-50 leading-relaxed font-medium bg-white/5 p-8 rounded-2xl border border-white/10 italic whitespace-pre-wrap text-sm shadow-inner">{aiInsight}</div></div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-24 text-center">
                <h3 className="text-2xl font-black text-[#252968] uppercase tracking-widest mb-2">Athlete Node Locked</h3>
                <p className="text-slate-400 text-sm font-medium">Please select an RCA athlete from the directory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
