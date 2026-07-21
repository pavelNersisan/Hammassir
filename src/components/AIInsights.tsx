/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, AlertTriangle, TrendingUp, AlertCircle, 
  RefreshCw, TrendingDown, Award, Compass, BarChart3, HelpCircle 
} from 'lucide-react';
import { Startup, StartupInsights } from '../types';

interface AIInsightsProps {
  startup: Startup;
}

export default function AIInsights({ startup }: AIInsightsProps) {
  const [insights, setInsights] = useState<StartupInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    'در حال ارزیابی اطلاعات پایه استارتاپ...',
    'در حال بررسی و مدل‌سازی مدل درآمدی و جریان نقدی...',
    'در حال واکاوی اندازه بازار هدف (TAM) و سطح رقابت...',
    'در حال پردازش نقاط قوت و نقاط ضعف ساختاری...',
    'در حال شناسایی فرصت‌های بازار و تهدیدهای رگولاتوری...',
    'در حال نگارش گزارش نهایی تحلیل‌گر هوش مصنوعی...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/startups/${startup.id}/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('خطا در برقراری ارتباط با سرور هوش مصنوعی.');
      }
      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      console.error(err);
      setError('مشکلی در ایجاد آنالیز رخ داده است. لطفا مجددا تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [startup.id]);

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'Very High':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'High':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRecColor = (rec?: string) => {
    switch (rec) {
      case 'Strong Invest':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20';
      case 'Invest':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/20';
      case 'Watch':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-500/20';
      case 'Pass':
        return 'bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow-slate-500/20';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const translateRating = (rating?: string) => {
    switch (rating) {
      case 'Very High': return 'بسیار بالا (ستاره نوظهور)';
      case 'High': return 'بالا (رشد پایدار)';
      case 'Medium': return 'متوسط (نیازمند رصد)';
      case 'Low': return 'پایین (ریسک عملیاتی)';
      default: return rating || 'نامشخص';
    }
  };

  const translateRec = (rec?: string) => {
    switch (rec) {
      case 'Strong Invest': return 'خرید جدی و فعال (Strong Invest)';
      case 'Invest': return 'سرمایه‌گذاری پیشنهادی (Invest)';
      case 'Watch': return 'رصد و بررسی بیشتر (Watch)';
      case 'Pass': return 'عدم ورود در این راند (Pass)';
      default: return rec || 'نامشخص';
    }
  };

  return (
    <div className="mt-6 border-t border-slate-150 pt-6 space-y-6" id="ai-insights-container">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
          آنالیز کیفی و SWOT هوش مصنوعی (AI VC Insights)
        </h4>
        {insights && !loading && (
          <button
            onClick={fetchInsights}
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-orange-500 font-semibold cursor-pointer transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            تحلیل مجدد
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-slate-50 border border-slate-150 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]"
          >
            {/* Sparkle Spinner */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-orange-500 absolute top-5 right-5 animate-bounce" />
            </div>
            
            <div className="space-y-2 max-w-sm">
              <h5 className="font-bold text-slate-800 text-sm">در حال پردازش داده‌های مالی و استارتاپی...</h5>
              <p className="text-[11px] text-slate-400 h-8 flex items-center justify-center font-medium">
                {steps[loadingStep]}
              </p>
            </div>

            {/* Simulated progress indicators */}
            <div className="flex gap-1.5 pt-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === loadingStep ? 'w-6 bg-orange-500' : i < loadingStep ? 'w-2 bg-orange-200' : 'w-2 bg-slate-200'
                  }`} 
                />
              ))}
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-4"
          >
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-800 font-medium">{error}</p>
            <button
              onClick={fetchInsights}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer transition shadow-md shadow-rose-600/10"
            >
              تلاش مجدد
            </button>
          </motion.div>
        ) : insights ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* SWOT Matrix 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  نقاط قوت (Strengths)
                </h5>
                <ul className="space-y-2">
                  {insights.strengths.map((item, index) => (
                    <li key={index} className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-emerald-900 block font-bold mb-0.5">{item.title}</strong>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-rose-800 flex items-center gap-2">
                  <span className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
                    <TrendingDown className="w-4 h-4" />
                  </span>
                  نقاط ضعف (Weaknesses)
                </h5>
                <ul className="space-y-2">
                  {insights.weaknesses.map((item, index) => (
                    <li key={index} className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-rose-900 block font-bold mb-0.5">{item.title}</strong>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-blue-800 flex items-center gap-2">
                  <span className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  فرصت‌ها (Opportunities)
                </h5>
                <ul className="space-y-2">
                  {insights.opportunities.map((item, index) => (
                    <li key={index} className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-blue-900 block font-bold mb-0.5">{item.title}</strong>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-amber-800 flex items-center gap-2">
                  <span className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  تهدیدها (Threats)
                </h5>
                <ul className="space-y-2">
                  {insights.threats.map((item, index) => (
                    <li key={index} className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-amber-900 block font-bold mb-0.5">{item.title}</strong>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Investor Advice & Ratings Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Key Indicators */}
              <div className="md:col-span-1 space-y-3">
                {/* Potential Rating */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${getRatingColor(insights.potentialRating)}`}>
                  <span className="text-[10px] uppercase tracking-wider block opacity-70 mb-1">پتانسیل رشد استارتاپ:</span>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 opacity-80" />
                    <span className="font-bold text-sm leading-none">{translateRating(insights.potentialRating)}</span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`p-4 rounded-xl shadow-sm flex flex-col justify-between ${getRecColor(insights.recommendation)}`}>
                  <span className="text-[10px] uppercase tracking-wider block opacity-85 mb-1">سیگنال پیشنهادی هوش مصنوعی:</span>
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 opacity-90" />
                    <span className="font-extrabold text-sm leading-none">{translateRec(insights.recommendation)}</span>
                  </div>
                </div>
              </div>

              {/* Investor Advice */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white rounded-2xl p-5 space-y-2.5 relative overflow-hidden">
                <div className="absolute top-0 left-0 translate-x-[-15%] translate-y-[-15%] w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                <h5 className="text-xs font-bold text-orange-400 flex items-center gap-1.5 relative z-10">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  توصیه تحلیلی به سرمایه‌گذاران خطرپذیر (Investor Advice)
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed relative z-10 font-medium whitespace-pre-line">
                  {insights.investorAdvice}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
