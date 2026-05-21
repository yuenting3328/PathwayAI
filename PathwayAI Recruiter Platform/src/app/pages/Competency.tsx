import { Plus, Send, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { competency as competencyApi, type CompetencyFeedback } from '../lib/api';

const FALLBACK: CompetencyFeedback[] = [
  { id: '1', competency: 'Data Analysis',         current: 6, desired: 9, gap: 3 },
  { id: '2', competency: 'Communication',          current: 7, desired: 9, gap: 2 },
  { id: '3', competency: 'Problem Solving',        current: 7, desired: 9, gap: 2 },
  { id: '4', competency: 'Financial Modelling',    current: 5, desired: 8, gap: 3 },
  { id: '5', competency: 'Project Management',     current: 6, desired: 8, gap: 2 },
  { id: '6', competency: 'Commercial Awareness',   current: 4, desired: 8, gap: 4 },
];

const COMPETENCY_OPTIONS = [
  'Data Analysis', 'Communication', 'Problem Solving', 'Financial Modelling',
  'Project Management', 'Commercial Awareness', 'Leadership', 'Technical Writing',
  'Client Management', 'Digital Literacy', 'Critical Thinking', 'Teamwork',
];

export default function Competency() {
  const [feedbackList, setFeedbackList] = useState<CompetencyFeedback[]>(FALLBACK);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ competency: '', current: 5, desired: 8 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    competencyApi.list().then(setFeedbackList).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!form.competency) return;
    setSubmitting(true);
    try {
      const created = await competencyApi.submit(form);
      setFeedbackList(prev => {
        const existing = prev.findIndex(f => f.competency === form.competency);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = created;
          return updated;
        }
        return [...prev, created];
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      const entry: CompetencyFeedback = {
        id: Date.now().toString(),
        competency: form.competency,
        current: form.current,
        desired: form.desired,
        gap: form.desired - form.current,
      };
      setFeedbackList(prev => {
        const existing = prev.findIndex(f => f.competency === form.competency);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = entry;
          return updated;
        }
        return [...prev, entry];
      });
    } finally {
      setSubmitting(false);
      setShowModal(false);
      setForm({ competency: '', current: 5, desired: 8 });
    }
  };

  const radarData = feedbackList.map(f => ({
    subject: f.competency.length > 14 ? f.competency.slice(0, 14) + '…' : f.competency,
    current: f.current,
    desired: f.desired,
  }));

  const avgGap = feedbackList.length
    ? Math.round((feedbackList.reduce((s, f) => s + f.gap, 0) / feedbackList.length) * 10) / 10
    : 0;

  const gapColor = (gap: number) =>
    gap >= 4 ? 'text-[#F43F5E]' : gap >= 2 ? 'text-[#FBBF24]' : 'text-[#34D399]';

  const GapIcon = ({ gap }: { gap: number }) =>
    gap >= 3 ? <TrendingDown className="w-4 h-4 text-[#F43F5E]" /> :
    gap >= 1 ? <Minus className="w-4 h-4 text-[#FBBF24]" /> :
    <TrendingUp className="w-4 h-4 text-[#34D399]" />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground">Competency Feedback</h2>
          <p className="text-[14px] text-muted-foreground mt-1">
            Rate graduate readiness. Your feedback feeds directly into the university curriculum alignment dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-4 bg-[#6366F1] text-white rounded-lg text-[14px] font-medium flex items-center gap-2 hover:opacity-90 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Submit Feedback
        </button>
      </div>

      {submitted && (
        <div className="bg-[#34D399]/10 border border-[#34D399]/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <Send className="w-4 h-4 text-[#34D399]" />
          <p className="text-[13px] text-[#34D399] font-medium">Feedback submitted — the university will receive this in their Market Intelligence dashboard.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-[16px] font-semibold text-foreground">Current vs Desired Proficiency</h3>
            <p className="text-[12px] text-muted-foreground">Across all competencies you've rated</p>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2A2A36" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#B4B4C8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Radar name="Current" dataKey="current" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} />
                <Radar name="Desired" dataKey="desired" stroke="#6366F1" fill="#6366F1" fillOpacity={0.1} strokeDasharray="5 5" />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-5 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#0EA5E9] rounded" /><span className="text-[12px] text-muted-foreground">Current</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 border-t-2 border-dashed border-[#6366F1]" /><span className="text-[12px] text-muted-foreground">Desired</span></div>
            </div>
          </div>
        </div>

        {/* Gap table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground">Gap Analysis</h3>
              <p className="text-[12px] text-muted-foreground">Average gap: {avgGap} points</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {feedbackList.sort((a, b) => b.gap - a.gap).map(f => (
              <div key={f.id} className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GapIcon gap={f.gap} />
                  <div>
                    <p className="text-[14px] font-medium text-foreground">{f.competency}</p>
                    <p className="text-[12px] text-muted-foreground">{f.current}/10 → {f.desired}/10</p>
                  </div>
                </div>
                <div className={`text-[16px] font-bold ${gapColor(f.gap)}`}>
                  {f.gap > 0 ? `−${f.gap}` : '✓'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-xl p-5">
        <h4 className="text-[15px] font-semibold text-foreground mb-2">How This Feeds the Ecosystem</h4>
        <div className="grid grid-cols-3 gap-4 text-[13px] text-muted-foreground">
          <div className="flex items-start gap-2"><span className="text-[#6366F1] font-bold mt-0.5">1.</span><span>Your ratings are posted to the shared <code className="text-[#6366F1]">/market/competency-feedback</code> endpoint</span></div>
          <div className="flex items-start gap-2"><span className="text-[#6366F1] font-bold mt-0.5">2.</span><span>The university's <strong>Market Intelligence</strong> page reads this data to identify curriculum gaps</span></div>
          <div className="flex items-start gap-2"><span className="text-[#6366F1] font-bold mt-0.5">3.</span><span>Graduate App shows high-gap competencies as priority skills in the <strong>Skills Navigator</strong></span></div>
        </div>
      </div>

      {/* Submit feedback modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-semibold text-foreground">Submit Competency Feedback</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-foreground mb-1.5 block">Competency</label>
                <select value={form.competency} onChange={e => setForm(f => ({ ...f, competency: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]">
                  <option value="">Select a competency…</option>
                  {COMPETENCY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <RatingField label="Current Graduate Level" value={form.current} onChange={v => setForm(f => ({ ...f, current: v }))} />
              <RatingField label="Desired Level" value={form.desired} onChange={v => setForm(f => ({ ...f, desired: v }))} />

              <div className="bg-accent/50 rounded-lg px-4 py-3 text-center">
                <p className="text-[12px] text-muted-foreground">Gap</p>
                <p className={`text-[26px] font-bold ${gapColor(form.desired - form.current)}`}>
                  {form.desired - form.current > 0 ? `−${form.desired - form.current}` : '0'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-border rounded-lg text-[14px] text-muted-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleSubmit} disabled={!form.competency || submitting}
                className="flex-1 h-10 bg-[#6366F1] text-white rounded-lg text-[14px] font-medium hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting…' : 'Submit to University'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RatingField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[13px] font-medium text-foreground">{label}</label>
        <span className="text-[16px] font-bold text-[#6366F1]">{value}/10</span>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#6366F1]" />
      <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
        <span>1 (Poor)</span><span>5 (Average)</span><span>10 (Expert)</span>
      </div>
    </div>
  );
}
