import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../types';
import { analyzePerformanceHistory } from '../services/gemini';
import { api } from '../services/api';

interface PerformanceProps {
  students: Student[];
}

type TabType = 'skills' | 'fitness' | 'fitnessHistory';

/* ---------------- TOOLTIP ---------------- */
const Tooltip = ({
  active,
  value,
  date,
  label
}: {
  active: boolean;
  value: string | number;
  date: string;
  label: string;
}) => {
  if (!active) return null;
  return (
    <div className="absolute z-20 bg-[#252968] text-white p-3 rounded-xl shadow-2xl border border-[#f2ad3f]/30 text-[10px] -translate-y-full -translate-x-1/2 pointer-events-none">
      <p className="font-black uppercase text-[#f2ad3f] mb-1">{label}</p>
      <p className="font-bold text-lg">{value}</p>
      <p className="opacity-60 mt-1">{date}</p>
    </div>
  );
};

/* ---------------- INPUT ---------------- */
const Input = ({
  label,
  value,
  onChange,
  type = 'number'
}: any) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold focus:border-[#252968] outline-none"
    />
  </div>
);

const TrendBar = ({
  title,
  data,
  valueKey,
  color
}: {
  title: string;
  data: any[];
  valueKey: string;
  color: string;
}) => {
  const max = Math.max(...data.map(d => d.metrics[valueKey] || 0), 10);

  return (
    <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
        {title}
      </h4>

      <div className="flex items-end h-40 space-x-2">
        {data.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md"
            style={{
              height: `${(h.metrics[valueKey] / max) * 100}%`,
              backgroundColor: color
            }}
            title={`${h.metrics[valueKey]}`
            }
          />
        ))}
      </div>
    </div>
  );
};


/* ================== MAIN ================== */
const Performance: React.FC<PerformanceProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ idx: number; chart: string } | null>(null);

  /* ---------- FORMS ---------- */
  const [skillForm, setSkillForm] = useState({
    batting: { runs: '', balls: '' },
    bowling: { wickets: '', runsConceded: '', overs: '' },
    fielding: { catches: '', runOuts: '', stumpings: '' },
    note: ''
  });

  const [fitnessForm, setFitnessForm] = useState({
    pushups: '',
    squats: '',
    burpees: '',
    plankHold: '',
    chairHold: '',
    sprint20m: '',
    sprint40m: '',
    sprint60m: '',
    notes: ''
  });

  /* ---------- FETCH HISTORY ---------- */
  useEffect(() => {
    if (selectedStudent) fetchHistory();
  }, [selectedStudent]);

  const fetchHistory = async () => {
    if (!selectedStudent) return;
    setLoadingHistory(true);
    try {
      const data = await api.getHistory(selectedStudent.id);
      setHistory(data);
    } finally {
      setLoadingHistory(false);
    }
  };

  /* ---------- SAVE FITNESS ---------- */
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
          plankHold: Number(fitnessForm.plankHold) || 0,
          chairHold: Number(fitnessForm.chairHold) || 0,
          sprint20m: Number(fitnessForm.sprint20m) || 0,
          sprint40m: Number(fitnessForm.sprint40m) || 0,
          sprint60m: Number(fitnessForm.sprint60m) || 0,
          notes: fitnessForm.notes
        }
      });

      alert('Fitness test saved');
      setFitnessForm({
        pushups: '',
        squats: '',
        burpees: '',
        plankHold: '',
        chairHold: '',
        sprint20m: '',
        sprint40m: '',
        sprint60m: '',
        notes: ''
      });

      fetchHistory();
    } catch {
      alert('Save failed');
    } finally {
      setSubmitting(false);
    }
  };
