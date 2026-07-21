import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, FileText, Settings, Plus, Edit, 
  Trash2, ToggleLeft, ToggleRight, Sparkles, Check, 
  X, ShieldAlert, Award, ArrowUpRight, TrendingUp,
  Sliders, Calendar, CheckSquare, HelpCircle, FileCheck
} from 'lucide-react';
import { Startup, CoFounderProfile, StartupApplication, CMSContent, PlatformSettings } from '../types';

interface AdminDashboardProps {
  startups: Startup[];
  cofounders: CoFounderProfile[];
  applications: StartupApplication[];
  articles: CMSContent[];
  settings: PlatformSettings;
  onUpdateSettings: (s: PlatformSettings) => Promise<void>;
  onUpdateCofounder: (id: string, updated: Partial<CoFounderProfile>) => Promise<void>;
  onDeleteCofounder: (id: string) => Promise<void>;
  onUpdateApplicationStatus: (id: string, status: 'submitted' | 'reviewing' | 'evaluated') => Promise<void>;
  onUpdateApplicationFeedback: (id: string, feedback: any) => Promise<void>;
  onCreateArticle: (art: Omit<CMSContent, 'id' | 'date'>) => Promise<void>;
  onUpdateArticle: (id: string, art: Partial<CMSContent>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
}

export default function AdminDashboard({
  startups,
  cofounders,
  applications,
  articles,
  settings,
  onUpdateSettings,
  onUpdateCofounder,
  onDeleteCofounder,
  onUpdateApplicationStatus,
  onUpdateApplicationFeedback,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'cofounders' | 'applications' | 'cms' | 'settings'>('analytics');
  
  // CMS Article Form states
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<'Guide' | 'News' | 'Project' | 'Success Story'>('Guide');
  const [articleContent, setArticleContent] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [articleReadTime, setArticleReadTime] = useState('۴ دقیقه');
  const [articleEmoji, setArticleEmoji] = useState('📝');
  const [articleTagsText, setArticleTagsText] = useState('');
  const [articleIsFeatured, setArticleIsFeatured] = useState(false);

  // Settings form states
  const [settingsCapacity, setSettingsCapacity] = useState(settings?.capacityLimit || 25);
  const [settingsTeamWeight, setSettingsTeamWeight] = useState(settings?.weightTeam || 40);
  const [settingsMarketWeight, setSettingsMarketWeight] = useState(settings?.weightMarket || 30);
  const [settingsProductWeight, setSettingsProductWeight] = useState(settings?.weightProduct || 30);
  const [settingsRegOpen, setSettingsRegOpen] = useState(settings?.isRegistrationOpen !== false);
  const [settingsFundSize, setSettingsFundSize] = useState(settings?.acceleratorFundSize || '۱۰۰ میلیارد تومان');
  const [settingsCohort, setSettingsCohort] = useState(settings?.cohortName || 'کوهورت پاییز ۱۴۰۵');
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);

  // Application Feedback Edit Modal States
  const [showAppModal, setShowAppModal] = useState(false);
  const [activeAppToEdit, setActiveAppToEdit] = useState<StartupApplication | null>(null);
  const [appVerdict, setAppVerdict] = useState<'Accepted' | 'Deferred' | 'Interview'>('Interview');
  const [appMarketScore, setAppMarketScore] = useState(70);
  const [appProductScore, setAppProductScore] = useState(70);
  const [appTeamScore, setAppTeamScore] = useState(70);
  const [appPartnerComments, setAppPartnerComments] = useState('');

  // Save Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingsSaving(true);
    try {
      await onUpdateSettings({
        capacityLimit: settingsCapacity,
        weightTeam: settingsTeamWeight,
        weightMarket: settingsMarketWeight,
        weightProduct: settingsProductWeight,
        isRegistrationOpen: settingsRegOpen,
        acceleratorFundSize: settingsFundSize,
        cohortName: settingsCohort
      });
      alert('تنظیمات پلتفرم با موفقیت به‌روزرسانی شد.');
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره‌سازی تنظیمات.');
    } finally {
      setIsSettingsSaving(false);
    }
  };

