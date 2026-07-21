/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Users, FileText, Cpu, Award, Target, Calendar, ArrowUpRight, Zap, Sparkles } from 'lucide-react';
import { Startup, CoFounderProfile, StartupApplication } from '../types';

interface DashboardProps {
  startups: Startup[];
  cofounders: CoFounderProfile[];
  applications: StartupApplication[];
  setView: (view: 'dashboard' | 'directory' | 'application' | 'cofounder' | 'releases') => void;
}

export default function Dashboard({ startups, cofounders, applications, setView }: DashboardProps) {
  const evaluatedCount = applications.filter(a => a.status === 'evaluated').length;

  return (
    <div className="space-y-8" id="dashboard-view">
      {/* Hero Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-orange-500/10 via-amber-500/5 to-transparent p-8 border border-orange-200/50"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              وای‌کامبینیتور برای اکوسیستم استارتاپی ایران
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              سامانه هوشمند شتاب‌دهی و پذیرش <span className="text-orange-500">هم‌مسیر</span>
            </h1>
            <p className="text-slate-600 max-w-xl text-sm leading-relaxed">
              اولین پلتفرم خودکارساز پذیرش استارتاپی با موتور ارزیابی آنی مبتنی بر هوش مصنوعی مولد (Gemini) و سیستم تطابق هم‌بنیان‌گذاران متخصص در ایران.
            </p>
          </div>
          <button 
            onClick={() => setView('application')}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-3 rounded-xl transition duration-200 cursor-pointer text-sm shadow-lg shadow-orange-500/20"
          >
            <Rocket className="w-4 h-4" />
            ثبت‌نام استارتاپ و ارزیابی هوشمند
          </button>
        </div>
      </motion.div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { 
            title: "استارتاپ‌های هم‌مسیر", 
            value: startups.length, 
            desc: "پورتفولیو و خروجی‌های فعال", 
            icon: Rocket, 
            color: "text-blue-600 border-blue-100 bg-blue-50/50 hover:border-blue-200",
            viewTarget: 'directory' as const
          },
          { 
            title: "هم‌بنیان‌گذاران آماده کار", 
            value: cofounders.length, 
            desc: "بنیان‌گذاران فنی و بیزنس در انتظار تیم", 
            icon: Users, 
            color: "text-purple-600 border-purple-100 bg-purple-50/50 hover:border-purple-200",
            viewTarget: 'cofounder' as const
          },
          { 
            title: "پرونده‌های ارزیابی شده", 
            value: evaluatedCount, 
            desc: "تحلیل و بررسی شده توسط Gemini", 
            icon: Cpu, 
            color: "text-emerald-600 border-emerald-100 bg-emerald-50/50 hover:border-emerald-200",
            viewTarget: 'application' as const
          },
          { 
            title: "دوره در حال پذیرش", 
            value: "1405-W", 
            desc: "مهلت ثبت درخواست: ۳۰ شهریور", 
            icon: Calendar, 
            color: "text-orange-600 border-orange-100 bg-orange-50/50 hover:border-orange-200",
            viewTarget: 'application' as const
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => setView(stat.viewTarget)}
            className={`p-6 rounded-2xl border bg-white card-shadow ${stat.color} transition duration-200 hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-40`}
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-xs font-semibold">{stat.title}</span>
              <stat.icon className="w-5 h-5 opacity-85" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">{stat.value}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>{stat.desc}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Step-by-Step Program Flow */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 card-shadow rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              فرآیند خودکار شتاب‌دهی و پذیرش هم‌مسیر
            </h2>
            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">کاملاً هوشمند و اتوماتیک</span>
          </div>

          <div className="relative pl-4 border-r border-slate-200 space-y-6 mr-3">
            {[
              {
                step: "۱",
                title: "تکمیل پرسشنامه YC بومی‌سازی شده",
                desc: "بنیان‌گذاران اطلاعات ایده، سوابق تیم، مدل مالی، بازار و راهکار تمایز خود را با ادبیات دقیق استارتاپی ثبت می‌کنند."
              },
              {
                step: "۲",
                title: "ارزیابی آنی و چندبعدی Gemini",
                desc: "موتور هوش مصنوعی Gemini بر اساس معیارهای موفقیت جهانی YC، درخواست را نمره‌دهی کرده و نقاط قوت و ضعف را تحلیل می‌کند."
              },
              {
                step: "۳",
                title: "تطابق با هم‌بنیان‌گذار مناسب",
                desc: "در صورت کمبود تخصص فنی یا مارکتینگ در تیم، سامانه افراد مستعد در پلتفرم هم‌بنیان‌یاب را به استارتاپ پیشنهاد می‌دهد."
              },
              {
                step: "۴",
                title: "جلسه دفاع و شتاب‌دهی فعال",
                desc: "تیم‌های تایید شده با سرمایه‌گذاری نقدی تا سقف ۲ میلیارد تومان وارد دوره ۳ ماهه شتاب‌دهی و منتورشیپ می‌شوند."
              }
            ].map((flow, i) => (
              <div key={i} className="relative pr-8">
                {/* Connector Dot */}
                <span className="absolute -right-[13px] top-1 w-6 h-6 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center text-xs font-bold text-orange-600 font-mono">
                  {flow.step}
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{flow.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{flow.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Tips & Action Panel */}
        <div className="space-y-6">
          
          {/* YC Evaluation Criteria */}
          <div className="bg-white border border-slate-200/80 card-shadow rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              معیارهای کلیدی ارزیابی داور هوشمند (YC Score)
            </h3>
            
            <div className="space-y-4 text-xs">
              {[
                { name: "اندازه بازار و قابلیت مقیاس‌پذیری", prc: "90%", desc: "شناسایی یک بازار بزرگ یا در حال رشد سریع در ایران" },
                { name: "قدرت و سوابق تیم سازنده", prc: "85%", desc: "توانایی تیم برای پیاده‌سازی سریع محصول اولیه بدون برون‌سپاری" },
                { name: "تمایز محصول و دفاع‌پذیری", prc: "75%", desc: "داشتن مزیت رقابتی غیرمنصفانه در مقایسه با بازیگران قدیمی" },
                { name: "جذابیت مدل اقتصادی", prc: "80%", desc: "شفافیت جریان درآمدی و پتانسیل رسیدن به سود عملیاتی" }
              ].map((criteria, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{criteria.name}</span>
                    <span className="text-orange-500 font-mono">{criteria.prc}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: criteria.prc }} />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{criteria.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              مزایای ملحق شدن به هم‌مسیر
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                سرمایه پیش‌بذری ۲ میلیارد تومانی (در ازای ۷٪ سهام)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                منتورشیپ مستقیم توسط هم‌بنیان‌گذاران یونیکورن‌های ایران
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                دسترسی اختصاصی به سرمایه‌گذاران فرشته و صندوق‌های جسورانه (VCs)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                تا ۵۰۰ میلیون تومان زیرساخت ابری و خدمات نرم‌افزاری رایگان
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
