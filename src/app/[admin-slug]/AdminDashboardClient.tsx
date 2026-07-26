'use client';

import { useState, useEffect } from 'react';
import { ALL_TOOLS } from '@/lib/utils/constants';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Search,
  MessageSquare,
  Database,
  Settings,
  ShieldCheck,
  Lock,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  ExternalLink,
  Edit3,
  Save,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function AdminDashboardClient() {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'tools' | 'student-exam' | 'feedback' | 'settings'>('analytics');

  // Simulated tools state
  const [toolsState, setToolsState] = useState(
    ALL_TOOLS.map((t) => ({ ...t, enabled: true }))
  );

  // Settings State
  const [siteName, setSiteName] = useState('RawByte Tools');
  const [founderName, setFounderName] = useState('Shahid Khan');
  const [mainWebsite, setMainWebsite] = useState('rawbyteproduction.online');
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('rawbyte_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin' || pinInput === 'shahid1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('rawbyte_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rawbyte_admin_auth');
  };

  const toggleTool = (id: string) => {
    setToolsState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-cyan-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-600 border border-cyan-200 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Admin Control Portal</h2>
            <p className="text-xs text-slate-500">RawByte Tools Private Management Console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Enter Admin PIN / Password:</label>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all font-mono"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Enter 1234 or admin.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Unlock Admin Dashboard
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Default Admin Access PIN: <span className="font-mono text-slate-600 font-bold">1234</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[2px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">Admin Control Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  Active Admin Session
                </span>
              </div>
              <p className="text-xs text-slate-500">Welcome, Shahid Khan (Founder & Developer)</p>
            </div>
          </div>

          {/* Action & Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-bold text-xs shadow-2xs transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout Session
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          {[
            { id: 'analytics', label: 'Dashboard & Analytics', icon: LayoutDashboard },
            { id: 'tools', label: 'Tool Management (13)', icon: Wrench },
            { id: 'student-exam', label: 'Student Exam Presets', icon: GraduationCap },
            { id: 'feedback', label: 'Feedback Inbox', icon: MessageSquare },
            { id: 'settings', label: 'System Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Daily Unique Visitors</span>
                  <Users className="w-4 h-4 text-cyan-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900">18,450</h3>
                <span className="text-[11px] text-emerald-700 font-bold">+24% Student Growth</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Files Processed Today</span>
                  <Wrench className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900">64,280</h3>
                <span className="text-[11px] text-emerald-700 font-bold">100% In-Browser Privacy</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Student Exam Forms Handled</span>
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900">12,940</h3>
                <span className="text-[11px] text-amber-700 font-bold">UPSC, SSC, NEET & JEE</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Bandwidth & Cost Saved</span>
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900">6.2 TB</h3>
                <span className="text-[11px] text-emerald-700 font-bold">Zero Server Storage Cost</span>
              </div>
            </div>

            {/* Most Used Tools */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" /> Top Used Student Tools
              </h3>
              <div className="space-y-2.5">
                {[
                  { name: 'Image Compressor (20-50 KB Target)', slug: 'image-compressor', count: 28400, category: 'Image' },
                  { name: 'PDF Compressor (< 200 KB Marksheet)', slug: 'pdf-compressor', count: 18200, category: 'PDF' },
                  { name: 'Image Resizer (200x230px Photo)', slug: 'image-resizer', count: 12100, category: 'Image' },
                  { name: 'Exam Form Guide', slug: 'exam-form-guide', count: 9800, category: 'Student' },
                  { name: 'Crop Tool (Signature Crop)', slug: 'crop-tool', count: 6400, category: 'Image' }
                ].map((item, idx) => (
                  <div key={item.slug} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 font-extrabold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">/{item.slug}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-cyan-700">{item.count.toLocaleString()} uses</span>
                      <span className="block text-[10px] text-slate-400 font-semibold">{item.category} Category</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOOL MANAGEMENT */}
        {activeTab === 'tools' && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Manage Website Tools (13 Active)</h3>
                <p className="text-xs text-slate-500">Toggle availability, set status, and manage feature flags.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                All 13 Operational
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toolsState.map((tool) => (
                <div key={tool.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs">{tool.title}</h4>
                      {tool.popular && (
                        <span className="px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-700 text-[10px] font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{tool.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">/{tool.slug}</span>
                  </div>

                  <button
                    onClick={() => toggleTool(tool.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0"
                  >
                    {tool.enabled ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-700">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-500">Disabled</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT EXAM PRESETS */}
        {activeTab === 'student-exam' && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600" /> Student & Competitive Exam Preset Configurations
              </h3>
              <p className="text-xs text-slate-500">Pre-configured photo, signature, and PDF limits for competitive entrance exams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { exam: 'UPSC Civil Services', photo: '20 KB – 50 KB', sig: '10 KB – 20 KB', mark: '200 KB PDF', dim: '200 x 230 px' },
                { exam: 'SSC (CGL / CHSL)', photo: '20 KB – 50 KB', sig: '10 KB – 20 KB', mark: '200 KB PDF', dim: '200 x 230 px' },
                { exam: 'NTA NEET UG', photo: '10 KB – 200 KB', sig: '4 KB – 30 KB', mark: '300 KB PDF', dim: '300 x 300 px' },
                { exam: 'JEE Main', photo: '10 KB – 200 KB', sig: '4 KB – 30 KB', mark: '300 KB PDF', dim: '3.5 x 4.5 cm' },
                { exam: 'IBPS / SBI Banking', photo: '20 KB – 50 KB', sig: '10 KB – 20 KB', mark: '200 KB PDF', dim: '200 x 230 px' },
                { exam: 'Railway RRB', photo: '20 KB – 50 KB', sig: '10 KB – 20 KB', mark: '500 KB PDF', dim: '3.5 x 4.5 cm' }
              ].map((item) => (
                <div key={item.exam} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-extrabold text-slate-900">
                    <span>🎓 {item.exam}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px]">Active Preset</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div>📸 Photo: <strong className="text-slate-900">{item.photo}</strong></div>
                    <div>✍️ Signature: <strong className="text-slate-900">{item.sig}</strong></div>
                    <div>📜 Marksheet: <strong className="text-slate-900">{item.mark}</strong></div>
                    <div>📐 Dimensions: <strong className="text-slate-900">{item.dim}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FEEDBACK INBOX */}
        {activeTab === 'feedback' && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">User & Student Messages Inbox</h3>
            <div className="space-y-3">
              {[
                { name: 'Rahul Sharma', email: 'rahul.s@gmail.com', subject: 'UPSC Photo Compressor', msg: 'Thank you Shahid sir! The 50KB photo compressor helped me fill my UPSC form in 1 minute without any upload error.', date: 'Today 10:14 AM' },
                { name: 'Priya Patel', email: 'priya.p@outlook.com', subject: 'Marksheet PDF Compressor', msg: 'Compressed my 12th marksheet PDF to 180 KB smoothly. Really appreciate that my files are 100% private and stay in browser.', date: 'Yesterday' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-sm">{item.name} ({item.email})</span>
                    <span className="text-[11px] text-slate-400 font-normal">{item.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 font-bold text-[10px] inline-block">
                    Topic: {item.subject}
                  </span>
                  <p className="text-slate-700 leading-relaxed text-xs pt-1">{item.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Brand & System Settings</h3>
                <p className="text-xs text-slate-500">Configure global website metadata and brand identity.</p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>

            {savedSettingsSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> System Settings Updated Successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="block text-slate-800 font-bold">Brand Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-800 font-bold">Founder & Developer Name</label>
                <input
                  type="text"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-800 font-bold">Main Website URL</label>
                <input
                  type="text"
                  value={mainWebsite}
                  onChange={(e) => setMainWebsite(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-800 font-bold">Admin Secret Access Route</label>
                <input
                  type="text"
                  disabled
                  defaultValue={process.env.NEXT_PUBLIC_ADMIN_SECRET_SLUG || 'admin-secret-portal-9872'}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-300 text-slate-600 font-mono text-xs"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
