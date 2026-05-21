import { CalendarDays, MapPin, Users, Plus, X, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { events as eventsApi, type CampusEvent } from '../lib/api';

const FALLBACK: CampusEvent[] = [
  { id: 'e1', title: 'CUHK Graduate Career Fair 2026', type: 'CAREER_FAIR', date: '2026-06-12', time: '10:00', location: 'Shaw College, CUHK', universityPartner: 'CUHK', expectedAttendance: 800, description: 'Annual campus career fair targeting Business and Finance graduates.' },
  { id: 'e2', title: 'FinTech Awareness Workshop', type: 'WORKSHOP', date: '2026-06-18', time: '14:00', location: 'Cyberport Community Hall', universityPartner: 'HKU', expectedAttendance: 120, description: 'Interactive workshop on FinTech careers and digital banking fundamentals.' },
  { id: 'e3', title: 'HSBC Networking Evening', type: 'NETWORKING', date: '2026-07-03', time: '18:30', location: 'HSBC HQ, Central', universityPartner: 'HKUST', expectedAttendance: 200 },
  { id: 'e4', title: 'Graduate Programme Info Session', type: 'INFO_SESSION', date: '2026-07-15', time: '11:00', location: 'Online (Zoom)', universityPartner: 'PolyU', expectedAttendance: 350 },
];

const TYPE_CONFIG: Record<CampusEvent['type'], { label: string; color: string }> = {
  CAREER_FAIR:  { label: 'Career Fair',   color: '#6366F1' },
  WORKSHOP:     { label: 'Workshop',      color: '#0EA5E9' },
  NETWORKING:   { label: 'Networking',    color: '#34D399' },
  INFO_SESSION: { label: 'Info Session',  color: '#FBBF24' },
};

const EMPTY: Omit<CampusEvent, 'id'> = {
  title: '', type: 'CAREER_FAIR', date: '', time: '', location: '',
  universityPartner: '', expectedAttendance: 100, description: '',
};

export default function Events() {
  const [eventList, setEventList] = useState<CampusEvent[]>(FALLBACK);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<CampusEvent, 'id'>>({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    eventsApi.list().then(setEventList).catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    try {
      const created = await eventsApi.create(form);
      setEventList(prev => [created, ...prev].sort((a, b) => a.date.localeCompare(b.date)));
    } catch {
      setEventList(prev => [{ id: Date.now().toString(), ...form }, ...prev].sort((a, b) => a.date.localeCompare(b.date)));
    } finally {
      setSaving(false);
      setShowModal(false);
      setForm({ ...EMPTY });
    }
  };

  const upcoming = eventList.filter(e => new Date(e.date) >= new Date());
  const past = eventList.filter(e => new Date(e.date) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground">Campus Events</h2>
          <p className="text-[14px] text-muted-foreground mt-1">
            Events you create sync to the graduate App notifications and the university's Employer Relations dashboard.
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="h-10 px-4 bg-[#6366F1] text-white rounded-lg text-[14px] font-medium flex items-center gap-2 hover:opacity-90 flex-shrink-0">
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Integration note */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: GraduationCap, label: 'Graduate App', desc: 'Graduates receive event notifications and can RSVP', color: '#6366F1' },
          { icon: CalendarDays, label: 'Institution Dashboard', desc: 'Events appear in Employer Relations → Events section', color: '#0EA5E9' },
          { icon: Users, label: 'Attendance Tracking', desc: 'RSVP counts feed back to your pipeline analytics', color: '#34D399' },
        ].map(item => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}18` }}>
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span className="text-[13px] font-semibold text-foreground">{item.label}</span>
            </div>
            <p className="text-[12px] text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-[15px] font-semibold text-foreground mb-3">Upcoming ({upcoming.length})</h3>
          <div className="space-y-3">
            {upcoming.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <div>
          <h3 className="text-[15px] font-semibold text-muted-foreground mb-3">Past ({past.length})</h3>
          <div className="space-y-3 opacity-60">
            {past.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      )}

      {/* Create event modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-semibold text-foreground">Create Campus Event</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Event Title">
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. HSBC Graduate Career Fair 2026"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]" />
              </Field>

              <Field label="Type">
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as CampusEvent['type'] }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]">
                  {(Object.keys(TYPE_CONFIG) as CampusEvent['type'][]).map(t => (
                    <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
                <Field label="Time">
                  <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
              </div>

              <Field label="Location">
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Venue or Online (Zoom)"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="University Partner">
                  <input value={form.universityPartner} onChange={e => setForm(f => ({ ...f, universityPartner: e.target.value }))}
                    placeholder="e.g. CUHK"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
                <Field label="Expected Attendance">
                  <input type="number" value={form.expectedAttendance} onChange={e => setForm(f => ({ ...f, expectedAttendance: Number(e.target.value) }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
              </div>

              <Field label="Description (optional)">
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Describe the event, target audience, agenda…"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1] resize-none" />
              </Field>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-border rounded-lg text-[14px] text-muted-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleCreate} disabled={!form.title || !form.date || saving}
                className="flex-1 h-10 bg-[#6366F1] text-white rounded-lg text-[14px] font-medium hover:opacity-90 disabled:opacity-40">
                {saving ? 'Creating…' : 'Create & Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: CampusEvent }) {
  const cfg = TYPE_CONFIG[event.type];
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-[15px] font-semibold text-foreground">{event.title}</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full border font-medium"
              style={{ color: cfg.color, backgroundColor: `${cfg.color}12`, borderColor: `${cfg.color}25` }}>
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{new Date(event.date).toLocaleDateString('en-HK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} · {event.time}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
            <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{event.universityPartner}</span>
          </div>
          {event.description && <p className="text-[13px] text-muted-foreground mt-2 line-clamp-2">{event.description}</p>}
        </div>
        <div className="text-center flex-shrink-0">
          <div className="text-[22px] font-bold text-foreground">{event.expectedAttendance}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />expected</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[13px] font-medium text-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