  // Open Article Form for Creation
  const handleNewArticleClick = () => {
    setEditingArticleId(null);
    setArticleTitle('');
    setArticleCategory('Guide');
    setArticleContent('');
    setArticleAuthor('تحریریه هم‌مسیر');
    setArticleReadTime('۴ دقیقه');
    setArticleEmoji('💡');
    setArticleTagsText('پذیرش، آموزش');
    setArticleIsFeatured(false);
    setShowArticleModal(true);
  };

  // Open Article Form for Edit
  const handleEditArticleClick = (art: CMSContent) => {
    setEditingArticleId(art.id);
    setArticleTitle(art.title);
    setArticleCategory(art.category);
    setArticleContent(art.content);
    setArticleAuthor(art.author);
    setArticleReadTime(art.readTime);
    setArticleEmoji(art.emoji);
    setArticleTagsText(art.tags.join('، '));
    setArticleIsFeatured(art.isFeatured);
    setShowArticleModal(true);
  };

  // Save Article (create or update)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !articleContent) {
      alert('لطفاً عنوان و محتوای اصلی مقاله را وارد کنید.');
      return;
    }

    const tags = articleTagsText
      .split(/[،,]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const articleData = {
      title: articleTitle,
      category: articleCategory,
      content: articleContent,
      author: articleAuthor,
      readTime: articleReadTime,
      emoji: articleEmoji,
      tags,
      isFeatured: articleIsFeatured
    };

    try {
      if (editingArticleId) {
        await onUpdateArticle(editingArticleId, articleData);
        alert('مطلب مورد نظر با موفقیت ویرایش شد.');
      } else {
        await onCreateArticle(articleData);
        alert('مطلب جدید با موفقیت منتشر شد.');
      }
      setShowArticleModal(false);
    } catch (err) {
      console.error(err);
      alert('خطا در ثبت مطلب.');
    }
  };

  // Save Application Manual override
  const handleSaveAppOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppToEdit) return;

    const updatedFeedback = {
      ...activeAppToEdit.feedback,
      verdict: appVerdict,
      scoreMarket: appMarketScore,
      scoreProduct: appProductScore,
      scoreTeam: appTeamScore,
      partnerComments: appPartnerComments,
      strengths: activeAppToEdit.feedback?.strengths || ['تیم پرتلاش', 'ارزش پیشنهادی مناسب'],
      weaknesses: activeAppToEdit.feedback?.weaknesses || ['نیاز به بهبود استراتژی ورود به بازار'],
      recommendedMilestones: activeAppToEdit.feedback?.recommendedMilestones || ['ارائه اولین نمونه آزمایشی']
    };

    try {
      await onUpdateApplicationFeedback(activeAppToEdit.id, updatedFeedback);
      await onUpdateApplicationStatus(activeAppToEdit.id, 'evaluated');
      setShowAppModal(false);
      alert('گزارش و ارزیابی استارتاپ با موفقیت بازنویسی و ذخیره شد.');
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره گزارش پارتنر.');
    }
  };

  // Calculate stats for reporting
  const totalApps = applications.length;
  const evaluatedApps = applications.filter(a => a.status === 'evaluated').length;
  const acceptedApps = applications.filter(a => a.feedback?.verdict === 'Accepted').length;
  const interviewingApps = applications.filter(a => a.feedback?.verdict === 'Interview').length;
  const activeCoFounders = cofounders.filter(c => c.isAvailable).length;

  // Sector stats
  const sectorCountMap: Record<string, number> = {};
  startups.forEach(s => {
    sectorCountMap[s.sector] = (sectorCountMap[s.sector] || 0) + 1;
  });
  const sectorList = Object.entries(sectorCountMap).map(([name, val]) => ({ name, val }));

  return (
    <div className="space-y-8 text-right" dir="rtl" id="admin-dashboard-container">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5.5 h-5.5 text-orange-500" />
            داشبورد مدیریت و کنترل مرکزی هم‌مسیر (HamMasir Admin Panel)
          </h2>
          <p className="text-xs text-slate-500 font-medium">سنجش آماری فرآیند پذیرش، ویرایش اسناد یادگیری، ارزیابی دستی استارتاپ‌ها و تنظیمات سیستمی</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-orange-500 text-white font-mono text-[10px] font-extrabold px-3 py-1.5 rounded-lg">
            دسترسی ادمین: فعال
          </span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center bg-slate-100 border border-slate-200/80 p-1 rounded-2xl text-xs gap-1 max-w-2xl">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition ${
            activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          گزارش‌ها و آمار
        </button>
        <button
          onClick={() => setActiveTab('cofounders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition ${
            activeTab === 'cofounders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          اعضای هم‌بنیان‌گذار ({cofounders.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition ${
            activeTab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          فرم‌های پذیرش ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition ${
            activeTab === 'cms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          مدیریت محتوا (CMS)
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition ${
            activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          تنظیمات پلتفرم
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[400px]">
        
        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">مجموع کل درخواست‌های پذیرش</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">{totalApps}</span>
                  <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{evaluatedApps} ارزیابی نهایی
                  </span>
                </div>
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <FileText className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">نرخ پذیرش اولیه (Acceptance Rate)</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0}٪
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold block">{acceptedApps} استارتاپ تایید شده</span>
                </div>
                <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <FileCheck className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">بنیان‌گذاران آماده همکاری</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">{activeCoFounders} / {cofounders.length}</span>
                  <span className="text-[9px] text-slate-400 font-bold block">نمایه‌های هم‌بنیان‌یاب فعال</span>
                </div>
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Users className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">کل دارایی و صندوق سرمایه‌گذاری</span>
                  <span className="text-base font-black text-slate-900">{settingsFundSize}</span>
                  <span className="text-[9px] text-slate-400 font-bold block">برای {settingsCohort}</span>
                </div>
                <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <Award className="w-5.5 h-5.5" />
                </div>
              </div>

            </div>

            {/* Visual SVGs Chart Block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              
              {/* Sector distribution bar chart */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-5 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-500" />
                  پراکندگی حوزه‌ای استارتاپ‌های پورتفولیو
                </h4>
                <div className="space-y-3">
                  {sectorList.map((sec, idx) => {
                    const percentage = Math.round((sec.val / startups.length) * 100);
                    return (
                      <div key={sec.name} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center font-bold text-slate-700">
                          <span>{sec.name}</span>
                          <span className="font-mono">{sec.val} استارتاپ ({percentage}٪)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="bg-orange-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                  {sectorList.length === 0 && (
                    <p className="text-slate-400 text-xs text-center">داده‌ای یافت نشد.</p>
                  )}
                </div>
              </div>

              {/* Insights and reports text summary */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-orange-500" />
                    خلاصه بازخوردها و کیفیت کوهورت جاری
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium leading-relaxed list-disc pr-4">
                    <li>بیشترین تعداد متقاضیان پذیرش از کلان‌شهر <strong>تهران</strong> بوده و حوزه‌های فین‌تک و خدمات هوش مصنوعی بالاترین تمایل جذب را داشته‌اند.</li>
                    <li>میانگین نمره ارزیابی پارتنر (Partner Evaluation Score) برای استارتاپ‌های واجد شرایط مصاحبه حدود <strong>۸۲ از ۱۰۰</strong> ثبت شده است.</li>
                    <li>ظرفیت کوهورت طبق تنظیمات ادمین روی حداکثر <strong>{settingsCapacity} استارتاپ</strong> محدود شده است. با پذیرش تعداد {acceptedApps} تیم، ظرفیت خالی فراوان است.</li>
                    <li>سیستم ارزیابی هم‌اکنون از هوش مصنوعی <strong>Gemini 3.5 Flash</strong> به عنوان داور بازخورد دهنده اول استفاده می‌کند.</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-center justify-between text-xs text-orange-800">
                  <span className="font-semibold">وضعیت پنجره پذیرش عمومی: {settingsRegOpen ? 'باز و فعال' : 'بسته موقت'}</span>
                  <span className="font-mono text-[10px] bg-white border border-orange-200 px-2.5 py-1 rounded-lg">
                    {settingsCohort}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: COFOUNDERS REGISTRY */}
        {activeTab === 'cofounders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-xs">فهرست کل متقاضیان هم‌بنیان‌گذار یاب هم‌مسیر</h3>
              <span className="text-[10px] text-slate-400 font-mono">تعداد کل نمایه‌ها: {cofounders.length} نفر</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-700">
                    <th className="p-4">عضو</th>
                    <th className="p-4">نقش اصلی</th>
                    <th className="p-4">شهر</th>
                    <th className="p-4">سهام درخواستی</th>
                    <th className="p-4">اطلاعات تماس</th>
                    <th className="p-4 text-center">وضعیت آمادگی</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {cofounders.map(profile => (
                    <tr key={profile.id} className="hover:bg-slate-50 transition font-medium text-slate-800">
                      <td className="p-4 flex items-center gap-2.5">
                        <span className="text-xl">{profile.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-900">{profile.fullName}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px]">{profile.description}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {profile.role}
                        </span>
                      </td>
                      <td className="p-4">{profile.location}</td>
                      <td className="p-4 font-mono text-[10px]">{profile.equityRange}</td>
                      <td className="p-4 font-mono text-[11px]">{profile.contactInfo}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onUpdateCofounder(profile.id, { isAvailable: !profile.isAvailable })}
                          className="mx-auto cursor-pointer focus:outline-none"
                        >
                          {profile.isAvailable ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              آماده همکاری
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              غیرفعال / هم‌تیمی یافت
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`آیا از حذف نمایه ${profile.fullName} اطمینان دارید؟`)) {
                              onDeleteCofounder(profile.id);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg cursor-pointer transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cofounders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">نمایه‌ای یافت نشد.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS PIPELINE */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-xs">درخواست‌های ثبت شده پذیرش و وضعیت ارزیابی هوش مصنوعی</h3>
              <span className="text-[10px] text-slate-400 font-mono">تعداد درخواست‌ها: {applications.length} مورد</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-700">
                    <th className="p-4">استارتاپ</th>
                    <th className="p-4">حوزه فعالیت</th>
                    <th className="p-4">شهر / مکان</th>
                    <th className="p-4">تاریخ ثبت</th>
                    <th className="p-4 text-center">وضعیت فرم</th>
                    <th className="p-4 text-center">رای نهایی پارتنر</th>
                    <th className="p-4 text-center">نمره‌دهی و بازنویسی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50 transition font-medium text-slate-800">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{app.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[220px]">{app.pitch}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          {app.sector}
                        </span>
                      </td>
                      <td className="p-4">{app.location}</td>
                      <td className="p-4 font-mono text-[10px]">{app.submissionDate}</td>
                      <td className="p-4 text-center">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateApplicationStatus(app.id, e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="submitted">ارسال شده</option>
                          <option value="reviewing">درحال بررسی ادمین</option>
                          <option value="evaluated">ارزیابی هوشمند شده</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        {app.feedback ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.feedback.verdict === 'Accepted' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : app.feedback.verdict === 'Interview'
                              ? 'bg-orange-50 text-orange-600 border border-orange-100'
                              : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {app.feedback.verdict === 'Accepted' ? 'پذیرفته شده' : app.feedback.verdict === 'Interview' ? 'مصاحبه و دفاع' : 'رد شده / معوق'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">بدون ارزیابی</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setActiveAppToEdit(app);
                            setAppVerdict(app.feedback?.verdict || 'Interview');
                            setAppMarketScore(app.feedback?.scoreMarket || 70);
                            setAppProductScore(app.feedback?.scoreProduct || 70);
                            setAppTeamScore(app.feedback?.scoreTeam || 70);
                            setAppPartnerComments(app.feedback?.partnerComments || '');
                            setShowAppModal(true);
                          }}
                          className="inline-flex items-center gap-1 p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-lg cursor-pointer transition text-[10px] font-bold"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          ویرایش بازخورد
                        </button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">درخواستی یافت نشد.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CMS CONTENT WORKSPACE */}
        {activeTab === 'cms' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-xs">مدیریت مطالب و مراجع یادگیری (Content Management)</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">افزودن مقاله، خبر، پروژه و داستان‌های الهام‌بخش</p>
              </div>
              <button
                onClick={handleNewArticleClick}
                className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3.5 py-2.5 rounded-xl transition duration-200 cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                انتشار نوشته جدید
              </button>
            </div>

            {/* Articles Table list */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-700">
                    <th className="p-4">نوشته</th>
                    <th className="p-4">موضوع / دسته</th>
                    <th className="p-4">نویسنده</th>
                    <th className="p-4">زمان مطالعه</th>
                    <th className="p-4">تاریخ انتشار</th>
                    <th className="p-4 text-center">ویژه</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {articles.map(art => (
                    <tr key={art.id} className="hover:bg-slate-50 transition font-medium text-slate-800">
                      <td className="p-4 flex items-center gap-2">
                        <span className="text-xl">{art.emoji}</span>
                        <div>
                          <div className="font-bold text-slate-900">{art.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[280px]">{art.content}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {art.category === 'Guide' ? 'راهنما' : art.category === 'News' ? 'خبر' : art.category === 'Success Story' ? 'داستان موفقیت' : 'پروژه'}
                        </span>
                      </td>
                      <td className="p-4">{art.author}</td>
                      <td className="p-4 font-mono text-[10px]">{art.readTime}</td>
                      <td className="p-4 font-mono text-[10px]">{art.date}</td>
                      <td className="p-4 text-center">
                        {art.isFeatured ? (
                          <span className="inline-flex mx-auto w-2 h-2 rounded-full bg-orange-500" />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleEditArticleClick(art)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg cursor-pointer transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('آیا از حذف این نوشته اطمینان دارید؟')) {
                                onDeleteArticle(art.id);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg cursor-pointer transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">هیچ مطلبی یافت نشد. اولین مطلب را بنویسید!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-xs">تنظیمات اصلی و معیارهای رتبه‌دهی شتاب‌دهنده هم‌مسیر</h3>
              <p className="text-[10px] text-slate-400 font-semibold">تغییر ظرفیت کوهورت، وزن‌دهی محاسبات هوش مصنوعی و نام کارگاه پذیرش</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 block text-xs font-bold">نام کوهورت فعال</label>
                  <input
                    type="text"
                    value={settingsCohort}
                    onChange={(e) => setSettingsCohort(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 block text-xs font-bold">مجموع صندوق و دارایی شتاب‌دهی</label>
                  <input
                    type="text"
                    value={settingsFundSize}
                    onChange={(e) => setSettingsFundSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 block text-xs font-bold">ظرفیت کل پذیرش کوهورت (استارتاپ)</label>
                  <input
                    type="number"
                    value={settingsCapacity}
                    onChange={(e) => setSettingsCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 block text-xs font-bold">وضعیت پنجره پذیرش عمومی</label>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSettingsRegOpen(!settingsRegOpen)}
                      className="cursor-pointer focus:outline-none"
                    >
                      {settingsRegOpen ? (
                        <ToggleRight className="w-10 h-10 text-orange-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-slate-300" />
                      )}
                    </button>
                    <span className="text-xs text-slate-600 font-bold">
                      {settingsRegOpen ? 'ثبت‌نام پذیرش برای همه فعال است' : 'فرم ثبت‌نام موقتاً بسته شد'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weight sliders */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  وزن معیارهای داوری در بررسی هوش مصنوعی (مجموع باید ۱۰۰ باشد)
                </h4>
                
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>وزن تخصص و انگیزه تیم</span>
                      <span className="font-mono">{settingsTeamWeight}٪</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="80" 
                      value={settingsTeamWeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSettingsTeamWeight(val);
                        // adjust others proportionally to sum 100
                        const remaining = 100 - val;
                        setSettingsMarketWeight(Math.round(remaining * 0.55));
                        setSettingsProductWeight(Math.round(remaining * 0.45));
                      }}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>وزن اندازه بازار و جریان سودآوری</span>
                      <span className="font-mono">{settingsMarketWeight}٪</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="80" 
                      value={settingsMarketWeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSettingsMarketWeight(val);
                        const remaining = 100 - val;
                        setSettingsTeamWeight(Math.round(remaining * 0.6));
                        setSettingsProductWeight(Math.round(remaining * 0.4));
                      }}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>وزن یکتایی محصول و MVP فرضی</span>
                      <span className="font-mono">{settingsProductWeight}٪</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="80" 
                      value={settingsProductWeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSettingsProductWeight(val);
                        const remaining = 100 - val;
                        setSettingsTeamWeight(Math.round(remaining * 0.6));
                        setSettingsMarketWeight(Math.round(remaining * 0.4));
                      }}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono text-left">
                  مجموع اوزان: {settingsTeamWeight + settingsMarketWeight + settingsProductWeight}٪
                </div>
              </div>

              <button
                type="submit"
                disabled={isSettingsSaving}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-2.5 px-6 rounded-xl transition cursor-pointer text-xs"
              >
                {isSettingsSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره نهایی تنظیمات سیستمی'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* MODAL 1: CMS ARTICLE WRITER */}
      <AnimatePresence>
        {showArticleModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto text-right"
              dir="rtl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-base font-black text-slate-900">
                  {editingArticleId ? 'ویرایش و بازنویسی سند یادگیری' : 'انتشار مقاله یا خبر جدید در کتابخانه هم‌مسیر'}
                </h3>
                <button
                  onClick={() => setShowArticleModal(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 block">عنوان اصلی نوشته <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="توصیف جامع ایده استارتاپی..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 block">دسته‌بندی موضوعی <span className="text-red-500">*</span></label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    >
                      <option value="Guide">راهنمای بنیان‌گذار</option>
                      <option value="News">خبر اکوسیستم</option>
                      <option value="Success Story">داستان موفقیت</option>
                      <option value="Project">پژوهش و پروژه منبع‌باز</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 block">نویسنده</label>
                    <input
                      type="text"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 block">زمان تقریبی مطالعه</label>
                    <input
                      type="text"
                      value={articleReadTime}
                      onChange={(e) => setArticleReadTime(e.target.value)}
                      placeholder="مثال: ۵ دقیقه"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 block">اموجی آیکون</label>
                    <input
                      type="text"
                      value={articleEmoji}
                      onChange={(e) => setArticleEmoji(e.target.value)}
                      placeholder="مثال: 🏆"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 block">محتوای نوشتاری (پشتیبانی از فرمت پاراگراف)</label>
                  <textarea
                    rows={8}
                    required
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="متن خود را با جزییات کامل بنویسید..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 block">برچسب‌ها (با کاما جدا کنید)</label>
                    <input
                      type="text"
                      value={articleTagsText}
                      onChange={(e) => setArticleTagsText(e.target.value)}
                      placeholder="مثال: پلتفرم، وای_کامبینیتور، آموزش"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={articleIsFeatured}
                        onChange={(e) => setArticleIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500/10 accent-orange-500"
                      />
                      <span className="text-slate-700 text-xs font-bold">علامت‌گذاری به عنوان نوشته ویژه (Featured)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowArticleModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    {editingArticleId ? 'ثبت نهایی ویرایش' : 'انتشار و ثبت سراسری مطلب'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: APPLICATION MANUAL OVERRIDE */}
      <AnimatePresence>
        {showAppModal && activeAppToEdit && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xl border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto text-right"
              dir="rtl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-base font-black text-slate-900">
                  بازنویسی ارزیابی پارتنر و نمره‌دهی: {activeAppToEdit.name}
                </h3>
                <button
                  onClick={() => setShowAppModal(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAppOverride} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="text-slate-700 block">تصمیم نهایی پذیرش (Verdict)</label>
                  <select
                    value={appVerdict}
                    onChange={(e) => setAppVerdict(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  >
                    <option value="Interview">دعوت به مصاحبه و دفاع حضوری (Interview)</option>
                    <option value="Accepted">قبولی و پذیرش نهایی در شتاب‌دهنده (Accepted)</option>
                    <option value="Deferred">معوق و رد محترمانه (Deferred)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 block">امتیاز بازار (۰ تا ۱۰۰)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={appMarketScore}
                      onChange={(e) => setAppMarketScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 block">امتیاز محصول (۰ تا ۱۰۰)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={appProductScore}
                      onChange={(e) => setAppProductScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 block">امتیاز تیم (۰ تا ۱۰۰)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={appTeamScore}
                      onChange={(e) => setAppTeamScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 block">نظرات سازنده و نهایی پارتنر (Partner Comments)</label>
                  <textarea
                    rows={5}
                    value={appPartnerComments}
                    onChange={(e) => setAppPartnerComments(e.target.value)}
                    placeholder="مشابه فرمت وای‌کامبینیتور، نقاط تمرکز تیم و بازخوردهای ارتقا را بنویسید..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAppModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    ذخیره و انتشار گزارش بازنویسی شده
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
