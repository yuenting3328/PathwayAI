import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { auth, saveTokens, clearTokens, isLoggedIn } from './lib/api';
import {
  LayoutDashboard, Briefcase, Users, BarChart3, CalendarDays,
  Bell, LogOut, Settings, User, X, MessageCircle, Send, Sparkles, ChevronRight,
} from 'lucide-react';
import TalentHubLogo from '../imports/TalentHub_Logo.svg';

import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import Competency from './pages/Competency';
import Events from './pages/Events';

interface RecruiterUser { id: string; email: string; role: string; companyName?: string }

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState<RecruiterUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isLoggedIn()) {
      auth.me()
        .then(u => setUser(u))
        .catch(() => clearTokens())
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const { token, refreshToken } = await auth.login(loginEmail, loginPassword);
      saveTokens(token, refreshToken);
      const u = await auth.me();
      setUser(u);
    } catch {
      setLoginError('Invalid email or password');
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background dark flex items-center justify-center text-foreground">Loading…</div>;
  }

  if (!user) {
    return (
      <div
        className="min-h-screen dark flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 20% 70%, #5B00A0 0%, #1A0066 35%, #020B3A 65%, #010410 100%)',
        }}
      >
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-2xl">
          <div className="text-center mb-2">
            <div className="flex items-center justify-center mb-3">
              <img src={TalentHubLogo} alt="Talent Hub" className="h-11 object-contain" />
            </div>
            <p className="text-[#B4B4C8] text-sm">Sign in to your HR account</p>
          </div>
          {loginError && <p className="text-[#F43F5E] text-sm">{loginError}</p>}
          <input
            type="email" placeholder="Work email" value={loginEmail}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#6366F1] focus:bg-white/10 transition-colors"
            required
          />
          <input
            type="password" placeholder="Password" value={loginPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#6366F1] focus:bg-white/10 transition-colors"
            required
          />
          <button type="submit" className="w-full py-2.5 rounded-lg bg-[#6366F1] text-white font-medium text-sm hover:opacity-90 transition-opacity">
            Sign In
          </button>
          <p className="text-xs text-[#B4B4C8] text-center">Demo: recruiter@hsbc.com / recruiter123</p>
        </form>
      </div>
    );
  }

  const companyName = user.companyName ??
    user.email.split('@')[1]?.split('.')[0]?.toUpperCase() ??
    'Your Company';

  const renderPage = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'jobs': return <Jobs />;
      case 'candidates': return <Candidates />;
      case 'competency': return <Competency />;
      case 'events': return <Events />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} companyName={companyName} />
      <div className="flex-1 flex flex-col ml-[260px]">
        <TopBar activeView={activeView} user={user} onLogout={() => { clearTokens(); setUser(null); }} />
        <main className="flex-1 overflow-auto p-8">{renderPage()}</main>
      </div>
      <AIChatAssistant showChat={showChat} setShowChat={setShowChat} />
    </div>
  );
}

function Sidebar({ activeView, onViewChange, companyName }: {
  activeView: string;
  onViewChange: (v: string) => void;
  companyName?: string;
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'competency', label: 'Competency Feedback', icon: BarChart3 },
    { id: 'events', label: 'Campus Events', icon: CalendarDays },
  ];

  return (
    <aside className="w-[260px] bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 h-screen">
      <div className="h-16 px-5 flex items-center border-b border-sidebar-border">
        <img src={TalentHubLogo} alt="Talent Hub" className="h-9 object-contain" />
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full h-11 px-4 flex items-center gap-3 rounded-lg text-[14px] font-medium transition-all ${
              activeView === item.id
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
            {activeView === item.id && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Company</div>
        <div className="text-[13px] text-sidebar-foreground font-medium">{companyName ?? 'Your Company'}</div>
      </div>
    </aside>
  );
}

function TopBar({ activeView, user, onLogout }: {
  activeView: string;
  user: { email: string };
  onLogout: () => void;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    jobs: 'Job Postings',
    candidates: 'Candidates',
    competency: 'Competency Feedback',
    events: 'Campus Events',
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-16 bg-card border-b border-border px-8 flex items-center justify-between sticky top-0 z-20">
      <h1 className="text-[18px] font-semibold text-foreground">{titles[activeView] ?? 'Dashboard'}</h1>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors relative">
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F43F5E] rounded-full"></div>
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 hover:bg-accent rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] flex items-center justify-center text-white text-[13px] font-semibold">
              {user.email[0].toUpperCase()}
            </div>
            <span className="text-[14px] font-medium text-foreground hidden sm:block">{user.email.split('@')[0]}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-[200px] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-[13px] text-muted-foreground">{user.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full px-4 py-2 text-left text-[14px] text-foreground hover:bg-accent flex items-center gap-2.5">
                  <User className="w-4 h-4" />Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-[14px] text-foreground hover:bg-accent flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />Settings
                </button>
              </div>
              <div className="border-t border-border py-1">
                <button onClick={onLogout} className="w-full px-4 py-2 text-left text-[14px] text-[#F43F5E] hover:bg-accent flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function AIChatAssistant({ showChat, setShowChat }: { showChat: boolean; setShowChat: (v: boolean) => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([{
    role: 'assistant',
    content: "Hello! I'm your PathwayAI Recruiting Assistant. I can help you find top candidates, analyse your hiring pipeline, and provide insights on graduate talent. How can I help?",
  }]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user' as const, content: input }];
    setMessages(next);
    setInput('');
    setTimeout(() => {
      setMessages([...next, { role: 'assistant', content: 'Let me look into that for you. Based on your current pipeline data, I can surface relevant insights on candidate quality, time-to-hire trends, and skill demand.' }]);
    }, 900);
  };

  return (
    <>
      {showChat && (
        <div className="fixed bottom-24 right-8 w-[400px] h-[560px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">PathwayAI Assistant</p>
                <p className="text-[11px] text-white/70">Recruiting Intelligence</p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-[#6366F1] text-white' : 'bg-accent text-foreground'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about candidates, jobs, analytics…"
              className="flex-1 px-3 py-2 bg-input border border-border rounded-xl text-[13px] text-foreground focus:outline-none focus:border-[#6366F1]"
            />
            <button onClick={send} disabled={!input.trim()} className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:opacity-90 disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center z-40"
      >
        {showChat ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
