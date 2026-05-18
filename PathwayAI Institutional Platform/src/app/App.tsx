import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { auth, saveTokens, clearTokens, isLoggedIn } from './lib/api';
import {
  BarChart3,
  GraduationCap,
  TrendingUp,
  Users,
  Building2,
  FileText,
  Home,
  Award,
  Briefcase,
  ChevronRight,
  User,
  Settings,
  LogOut,
  X,
  Bell,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';

// Import logo
import PathwayLogo from '../imports/PathwayAI_Logo.png';
import InstitutionalLogo from '../imports/PathwayAI_Institutional_Logo.svg';
import LoginBg from '../imports/login_bg.jpg';

// Import all page components
import Dashboard from './pages/Dashboard';
import InstitutionalAnalytics from './pages/InstitutionalAnalytics';
import CredentialManagement from './pages/CredentialManagement';
import MarketIntelligence from './pages/MarketIntelligence';
import Curriculum from './pages/Curriculum';
import Alumni from './pages/Alumni';
import EmployerRelationship from './pages/EmployerRelationship';
import Report from './pages/Report';

interface AdminUser { id: string; email: string; role: string }

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isLoggedIn()) {
      auth.me()
        .then((u) => setAdminUser({ id: u.id, email: u.email, role: u.role }))
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
      setAdminUser({ id: u.id, email: u.email, role: u.role });
    } catch {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    clearTokens();
    setAdminUser(null);
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background dark flex items-center justify-center text-foreground">Loading...</div>;
  }

  if (!adminUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${LoginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <form onSubmit={handleLogin} className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-2xl">
          <div className="flex justify-center">
            <img src={InstitutionalLogo} alt="PathwayAI Institutional" className="h-12 object-contain" />
          </div>
          <p className="text-white/60 text-sm text-center">Sign in to your admin account</p>
          {loginError && <p className="text-[#F43F5E] text-sm">{loginError}</p>}
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
            required
          />
          <button type="submit" className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm">
            Sign In
          </button>
          <p className="text-xs text-muted-foreground text-center">Demo: admin@cuhk.edu.hk / admin123456</p>
        </form>
      </div>
    );
  }

  // Render the active page component
  const renderActivePage = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <InstitutionalAnalytics />;
      case 'credentials':
        return <CredentialManagement />;
      case 'market':
        return <MarketIntelligence />;
      case 'curriculum':
        return <Curriculum />;
      case 'alumni':
        return <Alumni />;
      case 'relations':
        return <EmployerRelationship />;
      case 'reports':
        return <Report />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[280px]">
        {/* Top Bar */}
        <TopBar activeView={activeView} user={adminUser} onLogout={handleLogout} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-8">
          {renderActivePage()}
        </main>
      </div>

      {/* AI Chat Assistant */}
      <AIChatAssistant showChat={showChat} setShowChat={setShowChat} />
    </div>
  );
}

function Sidebar({ activeView, onViewChange }: { activeView: string; onViewChange: (view: string) => void }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Institutional Analytics', icon: BarChart3 },
    { id: 'credentials', label: 'Credential Management', icon: Award },
    { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
    { id: 'curriculum', label: 'Curriculum Alignment', icon: GraduationCap },
    { id: 'alumni', label: 'Alumni Continuity', icon: Users },
    { id: 'relations', label: 'Employer Relations', icon: Briefcase },
    { id: 'reports', label: 'Reports & Compliance', icon: FileText },
  ];

  return (
    <aside className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 h-screen">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center border-b border-sidebar-border">
        <img src={PathwayLogo} alt="PathwayAI" className="h-10" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full h-11 px-4 flex items-center gap-3 rounded-lg text-[15px] font-medium transition-all ${
              activeView === item.id
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <item.icon className="w-[22px] h-[22px]" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Institution</div>
        <div className="text-[14px] text-sidebar-foreground font-medium">The Chinese University of Hong Kong</div>
      </div>
    </aside>
  );
}

function TopBar({ activeView, user, onLogout }: { activeView: string; user: { email: string } | null; onLogout: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'analytics':
        return 'Institutional Analytics';
      case 'credentials':
        return 'Credential Management & Analytics';
      case 'market':
        return 'Market Intelligence';
      case 'curriculum':
        return 'Curriculum Alignment';
      case 'alumni':
        return 'Alumni Continuity';
      case 'relations':
        return 'Employer Relationship Management';
      case 'reports':
        return 'Reports & Compliance';
      default:
        return 'Dashboard';
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'New credential issued',
      message: '127 HEAR credentials issued for Computer Science graduates',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Employment rate updated',
      message: 'Q4 2025 employment rate now at 87.3%',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Report ready',
      message: 'UGC Annual Report generated successfully',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 4,
      title: 'New employer partnership',
      message: 'HSBC signed as strategic partner',
      time: '2 days ago',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-8 flex items-center justify-end sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors relative"
          >
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#F43F5E] rounded-full"></div>
            <Bell className="w-5 h-5 text-foreground" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-[400px] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-border hover:bg-accent transition-colors cursor-pointer ${
                      notification.unread ? 'bg-accent/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-medium text-foreground">{notification.title}</p>
                          {notification.unread && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <p className="text-[13px] text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-[12px] text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border">
                <button className="text-[13px] text-primary hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:bg-accent rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] flex items-center justify-center text-white text-[13px] font-semibold">
              AD
            </div>
            <div className="text-[14px]">
              <div className="font-medium text-foreground">{user?.email?.split('@')[0] ?? 'Admin'}</div>
              <div className="text-[12px] text-muted-foreground">Administrator</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-[240px] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-foreground">{user?.email?.split('@')[0] ?? 'Admin'}</p>
                <p className="text-[13px] text-muted-foreground">{user?.email ?? ''}</p>
              </div>
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-[14px] text-foreground hover:bg-accent transition-colors flex items-center gap-3">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-[14px] text-foreground hover:bg-accent transition-colors flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-border py-2">
                <button onClick={onLogout} className="w-full px-4 py-2 text-left text-[14px] text-[#F43F5E] hover:bg-accent transition-colors flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function AIChatAssistant({ showChat, setShowChat }: { showChat: boolean; setShowChat: (show: boolean) => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your PathwayAI Assistant. I can help you with institutional analytics, generate reports, answer questions about student outcomes, and provide insights. How can I assist you today?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'I can help you with that. Let me analyze the data...',
        'Based on current institutional metrics, I can provide insights on employment rates, credential issuance, and programme performance.',
        'Would you like me to generate a specific report or provide analytics on a particular area?',
        'I have access to all institutional data including student outcomes, employer relationships, and compliance metrics.',
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages([...newMessages, { role: 'assistant', content: randomResponse }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-8 w-[420px] h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">PathwayAI Assistant</h3>
                <p className="text-[12px] text-white/80">Online</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-accent text-foreground'
                  }`}
                >
                  <p className="text-[14px] leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your institution..."
                className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 bg-input border border-border rounded-xl text-[14px] text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-11 h-11 flex items-center justify-center bg-primary text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center z-40"
      >
        {showChat ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </>
  );
}
