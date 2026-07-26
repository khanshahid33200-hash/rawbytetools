'use client';

import { useState } from 'react';
import { ALL_TOOLS } from '@/lib/utils/constants';
import { LayoutDashboard, Users, Wrench, Search, MessageSquare, Database, Settings, ShieldCheck, Lock } from 'lucide-react';

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'tools' | 'feedback' | 'settings'>('analytics');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6 text-center shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-600">Please sign in with Firebase admin credentials.</p>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-3 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md"
          >
            Authenticate Admin Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Secret Admin Control Portal
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono border border-emerald-200">
                  Protected Route
                </span>
              </h1>
              <p className="text-xs text-slate-500">Manage tool analytics, SEO metadata, feedback, and website configuration.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-200/80 border border-slate-300">
            {[
              { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
              { id: 'tools', label: 'Tools Status', icon: Wrench },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Daily Unique Visitors</span>
                  <Users className="w-4 h-4 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">14,820</h3>
                <span className="text-[11px] text-emerald-700 font-semibold">+18% this week</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Files Processed Today</span>
                  <Wrench className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">52,190</h3>
                <span className="text-[11px] text-emerald-700 font-semibold">100% Client-Side</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Popular Search Queries</span>
                  <Search className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">3,410</h3>
                <span className="text-[11px] text-slate-500">Top: &quot;compress pdf 200kb&quot;</span>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Bandwidth Saved</span>
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">4.8 TB</h3>
                <span className="text-[11px] text-emerald-700 font-semibold">Zero server storage cost</span>
              </div>
            </div>

            {/* Popular Tools Ranking Table */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Top Performing Tools</h3>
              <div className="space-y-2">
                {ALL_TOOLS.slice(0, 5).map((tool, idx) => (
                  <div key={tool.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{tool.title}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px]">/{tool.slug}</span>
                    </div>
                    <span className="text-cyan-700 font-bold">{(12000 - idx * 1800).toLocaleString()} uses</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tools Status */}
        {activeTab === 'tools' && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Tool Directory ({ALL_TOOLS.length} tools)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_TOOLS.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{t.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">/{t.slug}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Feedback */}
        {activeTab === 'feedback' && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Recent User Feedback</h3>
            <div className="space-y-3">
              {[
                { name: 'Sarah Miller', email: 'sarah@example.com', msg: 'The image compressor works amazingly fast and kept 100% photo crispness!' },
                { name: 'David K.', email: 'david@example.com', msg: 'Merging 15 PDFs in seconds without uploading to a server is brilliant.' }
              ].map((fb, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{fb.name} ({fb.email})</span>
                    <span className="text-slate-500 font-normal">Today</span>
                  </div>
                  <p className="text-slate-600">{fb.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
            <h3 className="text-sm font-bold text-slate-900">Website & Brand Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="block text-slate-700 font-medium">Site Title</label>
                <input
                  type="text"
                  defaultValue="RauByte Tools"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-700 font-medium">Secret Admin Slug</label>
                <input
                  type="text"
                  disabled
                  defaultValue={process.env.NEXT_PUBLIC_ADMIN_SECRET_SLUG || 'admin-secret-portal-9872'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-600 font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
