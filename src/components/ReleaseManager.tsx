/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldCheck, Download, Play, RefreshCw, Cpu, 
  Layers, Settings, ChevronRight, Check, Copy, FileCode, AlertTriangle
} from 'lucide-react';
import { ReleaseVersion, Startup, CoFounderProfile, StartupApplication } from '../types';

interface ReleaseManagerProps {
  releases: ReleaseVersion[];
  startups: Startup[];
  cofounders: CoFounderProfile[];
  applications: StartupApplication[];
  onTriggerCompile: () => Promise<void>;
}

export default function ReleaseManager({
  releases,
  startups,
  cofounders,
  applications,
  onTriggerCompile
}: ReleaseManagerProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'JSON' | 'CSV'>('JSON');

  const runBuildPipeline = async () => {
    setIsCompiling(true);
    setCompileLogs([]);

    const logSteps = [
      "⚡ مقداردهی اولیه پایپ‌لاین بیلد خودکار هم‌مسیر...",
      "🔍 ارزیابی درختی سورس‌کد و وابستگی‌های پلتفرم...",
      "⚙️ کامپایل بهینه‌شده کدهای TypeScript سرور و کلاینت...",
      "📦 بسته‌بندی پورتفولیوی فعال استارتاپ‌ها و فایل‌های خروجی...",
      "📄 تولید گزارش تجمعی پذیرش دوره‌ای (Batch Reports)...",
      "🚀 انتشار نسخه جدید روی زیرساخت توزیع ابری با موفقیت انجام شد!"
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCompileLogs(prev => [...prev, logSteps[i]]);
    }

    try {
      await onTriggerCompile();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  };

  const getExportData = () => {
    if (selectedFormat === 'JSON') {
      const exportBundle = {
        platform: "HamMasir Accelerator Hub",
        generatedAt: new Date().toISOString(),
        data: {
          startupsCount: startups.length,
          cofoundersCount: cofounders.length,
          applicationsCount: applications.length,
          portfolio: startups,
          applicationsList: applications,
          cofounderProfiles: cofounders
        }
      };
      return JSON.stringify(exportBundle, null, 2);
    } else {
      // CSV Export
      let csv = "ID,Name,Sector,Location,Status,SubmissionDate\n";
      applications.forEach(app => {
        csv += `${app.id},"${app.name}","${app.sector}","${app.location}","${app.status}","${app.submissionDate}"\n`;
      });
      return csv;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(getExportData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hammasir_export_${new Date().getTime()}.${selectedFormat.toLowerCase()}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8" id="release-manager-view">
      {/* Overview Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] p-6 rounded-2xl border border-gray-800">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-orange-500" />
            مرکز توسعه، انتشار و صادرات داده‌ها (Release Center)
          </h2>
          <p className="text-xs text-gray-400">نسخه‌های منظم پلتفرم را بررسی کنید، پورتفولیو را شبیه‌سازی کامپایل کرده و خروجی غنی دریافت کنید.</p>
        </div>
        <button
          onClick={runBuildPipeline}
          disabled={isCompiling}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-800 text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer text-xs"
        >
          {isCompiling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          راه‌اندازی بیلد و کامپایل نسخه جدید
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Terminal and Compilation logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500" />
              کنسول کامپایلر و خودکارسازی پایپ‌لاین (Automated Pipeline Logs)
            </h3>

            {/* Terminal Panel */}
            <div className="bg-gray-950 rounded-xl border border-gray-850 p-4 font-mono text-[11px] text-gray-300 space-y-2.5 min-h-[220px] max-h-[300px] overflow-y-auto">
              {compileLogs.length === 0 && (
                <div className="text-gray-500 flex flex-col items-center justify-center py-16 space-y-2">
                  <Terminal className="w-8 h-8 text-gray-700" />
                  <span>آماده راه‌اندازی پایپ‌لاین خودکار نسخه ۱.۲.۰</span>
                </div>
              )}
              {compileLogs.map((log, index) => (
                <div key={index} className="flex gap-2.5 items-center leading-relaxed">
                  <span className="text-gray-600 select-none">[{index + 1}]</span>
                  <span className={index === compileLogs.length - 1 ? "text-orange-400" : ""}>{log}</span>
                </div>
              ))}
              {isCompiling && (
                <div className="flex gap-2 items-center text-orange-500 text-[10px] animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>در حال بیلد سورس‌کد نهایی...</span>
                </div>
              )}
            </div>
          </div>

          {/* Export Panel */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-orange-500" />
                صادرات منظم و خروجی کامل داده‌ها (Data Package Exporter)
              </h3>
              
              {/* Formats */}
              <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-800 text-[10px]">
                {['JSON', 'CSV'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt as any)}
                    className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                      selectedFormat === fmt ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              تمام اطلاعات ثبت شده در سیستم شتاب‌دهی شامل استارتاپ‌ها، وضعیت درخواست‌ها و آنالیزهای Gemini را در یک بسته فشرده و بهینه‌سازی شده دانلود کنید.
            </p>

            {/* Quick Stats Grid to Export */}
            <div className="grid grid-cols-3 gap-3 bg-gray-900/60 p-3 rounded-xl border border-gray-850 text-[11px] text-gray-400">
              <div className="space-y-0.5 text-center">
                <span>تعداد استارتاپ‌ها</span>
                <strong className="block text-white font-mono">{startups.length}</strong>
              </div>
              <div className="space-y-0.5 text-center border-x border-gray-850">
                <span>درخواست‌های پذیرش</span>
                <strong className="block text-white font-mono">{applications.length}</strong>
              </div>
              <div className="space-y-0.5 text-center">
                <span>پروفایل‌های هم‌بنیان‌گذار</span>
                <strong className="block text-white font-mono">{cofounders.length}</strong>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadFile}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-xl border border-gray-800 text-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-orange-500" />
                دانلود فایل خروجی ({selectedFormat})
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-850 text-white font-semibold py-2.5 px-4 rounded-xl border border-gray-800 text-xs transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                کپی در کلیپ‌بورد
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Release History */}
        <div className="space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              تاریخچه نسخه‌های منظم هم‌مسیر (Releases)
            </h3>

            <div className="space-y-4">
              {releases.map((rel, index) => (
                <div key={rel.version} className="relative pl-3 border-r border-gray-850 pr-4">
                  {/* Indicator Dot */}
                  <span className={`absolute -right-[4.5px] top-1.5 w-2 h-2 rounded-full ${
                    rel.status === 'latest' ? 'bg-orange-500 ring-4 ring-orange-500/20' : 'bg-gray-700'
                  }`} />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-white font-mono">{rel.version}</span>
                      <span className="text-gray-500 font-mono text-[10px]">{rel.date}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-200">{rel.title}</h4>
                      <ul className="space-y-1 text-[10px] text-gray-500">
                        {rel.changelog.map((change, idx) => (
                          <li key={idx} className="flex gap-1.5">
                            <span className="text-orange-500 select-none">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[9px]">
                      <span className={`px-2 py-0.5 rounded ${
                        rel.isCompiled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {rel.isCompiled ? "آماده و کامپایل شده" : "درحال انتظار کپی/بیلد"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
