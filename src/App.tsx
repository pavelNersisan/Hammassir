/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Users, FileText, Layers, Cpu, Compass, 
  Menu, X, Sparkles, Terminal, Shield, RefreshCw 
} from 'lucide-react';
import { Startup, CoFounderProfile, StartupApplication, ReleaseVersion, CMSContent, PlatformSettings } from './types';
import Dashboard from './components/Dashboard';
import StartupDirectory from './components/StartupDirectory';
import ApplicationPortal from './components/ApplicationPortal';
import CoFounderMatching from './components/CoFounderMatching';
import ReleaseManager from './components/ReleaseManager';
import CMSPanel from './components/CMSPanel';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'directory' | 'application' | 'cofounder' | 'releases' | 'cms' | 'admin'>('dashboard');
  const [startups, setStartups] = useState<Startup[]>([]);
  const [cofounders, setCofounders] = useState<CoFounderProfile[]>([]);
  const [applications, setApplications] = useState<StartupApplication[]>([]);
  const [releases, setReleases] = useState<ReleaseVersion[]>([]);
  const [articles, setArticles] = useState<CMSContent[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>({
    capacityLimit: 25,
    weightTeam: 45,
    weightMarket: 30,
    weightProduct: 25,
    isRegistrationOpen: true,
    acceleratorFundSize: '۱۰۰ میلیارد تومان',
    cohortName: 'کوهورت پاییز ۱۴۰۵'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load Initial Data from Server-Side API
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [startupsRes, cofoundersRes, applicationsRes, releasesRes, cmsRes, settingsRes] = await Promise.all([
          fetch('/api/startups'),
          fetch('/api/cofounders'),
          fetch('/api/applications'),
          fetch('/api/releases'),
          fetch('/api/cms'),
          fetch('/api/settings')
        ]);

        const startupsData = await startupsRes.json();
        const cofoundersData = await cofoundersRes.json();
        const applicationsData = await applicationsRes.json();
        const releasesData = await releasesRes.json();
        const cmsData = await cmsRes.json();
        const settingsData = await settingsRes.json();

        setStartups(startupsData);
        setCofounders(cofoundersData);
        setApplications(applicationsData);
        setReleases(releasesData);
        setArticles(cmsData);
        setSettings(settingsData);
      } catch (err) {
        console.error("Failed to fetch initial fullstack state:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Submit Application Handler
  const handleSubmitApplication = async (appData: Omit<StartupApplication, 'id' | 'status' | 'submissionDate'>) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (response.ok) {
        const newApp = await response.json();
        setApplications(prev => [newApp, ...prev]);
      } else {
        const err = await response.json();
        alert(err.error || "خطایی در ثبت پذیرش رخ داد.");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
    }
  };

  // Evaluate Application Handler
  const handleEvaluateApplication = async (id: string) => {
    try {
      // Optimistically update status to 'reviewing'
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'reviewing' } : a));
      
      const response = await fetch(`/api/applications/${id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const updatedApp = await response.json();
        setApplications(prev => prev.map(a => a.id === id ? updatedApp : a));
      } else {
        alert("خطایی در حین بررسی اتوماتیک هوش مصنوعی رخ داد. فلو به شبیه‌ساز منتقل شد.");
      }
    } catch (err) {
      console.error("Error evaluating application:", err);
    }
  };

  // Add CoFounder Handler
  const handleAddCoFounder = async (profileData: Omit<CoFounderProfile, 'id' | 'avatar' | 'isAvailable'>) => {
    try {
      const response = await fetch('/api/cofounders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (response.ok) {
        const newProfile = await response.json();
        setCofounders(prev => [newProfile, ...prev]);
      } else {
        const err = await response.json();
        alert(err.error || "خطایی در ثبت نمایه هم‌بنیان‌گذار رخ داد.");
      }
    } catch (err) {
      console.error("Error adding cofounder:", err);
    }
  };

  // Trigger Release Compiler Pipeline
  const handleTriggerCompile = async () => {
    try {
      const response = await fetch('/api/releases/compile', {
        method: 'POST'
      });
      if (response.ok) {
        const result = await response.json();
        if (result.releases) {
          setReleases(result.releases);
        }
      }
    } catch (err) {
      console.error("Error compiling release:", err);
    }
  };

  // Update Platform Settings
  const handleUpdateSettings = async (newSettings: PlatformSettings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (response.ok) {
        const updated = await response.json();
        setSettings(updated);
      }
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  // Update CoFounder profile state (e.g. availability, bio, skills)
  const handleUpdateCofounder = async (id: string, updatedFields: Partial<CoFounderProfile>) => {
    try {
      const response = await fetch(`/api/cofounders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (response.ok) {
        const updated = await response.json();
        setCofounders(prev => prev.map(c => c.id === id ? updated : c));
      }
    } catch (err) {
      console.error("Error updating cofounder:", err);
    }
  };

  // Delete CoFounder Profile
  const handleDeleteCofounder = async (id: string) => {
    try {
      const response = await fetch(`/api/cofounders/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setCofounders(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Error deleting cofounder:", err);
    }
  };

  // Update Application Status
  const handleUpdateApplicationStatus = async (id: string, status: 'submitted' | 'reviewing' | 'evaluated') => {
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const updated = await response.json();
        setApplications(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  // Update/Override Application Feedback Report
  const handleUpdateApplicationFeedback = async (id: string, feedback: any) => {
    try {
      const response = await fetch(`/api/applications/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      if (response.ok) {
        const updated = await response.json();
        setApplications(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch (err) {
      console.error("Error updating application feedback:", err);
    }
  };

  // CMS: Create New Article
  const handleCreateArticle = async (newArticle: Omit<CMSContent, 'id' | 'date'>) => {
    try {
      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      if (response.ok) {
        const created = await response.json();
        setArticles(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error("Error creating article:", err);
    }
  };

  // CMS: Update Existing Article
  const handleUpdateArticle = async (id: string, updatedArticle: Partial<CMSContent>) => {
    try {
      const response = await fetch(`/api/cms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArticle)
      });
      if (response.ok) {
        const updated = await response.json();
        setArticles(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch (err) {
      console.error("Error updating article:", err);
    }
  };

  // CMS: Delete Article
  const handleDeleteArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/cms/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setArticles(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-orange-500/10 border-t-orange-500 animate-spin" />
          <Rocket className="w-5 h-5 text-orange-500 absolute top-3.5 left-3.5" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-slate-900 text-sm font-extrabold tracking-wider">شتاب‌دهنده هم‌مسیر</h1>
          <p className="text-slate-500 text-xs font-mono">در حال راه‌اندازی فرآیندهای اتوماسیون...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: Compass },
    { id: 'directory', label: 'استارتاپ‌های هم‌مسیر', icon: Rocket },
    { id: 'application', label: 'پذیرش و ارزیابی هوشمند', icon: FileText },
    { id: 'cofounder', label: 'هم‌بنیان‌گذار یاب', icon: Users },
    { id: 'cms', label: 'آموزش و اخبار', icon: Sparkles },
    { id: 'admin', label: 'مدیریت پلتفرم', icon: Shield },
    { id: 'releases', label: 'کنسول توسعه و صادرات', icon: Layers }
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#E0F2FE] selection:text-[#0369A1]" id="main-container">
      
      {/* Premium Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Rocket className="w-5.5 h-5.5" />
            </span>
            <div className="space-y-0.5">
              <span className="text-slate-900 font-extrabold text-sm tracking-wide block">شتاب‌دهنده هم‌مسیر</span>
              <span className="text-orange-500 font-mono text-[9px] block">HAMMASIR YC HUB</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200/80 p-1 rounded-xl text-xs gap-1">
            {menuItems.map(item => {
              const IconComp = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold cursor-pointer transition ${
                    isActive 
                      ? 'bg-[#E0F2FE] text-[#0369A1] shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Meta System Info Tickers */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              سیستم: آنلاین (Active)
            </span>
            <span className="text-[10px] text-slate-400">نسخه v1.1.0</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-[72px] right-0 left-0 z-35 bg-white border-b border-slate-200 p-4 space-y-2 text-xs font-bold"
          >
            {menuItems.map(item => {
              const IconComp = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition cursor-pointer ${
                    isActive 
                      ? 'bg-[#E0F2FE] text-[#0369A1]' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Body Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {view === 'dashboard' && (
              <Dashboard 
                startups={startups} 
                cofounders={cofounders} 
                applications={applications} 
                setView={setView} 
              />
            )}
            {view === 'directory' && (
              <StartupDirectory startups={startups} />
            )}
            {view === 'application' && (
              <ApplicationPortal 
                applications={applications} 
                onSubmitApplication={handleSubmitApplication} 
                onEvaluateApplication={handleEvaluateApplication} 
              />
            )}
            {view === 'cofounder' && (
              <CoFounderMatching 
                cofounders={cofounders} 
                onAddCoFounder={handleAddCoFounder} 
              />
            )}
            {view === 'cms' && (
              <CMSPanel 
                articles={articles} 
                onSelectView={setView}
              />
            )}
            {view === 'admin' && (
              <AdminDashboard
                startups={startups}
                cofounders={cofounders}
                applications={applications}
                articles={articles}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onUpdateCofounder={handleUpdateCofounder}
                onDeleteCofounder={handleDeleteCofounder}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onUpdateApplicationFeedback={handleUpdateApplicationFeedback}
                onCreateArticle={handleCreateArticle}
                onUpdateArticle={handleUpdateArticle}
                onDeleteArticle={handleDeleteArticle}
              />
            )}
            {view === 'releases' && (
              <ReleaseManager 
                releases={releases} 
                startups={startups}
                cofounders={cofounders}
                applications={applications}
                onTriggerCompile={handleTriggerCompile} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Compact Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>پلتفرم هم‌مسیر - الگوبرداری بومی‌سازی شده از شتاب‌دهنده وای‌کامبینیتور (Y Combinator) سیلیکون ولی.</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Tehran, Iran</span>
            <span>© 2026 HamMasir Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
