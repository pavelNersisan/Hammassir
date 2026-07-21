/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Plus, CheckCircle2, AlertCircle, Play, Cpu, 
  ChevronRight, Sparkles, Award, ArrowUpRight, Gauge, 
  HelpCircle, Trash, Landmark, Target, ShieldAlert, BadgeHelp
} from 'lucide-react';
import { StartupApplication, ApplicationFeedback } from '../types';

interface ApplicationPortalProps {
  applications: StartupApplication[];
  onSubmitApplication: (appData: Omit<StartupApplication, 'id' | 'status' | 'submissionDate'>) => Promise<void>;
  onEvaluateApplication: (id: string) => Promise<void>;
}

export default function ApplicationPortal({ 
  applications, 
  onSubmitApplication, 
  onEvaluateApplication 
}: ApplicationPortalProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState<StartupApplication | null>(null);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('');

  // Form Fields State
  const [name, setName] = useState('');
  const [pitch, setPitch] = useState('');
  const [description, setDescription] = useState('');
  const [uniqueness, setUniqueness] = useState('');
  const [marketSize, setMarketSize] = useState('');
  const [revenueModel, setRevenueModel] = useState('');
  const [teamBackground, setTeamBackground] = useState('');
  const [location, setLocation] = useState('تهران');
  const [sector, setSector] = useState('SaaS');

  const loadingPhrases = [
    "در حال اتصال ایمن به هسته ارزیاب Gemini...",
    "در حال تحلیل ساختار ایده و راهکار پیشنهادی...",
    "در حال آنالیز سوابق تیم بنیان‌گذار...",
    "تخمین جذابیت اقتصادی و اندازه بازار صنف هدف در ایران...",
    "بررسی ریسک‌های قانونی، رگولاتوری و سهم بازار اولیه...",
    "صدور رای نهایی شریک ارشد شتاب‌دهنده هم‌مسیر..."
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pitch || !description || !teamBackground || !sector) {
      alert("لطفاً تمامی فیلدهای ستاره‌دار را تکمیل کنید.");
      return;
    }
    
    await onSubmitApplication({
      name,
      pitch,
      description,
      uniqueness,
      marketSize,
      revenueModel,
      teamBackground,
      location,
      sector
    });

    // Reset Form
    setName('');
    setPitch('');
    setDescription('');
    setUniqueness('');
    setMarketSize('');
    setRevenueModel('');
    setTeamBackground('');
    setLocation('تهران');
    setSector('SaaS');
    setShowForm(false);
  };

  const triggerEvaluation = async (id: string) => {
    setEvaluatingId(id);
    
    // Cycle loading texts to make the user experience extremely delightful
    let phraseIndex = 0;
    setLoadingText(loadingPhrases[0]);
    const interval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[phraseIndex]);
    }, 2500);

    try {
      await onEvaluateApplication(id);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setEvaluatingId(null);
    }
  };

  return (
    <div className="space-y-8" id="application-portal">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 card-shadow">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-orange-500" />
            مرکز ثبت‌نام و پذیرش هوشمند هم‌مسیر
          </h2>
          <p className="text-xs text-slate-500">درخواست‌های پذیرش خود را مدیریت کنید و ارزیابی عمیق YC-Style را با هوش مصنوعی دریافت کنید.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer text-xs shadow-lg shadow-orange-500/15"
          >
            <Plus className="w-4 h-4" />
            ثبت درخواست پذیرش جدید
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: List of Applications */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-500">درخواست‌های شما</h3>

          {applications.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 card-shadow rounded-2xl text-slate-500 space-y-3">
              <BadgeHelp className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs">شما هنوز هیچ درخواستی ثبت نکرده‌اید.</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-xs text-orange-500 font-semibold hover:underline cursor-pointer"
              >
                ثبت اولین درخواست
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      if (evaluatingId !== app.id) setSelectedApp(app);
                    }}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected 
                        ? 'bg-[#E0F2FE]/50 border-[#0369A1]/60 shadow-md' 
                        : 'bg-white border-slate-200 hover:border-slate-300 card-shadow'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-slate-900">{app.name}</h4>
                        <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">{app.sector}</span>
                      </div>
                      
                      {/* Status Badges */}
                      {app.status === 'submitted' && (
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-medium">پذیرش شده</span>
                      )}
                      {app.status === 'reviewing' && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium animate-pulse">در حال بررسی</span>
                      )}
                      {app.status === 'evaluated' && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ارزیابی شده
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">{app.pitch}</p>

                    {/* Action Panel Inside Application Card */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">{app.submissionDate}</span>
                      
                      {app.status === 'submitted' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerEvaluation(app.id);
                          }}
                          disabled={evaluatingId !== null}
                          className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white font-bold px-2.5 py-1.5 rounded-lg transition text-[10px] cursor-pointer"
                        >
                          <Cpu className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                          آنالیز هوشمند Gemini
                        </button>
                      )}

                      {app.status === 'evaluated' && !isSelected && (
                        <span className="text-orange-600 font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
                          مشاهده گزارش داوری
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Core Workspace Display (Form, Loading, or Reports) */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            
            {/* 1. Show Registration Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-200 card-shadow rounded-2xl p-6 space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-slate-150">
                  <h3 className="font-bold text-slate-900 text-base">ثبت‌نام و ارسال ایده جدید (دوره ۱۴۰۵-W)</h3>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">نام استارتاپ <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: ترب، دیوار، رایان‌ابزار"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">شعار یا ایده در یک جمله <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={pitch}
                        onChange={(e) => setPitch(e.target.value)}
                        placeholder="مثال: موتور جستجوی هوشمند کالا و مقایسه قیمت فروشگاه‌های آنلاین"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">حوزه فعالیت <span className="text-red-500">*</span></label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      >
                        <option value="SaaS">SaaS / ابزار توسعه‌دهنده</option>
                        <option value="Fintech">فین‌تک / مالی</option>
                        <option value="E-commerce">تجارت الکترونیک</option>
                        <option value="AI / Big Data">هوش مصنوعی و داده‌کاوی</option>
                        <option value="Healthtech">سلامت و تندرستی</option>
                        <option value="Logistics">لجستیک و حمل‌ونقل</option>
                        <option value="Proptech">مسکن و مستغلات</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">شهر پایگاه <span className="text-red-500">*</span></label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      >
                        <option value="تهران">تهران</option>
                        <option value="اصفهان">اصفهان</option>
                        <option value="شیراز">شیراز</option>
                        <option value="مشهد">مشهد</option>
                        <option value="تبریز">تبریز</option>
                        <option value="یزد">یزد</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-700 font-semibold block">توضیحات تکمیلی محصول و چگونگی کارکرد ایده <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="توضیح دهید محصول دقیقاً چیست، چه فرآیندی را اتوماتیک می‌کند و کاربر نهایی چه تجربه‌ای دارد."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">مزیت رقابتی غیرمنصفانه و تمایز با رقبا</label>
                      <textarea
                        rows={2}
                        value={uniqueness}
                        onChange={(e) => setUniqueness(e.target.value)}
                        placeholder="چرا کپی کردن محصول شما برای رقبا سخت است؟ (فناوری خاص، شبکه مشتریان، قراردادهای انحصاری)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">تخمین اندازه بازار صنف هدف</label>
                      <textarea
                        rows={2}
                        value={marketSize}
                        onChange={(e) => setMarketSize(e.target.value)}
                        placeholder="بازار هدف شما چند میلیون کاربر یا چه مبالغ مالی در سال را شامل می‌شود؟"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">جریان درآمدی و مدل اقتصادی</label>
                      <input
                        type="text"
                        value={revenueModel}
                        onChange={(e) => setRevenueModel(e.target.value)}
                        placeholder="مثال: اشتراک ماهیانه (SaaS) / کمیسیون از تراکنش‌ها"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-700 font-semibold block">سوابق، مهارت‌ها و پیشینه اعضای تیم <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={teamBackground}
                        onChange={(e) => setTeamBackground(e.target.value)}
                        placeholder="مثال: دو مهندس کامپیوتر فارغ‌التحصیل دانشگاه شریف با ۳ سال سابقه کار فنی در اسنپ"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition cursor-pointer"
                  >
                    ارسال رسمی درخواست پذیرش
                  </button>
                </form>
              </motion.div>
            )}

            {/* 2. Show Active Evaluation Loader */}
            {evaluatingId !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 card-shadow rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[400px]"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin" />
                  <Cpu className="w-6 h-6 text-orange-500 absolute top-5 left-5 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">در حال پردازش گزارش داوری با هوش مصنوعی</h4>
                  <p className="text-xs text-orange-600 font-semibold animate-pulse h-6">{loadingText}</p>
                </div>
                <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                  هوش مصنوعی هم‌مسیر در حال خواندن داده‌های فرم شما بر اساس تجربیات پذیرش هزاران شرکت در سیلیکون ولی و سناریوهای اقتصادی بومی ایران است. این فرآیند ممکن است تا چند ثانیه زمان ببرد.
                </p>
              </motion.div>
            )}

            {/* 3. Show Evaluation Report Dashboard */}
            {selectedApp && selectedApp.status === 'evaluated' && selectedApp.feedback && evaluatingId === null && !showForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Verdict Headline Header Banner */}
                <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  selectedApp.feedback.verdict === 'Accepted' 
                    ? 'bg-emerald-50 border-emerald-200 text-slate-850' 
                    : selectedApp.feedback.verdict === 'Interview'
                    ? 'bg-orange-50 border-orange-200 text-slate-850'
                    : 'bg-slate-50 border-slate-200 text-slate-850'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">گزارش پذیرش شتاب‌دهی هم‌مسیر برای استارتاپ:</span>
                    <h3 className="text-lg font-extrabold text-slate-900">{selectedApp.name}</h3>
                    <p className="text-xs text-slate-600 font-medium">{selectedApp.feedback.verdictReason}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-500">رای شریک هم‌مسیر</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      selectedApp.feedback.verdict === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedApp.feedback.verdict === 'Interview'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {selectedApp.feedback.verdict === 'Accepted' ? 'پذیرش قطعی (Accepted)' : 
                       selectedApp.feedback.verdict === 'Interview' ? 'جلسه مصاحبه شرکا (Interview)' : 
                       'عدم پذیرش / تعلیق (Deferred)'}
                    </span>
                  </div>
                </div>

                {/* Score Indicators / Gauge panel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "جذابیت و پتانسیل بازار", score: selectedApp.feedback.scoreMarket, color: "from-orange-500 to-red-500" },
                    { label: "اعتبارسنجی و ایده محصول", score: selectedApp.feedback.scoreProduct, color: "from-blue-500 to-indigo-500" },
                    { label: "شایستگی و توانمندی تیم", score: selectedApp.feedback.scoreTeam, color: "from-purple-500 to-pink-500" },
                  ].map((gauge, i) => (
                    <div key={i} className="bg-white border border-slate-200 card-shadow rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{gauge.label}</span>
                        <span className="text-slate-900 font-extrabold font-mono">{gauge.score}/۱۰۰</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${gauge.color}`} style={{ width: `${gauge.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pros and Cons Column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Strengths */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5 pb-2.5 border-b border-emerald-100">
                      <Award className="w-4.5 h-4.5" />
                      نقاط قوت برجسته (Strengths)
                    </h4>
                    <ul className="space-y-3 text-xs leading-relaxed text-slate-600">
                      {selectedApp.feedback.strengths.map((str, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-extrabold text-red-700 flex items-center gap-1.5 pb-2.5 border-b border-red-100">
                      <ShieldAlert className="w-4.5 h-4.5" />
                      چالش‌ها و ریسک‌ها (Weaknesses)
                    </h4>
                    <ul className="space-y-3 text-xs leading-relaxed text-slate-600">
                      {selectedApp.feedback.weaknesses.map((weak, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* YC Partner Notes Box */}
                <div className="bg-white border border-slate-200 card-shadow p-6 rounded-2xl space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    تحلیل تفصیلی شریک ارشد شتاب‌دهنده هم‌مسیر (Partner Notes)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {selectedApp.feedback.partnerComments}
                  </p>
                </div>

                {/* Recommended Milestones */}
                <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-extrabold text-orange-700 flex items-center gap-1.5">
                    <Target className="w-4.5 h-4.5" />
                    نقاط عطف الزامی پیشنهادی پیش از مصاحبه حضوری (Actionable Milestones)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedApp.feedback.recommendedMilestones.map((milestone, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-150 card-shadow flex gap-3 items-start text-xs text-slate-600">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center font-mono shrink-0">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{milestone}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* 4. Default Empty State details if no application is selected */}
            {!selectedApp && !showForm && evaluatingId === null && (
              <div className="bg-white border border-slate-200 card-shadow rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[450px]">
                <Cpu className="w-12 h-12 text-slate-300 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">گزارش داوری هوشمند وای کامبینیتور هم‌مسیر</h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    با ثبت درخواست یا انتخاب یکی از استارتاپ‌های ثبت شده از ستون مقابل، فرآیند ارزیابی چندبعدی هوش مصنوعی Gemini را آغاز یا مطالعه کنید.
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-xl border border-slate-200 transition text-xs cursor-pointer"
                >
                  ارسال درخواست جدید
                </button>
              </div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
