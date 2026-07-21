/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Globe, Users, DollarSign, Tag, X, ExternalLink, Filter } from 'lucide-react';
import { Startup } from '../types';
import AIInsights from './AIInsights';

interface StartupDirectoryProps {
  startups: Startup[];
}

export default function StartupDirectory({ startups }: StartupDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('همه');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  // Extract unique sectors
  const sectors = ['همه', ...Array.from(new Set(startups.map(s => s.sector)))];

  // Filter startups
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.pitch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.founders.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSector = selectedSector === 'همه' || startup.sector === selectedSector;
    
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6" id="startup-directory">
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 card-shadow">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-500" />
            فهرست استارتاپ‌های هم‌مسیر (Ecosystem Portfolio)
          </h2>
          <p className="text-xs text-slate-500">کسب‌وکارهای نوپای برگزیده و جذب‌سرمایه‌کرده در دوره‌های شتاب‌دهی هم‌مسیر</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="جستجوی استارتاپ، بنیان‌گذار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3" />
        </div>
      </div>

      {/* Sector Pills */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition ${
              selectedSector === sector
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Grid of Startups */}
      {filteredStartups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup, index) => (
            <motion.div
              key={startup.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedStartup(startup)}
              className="group bg-white border border-slate-200 card-shadow rounded-2xl p-6 cursor-pointer hover:border-orange-500/40 hover:scale-[1.01] transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Logo and Name */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:scale-110 transition">{startup.logo}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-orange-500 transition">{startup.name}</h3>
                      <span className="text-[10px] text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full font-medium">{startup.batch}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-150 px-2 py-1 rounded-md">{startup.location}</span>
                </div>

                {/* Pitch */}
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">{startup.pitch}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{startup.description}</p>
              </div>

              {/* Tags & Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {startup.sector}
                </span>
                <span className="text-orange-500 font-medium">{startup.fundingState}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-slate-200 card-shadow rounded-2xl">
          <p className="text-xs text-slate-500">هیچ استارتاپی با فیلترهای مشخص شده پیدا نشد.</p>
        </div>
      )}

      {/* Startup Details Modal */}
      <AnimatePresence>
        {selectedStartup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStartup(null)}
                className="absolute top-4 left-4 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Banner Details */}
              <div className="p-6 pb-0 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl p-3 bg-slate-50 rounded-2xl border border-slate-150">{selectedStartup.logo}</span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">{selectedStartup.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-semibold">{selectedStartup.batch}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{selectedStartup.sector}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">{selectedStartup.pitch}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedStartup.description}</p>
              </div>

              {/* Grid Specifications */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">شهر پایگاه:</span>
                    <span className="text-slate-800 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      {selectedStartup.location}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">مدل اقتصادی:</span>
                    <span className="text-slate-800 font-medium">{selectedStartup.revenueModel}</span>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block">وضعیت سرمایه:</span>
                    <span className="text-slate-800 font-medium flex items-center gap-1.5 text-orange-600">
                      <DollarSign className="w-3.5 h-3.5" />
                      {selectedStartup.fundingState}
                    </span>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block">بنیان‌گذاران:</span>
                    <span className="text-slate-800 flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      {selectedStartup.founders.join('، ')}
                    </span>
                  </div>
                </div>

                {/* Website Link */}
                <a
                  href={selectedStartup.website}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl border border-slate-200 transition text-xs"
                >
                  <Globe className="w-4 h-4 text-orange-500" />
                  مشاهده وب‌سایت استارتاپ
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                {/* AI Insights Module */}
                <AIInsights startup={selectedStartup} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