/* ---------- SAVE SKILLS ---------- */
  const saveSkills = async () => {
  if (!selectedStudent) return;

  setSubmitting(true);

  try {
    await api.savePerformance({
      studentId: selectedStudent.id,
      date: new Date().toISOString().split('T')[0],
      skill: {
        batting: {
          runs: Number(skillForm.batting.runs) || 0,
          balls: Number(skillForm.batting.balls) || 0
        },
        bowling: {
          wickets: Number(skillForm.bowling.wickets) || 0,
          runsConceded: Number(skillForm.bowling.runsConceded) || 0,
          overs: Number(skillForm.bowling.overs) || 0
        },
        fielding: {
          catches: Number(skillForm.fielding.catches) || 0,
          runOuts: Number(skillForm.fielding.runOuts) || 0,
          stumpings: Number(skillForm.fielding.stumpings) || 0
        },
        notes: skillForm.note || ''
      }
    });

    alert('Skill performance saved successfully');

    // Reset form
    setSkillForm({
      batting: { runs: '', balls: '' },
      bowling: { wickets: '', runsConceded: '', overs: '' },
      fielding: { catches: '', runOuts: '', stumpings: '' },
      note: ''
    });

    fetchHistory();
  } catch (error) {
    alert('Skill save failed. Backend unavailable.');
  } finally {
    setSubmitting(false);
  }
};

  /* ---------- FITNESS HISTORY ---------- */
  const fitnessHistory = useMemo(() => {
    return history
      .filter(h => h.metrics)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10);
  }, [history]);

  /* ================== UI ================== */
  return (
    <div className="space-y-8 pb-12">

      {/* STUDENT LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className={`w-full text-left p-4 border-b hover:bg-blue-50 ${
                selectedStudent?.id === s.id ? 'bg-blue-50 border-r-4 border-[#f2ad3f]' : ''
              }`}
            >
              <div className="font-bold">{s.name}</div>
              <div className="text-xs text-slate-400">{s.category}</div>
            </button>
          ))}
        </div>

        {/* MAIN */}
        <div className="lg:col-span-2">
          {!selectedStudent ? (
            <div className="bg-white p-20 rounded-3xl text-center shadow">
              Select an athlete
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-xl">

              {/* TABS */}
              <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
                {['skills', 'fitness', 'fitnessHistory'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as TabType)}
                    className={`flex-1 py-2 text-xs font-black uppercase rounded-lg ${
                      activeTab === t
                        ? 'bg-[#252968] text-[#f2ad3f]'
                        : 'text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
                {/* SKILLS LAB */}
                {activeTab === 'skills' && (
  <div className="space-y-8 bg-slate-50/60 p-8 rounded-3xl border-2 border-slate-100">

    {/* Batting */}
    <div>
      <h4 className="font-black text-[#252968] uppercase text-xs tracking-widest mb-4">
        Batting Performance
      </h4>
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Runs"
          value={skillForm.batting.runs}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              batting: { ...skillForm.batting, runs: v }
            })
          }
        />
        <Input
          label="Balls Faced"
          value={skillForm.batting.balls}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              batting: { ...skillForm.batting, balls: v }
            })
          }
        />
      </div>
    </div>

    {/* Bowling */}
    <div>
      <h4 className="font-black text-[#252968] uppercase text-xs tracking-widest mb-4">
        Bowling Performance
      </h4>
      <div className="grid grid-cols-3 gap-6">
        <Input
          label="Wickets"
          value={skillForm.bowling.wickets}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              bowling: { ...skillForm.bowling, wickets: v }
            })
          }
        />
        <Input
          label="Runs Conceded"
          value={skillForm.bowling.runsConceded}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              bowling: { ...skillForm.bowling, runsConceded: v }
            })
          }
        />
        <Input
          label="Overs Bowled"
          value={skillForm.bowling.overs}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              bowling: { ...skillForm.bowling, overs: v }
            })
          }
        />
      </div>
    </div>

    {/* Fielding */}
    <div>
      <h4 className="font-black text-[#252968] uppercase text-xs tracking-widest mb-4">
        Fielding Contribution
      </h4>
      <div className="grid grid-cols-3 gap-6">
        <Input
          label="Catches"
          value={skillForm.fielding.catches}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              fielding: { ...skillForm.fielding, catches: v }
            })
          }
        />
        <Input
          label="Run Outs"
          value={skillForm.fielding.runOuts}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              fielding: { ...skillForm.fielding, runOuts: v }
            })
          }
        />
        <Input
          label="Stumpings (WK)"
          value={skillForm.fielding.stumpings}
          onChange={(v: string) =>
            setSkillForm({
              ...skillForm,
              fielding: { ...skillForm.fielding, stumpings: v }
            })
          }
        />
      </div>
    </div>

    {/* Coach Note */}
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">
        Coach Observation
      </label>
      <textarea
        rows={3}
        className="w-full border-2 border-slate-200 rounded-xl p-4 font-bold focus:border-[#252968] outline-none"
        placeholder="One key technical or mindset observation..."
        value={skillForm.note}
        onChange={e =>
          setSkillForm({ ...skillForm, note: e.target.value })
        }
      />
    </div>

    {/* Save Button */}
    <button
      onClick={saveSkills}
      disabled={submitting}
      className="w-full bg-[#252968] text-[#f2ad3f] py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl"
    >
      {submitting ? 'Saving Match Data...' : 'Save Match Performance'}
    </button>

  </div>
)}

              {/* FITNESS LAB */}
              {activeTab === 'fitness' && (
                <div className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Pushups" value={fitnessForm.pushups} onChange={(v: any) => setFitnessForm({ ...fitnessForm, pushups: v })} />
                    <Input label="Squats" value={fitnessForm.squats} onChange={(v: any) => setFitnessForm({ ...fitnessForm, squats: v })} />
                    <Input label="Burpees" value={fitnessForm.burpees} onChange={(v: any) => setFitnessForm({ ...fitnessForm, burpees: v })} />

                    <Input label="Plank Hold (sec)" value={fitnessForm.plankHold} onChange={(v: any) => setFitnessForm({ ...fitnessForm, plankHold: v })} />
                    <Input label="Chair Hold (sec)" value={fitnessForm.chairHold} onChange={(v: any) => setFitnessForm({ ...fitnessForm, chairHold: v })} />

                    <Input label="Sprint 20m (sec)" value={fitnessForm.sprint20m} onChange={(v: any) => setFitnessForm({ ...fitnessForm, sprint20m: v })} />
                    <Input label="Sprint 40m (sec)" value={fitnessForm.sprint40m} onChange={(v: any) => setFitnessForm({ ...fitnessForm, sprint40m: v })} />
                    <Input label="Sprint 60m (sec)" value={fitnessForm.sprint60m} onChange={(v: any) => setFitnessForm({ ...fitnessForm, sprint60m: v })} />
                  </div>

                  <textarea
                    placeholder="Coach notes"
                    className="w-full border-2 rounded-xl p-4 font-bold"
                    rows={2}
                    value={fitnessForm.notes}
                    onChange={e => setFitnessForm({ ...fitnessForm, notes: e.target.value })}
                  />

                  <button
                    onClick={saveFitness}
                    disabled={submitting}
                    className="w-full bg-[#252968] text-[#f2ad3f] py-4 rounded-2xl font-black uppercase"
                  >
                    {submitting ? 'Saving...' : 'Save Fitness Test'}
                  </button>
                </div>
              )}

              {/* FITNESS HISTORY */}
              {activeTab === 'fitnessHistory' && (
  <div className="space-y-10">

    <p className="text-xs uppercase font-black text-slate-400">
      Latest 10 Fitness Tests • Oldest → Latest
    </p>

    {/* PUSHUPS */}
    <TrendBar
      title="Pushups (Reps)"
      data={fitnessHistory}
      valueKey="pushups"
      color="#252968"
    />

    {/* SQUATS */}
    <TrendBar
      title="Squats (Reps)"
      data={fitnessHistory}
      valueKey="squats"
      color="#f2ad3f"
    />

    {/* BURPEES */}
    <TrendBar
      title="Burpees (Reps)"
      data={fitnessHistory}
      valueKey="burpees"
      color="#64748b"
    />

    {/* HOLDS */}
    <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner">
  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
    Static Holds (Seconds)
  </h4>

  <div className="flex items-end h-40 space-x-2">
    {fitnessHistory.map((h, i) => {
      const plank = Number(h.metrics.plankHold) || 0;
      const chair = Number(h.metrics.chairHold) || 0;

      const max = Math.max(
        ...fitnessHistory.flatMap(x => [
          Number(x.metrics.plankHold) || 0,
          Number(x.metrics.chairHold) || 0
        ]),
        10
      );

      return (
        <div key={i} className="flex-1 flex flex-col justify-end space-y-1">
          <div
            className="bg-[#252968] rounded-t"
            style={{ height: `${(plank / max) * 100}%` }}
            title={`Plank: ${plank}s`}
          />
          <div
            className="bg-[#f2ad3f] rounded-t"
            style={{ height: `${(chair / max) * 100}%` }}
            title={`Chair: ${chair}s`}
          />
        </div>
      );
    })}
  </div>
</div>


    {/* SPRINTS */}
    <div className="bg-slate-50 p-6 rounded-3xl border shadow-inner">
  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
    Sprint Speed (Lower = Faster)
  </h4>

  <div className="flex items-end h-40 space-x-2">
    {fitnessHistory.map((h, i) => {
      const s20 = Number(h.metrics.sprint20m) || 0;
      const s40 = Number(h.metrics.sprint40m) || 0;
      const s60 = Number(h.metrics.sprint60m) || 0;

      const max = Math.max(
        ...fitnessHistory.flatMap(x => [
          Number(x.metrics.sprint20m) || 0,
          Number(x.metrics.sprint40m) || 0,
          Number(x.metrics.sprint60m) || 0
        ]),
        10
      );

      return (
        <div key={i} className="flex-1 flex flex-col justify-end space-y-1">
          <div
            className="bg-[#252968] rounded-t"
            style={{ height: `${(s20 / max) * 100}%` }}
            title={`20m: ${s20}s`}
          />
          <div
            className="bg-[#f2ad3f] rounded-t"
            style={{ height: `${(s40 / max) * 100}%` }}
            title={`40m: ${s40}s`}
          />
          <div
            className="bg-slate-400 rounded-t"
            style={{ height: `${(s60 / max) * 100}%` }}
            title={`60m: ${s60}s`}
          />
        </div>
      );
    })}
  </div>
</div>


  </div>
)}



            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
