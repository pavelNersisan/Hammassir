import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Tag, Calendar, Clock, User, 
  Sparkles, ChevronLeft, Filter, Award, Newspaper, 
  HelpCircle, Code, ArrowRight
} from 'lucide-react';
import { CMSContent } from '../types';

interface CMSPanelProps {
  articles: CMSContent[];
  onSelectView?: (view: string) => void;
}

export default function CMSPanel({ articles, onSelectView }: CMSPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<CMSContent | null>(null);

  // Derive unique categories and tags
  const categories = [
    { id: 'All', label: 'همه محتواها', icon: BookOpen },
    { id: 'Guide', label: 'راهنماهای بنیان‌گذاران', icon: HelpCircle },
    { id: 'News', label: 'اخبار شتاب‌دهنده', icon: Newspaper },
    { id: 'Success Story', label: 'داستان‌های موفقیت', icon: Award },
    { id: 'Project', label: 'پروژه‌های متن‌باز', icon: Code }
  ];

  const allTags = Array.from(
    new Set(articles.flatMap(art => art.tags || []))
  );

  // Filter articles based on advanced search criteria
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesTag = !selectedTag || art.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const featuredArticle = articles.find(art => art.isFeatured);

  return (
    <div className="space-y-8 text-right" dir="rtl" id="cms-panel-container">
      
      {/* Upper Hero/Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl border border-slate-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full text-[10px] font-mono border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            مرجع دانش شتاب‌دهی هم‌مسیر
          </div>
          <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight leading-snug">
            کتابخانه تخصصی و پایگاه خبررسانی اکوسیستم کارآفرینی
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
            تکنیک‌های جذب سرمایه، استراتژی‌های رشد وای‌کامبینیتور (YC)، راهنماهای بومی‌سازی شده و آخرین اخبار راندهای سرمایه‌گذاری استارتاپ‌های هم‌مسیر را یک‌جا دنبال کنید.
          </p>
        </div>
      </div>

      {/* Main Grid: Filters & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Right Column: Search & Filters sidebar */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Advanced Search Input */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-500" />
              جستجوی پیشرفته
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="عنوان، برچسب یا محتوا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-orange-500 hover:underline font-bold"
              >
                پاک کردن جستجو
              </button>
            )}
          </div>

          {/* Categories Filter list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" />
              دسته‌بندی موضوعی
            </h3>
            <div className="flex flex-col gap-1.5">
              {categories.map(cat => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveArticle(null);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-right ${
                      isSelected 
                        ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-orange-500' : 'text-slate-400'}`} />
                      <span>{cat.label}</span>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" />
              برچسب‌های داغ
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(tag => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      isSelected 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
            {selectedTag && (
              <button 
                onClick={() => setSelectedTag(null)}
                className="text-[10px] text-orange-500 hover:underline font-bold block"
              >
                لغو فیلتر برچسب
              </button>
            )}
          </div>

          {/* Admin Notice Portal */}
          {onSelectView && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-xs space-y-2">
              <h4 className="font-extrabold text-orange-800">تغییر محتوا به عنوان مدیر؟</h4>
              <p className="text-orange-700 text-[11px] leading-relaxed">
                مدیران ارشد پلتفرم هم‌مسیر می‌توانند مطالب جدید منتشر کرده یا محتوای موجود را تغییر دهند.
              </p>
              <button 
                onClick={() => onSelectView('admin')}
                className="inline-flex items-center gap-1 text-orange-600 font-bold hover:gap-2 transition"
              >
                ورود به پنل مدیریت
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Left Column: List or Detail Reader */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {activeArticle ? (
              // ARTICLE DETAIL VIEW
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
              >
                {/* Header Back Button */}
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs cursor-pointer transition mb-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  بازگشت به کتابخانه محتوا
                </button>

                {/* Article Top Stats */}
                <div className="space-y-4 border-b border-slate-100 pb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-3xl">{activeArticle.emoji}</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] px-2.5 py-1 rounded-full font-bold">
                      {categories.find(c => c.id === activeArticle.category)?.label || activeArticle.category}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {activeArticle.title}
                  </h2>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-400 font-medium pt-2">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      نویسنده: {activeArticle.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      تاریخ انتشار: {activeArticle.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      زمان مطالعه: {activeArticle.readTime}
                    </span>
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="text-slate-700 text-xs md:text-sm leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                  {activeArticle.content}
                </div>

                {/* Article Tags Footer */}
                <div className="border-t border-slate-100 pt-6 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 block">برچسب‌های کلیدی:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeArticle.tags.map(tag => (
                      <span key={tag} className="bg-slate-50 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-lg text-[10px] font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              // ARTICLES CARD LIST
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Result count */}
                <div className="flex justify-between items-center bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold">
                    یافته‌ها: {filteredArticles.length} مورد محتوا
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedCategory !== 'All' ? `فیلتر: ${categories.find(c => c.id === selectedCategory)?.label}` : 'نمایش همه موضوعات'}
                  </span>
                </div>

                {/* Empty State */}
                {filteredArticles.length === 0 && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-extrabold text-slate-800">مطلبی پیدا نشد</h4>
                      <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">
                        هیچ راهنما یا خبری با معیارهای جستجو یا دسته‌بندی انتخابی شما مطابقت ندارد. کلمات کلیدی دیگری را جستجو کنید.
                      </p>
                    </div>
                  </div>
                )}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map(art => (
                    <motion.div
                      key={art.id}
                      layout
                      whileHover={{ y: -4 }}
                      onClick={() => setActiveArticle(art)}
                      className={`bg-white rounded-2xl border ${art.isFeatured ? 'border-orange-200 ring-2 ring-orange-500/5' : 'border-slate-200'} p-5 space-y-4 cursor-pointer transition shadow-sm hover:shadow-md flex flex-col justify-between`}
                    >
                      <div className="space-y-3">
                        {/* Card top badges */}
                        <div className="flex justify-between items-center text-[10px] font-extrabold">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg">
                            {categories.find(c => c.id === art.category)?.label || art.category}
                          </span>
                          <span className="text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {art.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-black text-slate-900 text-sm leading-snug hover:text-orange-500 transition line-clamp-2">
                          <span className="ml-1 text-base">{art.emoji}</span>
                          {art.title}
                        </h3>

                        {/* Content Preview */}
                        <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed font-medium">
                          {art.content.replace(/[\#\*\`\-]/g, '')}
                        </p>
                      </div>

                      {/* Card Footer info */}
                      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-300" />
                          {art.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          {art.date}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
