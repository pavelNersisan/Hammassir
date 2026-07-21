/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Filter, Search, MapPin, Briefcase, Mail, Send, CheckCircle, MessageSquare, X, ShieldAlert, Award } from 'lucide-react';
import { CoFounderProfile } from '../types';

interface CoFounderMatchingProps {
  cofounders: CoFounderProfile[];
  onAddCoFounder: (profileData: Omit<CoFounderProfile, 'id' | 'avatar' | 'isAvailable'>) => Promise<void>;
}

export default function CoFounderMatching({ cofounders, onAddCoFounder }: CoFounderMatchingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('همه');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeChatProfile, setActiveChatProfile] = useState<CoFounderProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'partner', text: string, time: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Technical' | 'Business' | 'Product' | 'Marketing' | 'Design'>('Technical');
  const [location, setLocation] = useState('تهران');
  const [equityRange, setEquityRange] = useState('۲۰٪ - ۳۵٪');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Filter list
  const filteredCofounders = cofounders.filter(profile => {
    const matchesSearch = profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.technicalSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          profile.businessSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === 'همه' || profile.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !description || !contactInfo) {
      alert("لطفاً فیلدهای الزامی را تکمیل کنید.");
      return;
    }

    const skillsArray = skillsText.split('،').map(s => s.trim()).filter(s => s.length > 0);
    const technicalSkills = role === 'Technical' || role === 'Product' || role === 'Design' ? skillsArray : [];
    const businessSkills = role === 'Business' || role === 'Marketing' ? skillsArray : [];

    await onAddCoFounder({
      fullName,
      role,
      technicalSkills,
      businessSkills,
      location,
      equityRange,
      description,
      contactInfo
    });

    // Reset Form
    setFullName('');
    setRole('Technical');
    setLocation('تهران');
    setEquityRange('۲۰٪ - ۳۵٪');
    setDescription('');
    setSkillsText('');
    setContactInfo('');
    setShowAddForm(false);
  };

  const startChat = (profile: CoFounderProfile) => {
    setActiveChatProfile(profile);
    setChatMessages([
      {
        sender: 'partner',
        text: `سلام دوست من! خوشحالم که ایده من براتون جذاب بوده. من دنبال یک هم‌تیمی متعهد در شهر ${profile.location} هستم. کمی بیشتر درباره ایده و بیزنسی که می‌سازید توضیح می‌دید؟`,
        time: '۱۴:۳۰'
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatProfile) return;

    const userMsg = {
      sender: 'user' as const,
      text: newMessage,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Trigger realistic reply
    setTimeout(() => {
      let replyText = `ممنونم از جوابتون. رزومه من را توی گیت‌هاب دیدید؟ به نظرم مهارت‌های فنی من در زمینه React و Node کاملاً مکمل بیزنس شماست. موافقید یک جلسه کوتاه زوم یا تلگرامی برای هفته آینده فیکس کنیم؟`;
      if (activeChatProfile.role === 'Business') {
        replyText = `عالیه! مدل مارکتینگی و درآمدی که گفتید کاملاً با استراتژی‌های من سازگاره. خوشحال می‌شم بیشتر صحبت کنیم.`;
      } else if (activeChatProfile.role === 'Product') {
        replyText = `ممنون! به نظرم این محصول پتانسیل بالایی داره. من می‌تونم توی طراحی نقشه راه محصول و وایرفریم‌ها کمک کنم. کی وقت دارید صحبت کنیم؟`;
      }
      
      setChatMessages(prev => [...prev, {
        sender: 'partner',
        text: replyText,
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="cofounder-matching">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 card-shadow">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-orange-500" />
            سیستم هم‌بنیان‌گذار یاب هم‌مسیر (Co-founder Matchmaker)
          </h2>
          <p className="text-xs text-slate-500">تطابق هوشمند بنیان‌گذاران فنی، توسعه بازار، محصول و بازاریابی در سراسر ایران</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer text-xs"
          >
            <Users className="w-4 h-4" />
            ثبت‌نام به عنوان هم‌بنیان‌گذار
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List and filter column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            {/* Role filter */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {['همه', 'Technical', 'Business', 'Product', 'Marketing', 'Design'].map((roleType) => (
                <button
                  key={roleType}
                  onClick={() => setSelectedRole(roleType)}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition ${
                    selectedRole === roleType
                      ? 'bg-orange-50 text-orange-600 border border-orange-200/50'
                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}
                >
                  {roleType === 'Technical' ? 'فنی (Tech)' : 
                   roleType === 'Business' ? 'بیزنس (Biz)' :
                   roleType === 'Product' ? 'محصول (Product)' :
                   roleType === 'Marketing' ? 'مارکتینگ' :
                   roleType === 'Design' ? 'طراحی' : 'همه'}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="جستجوی تخصص یا مهارت..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-10 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-3.5" />
            </div>
          </div>

          {/* Grid of Profiles */}
          {filteredCofounders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredCofounders.map((profile) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 card-shadow rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header profile details */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-slate-50 border border-slate-150 rounded-xl">{profile.avatar}</span>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs">{profile.fullName}</h4>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-semibold ${
                            profile.role === 'Technical' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            profile.role === 'Business' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-orange-50 text-orange-600 border border-orange-100'
                          }`}>
                            {profile.role === 'Technical' ? 'هم‌بنیان‌گذار فنی' : 
                             profile.role === 'Business' ? 'هم‌بنیان‌گذار بیزنس' : 'مدیر محصول/طراح'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        {profile.location}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed min-h-[44px]">{profile.description}</p>

                    {/* Skills list */}
                    <div className="flex flex-wrap gap-1">
                      {profile.technicalSkills.concat(profile.businessSkills).map((skill, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-50 border border-slate-150 px-2 py-0.5 rounded text-slate-500 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card bottom details */}
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 block">سهم درخواستی:</span>
                      <span className="text-orange-600 font-semibold font-mono">{profile.equityRange}</span>
                    </div>
                    <button
                      onClick={() => startChat(profile)}
                      className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] transition cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      شروع گفتگو
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 bg-white border border-slate-200 card-shadow rounded-2xl text-center text-slate-500 text-xs">
              هم‌بنیان‌گذاری با این مهارت یا مشخصات پیدا نشد.
            </div>
          )}

        </div>

        {/* Right Column: Interaction zone (Chat or Add profile form) */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            
            {/* Add profile form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-200 card-shadow rounded-2xl p-5 space-y-4"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-150 text-xs">
                  <h3 className="font-extrabold text-slate-900 text-sm">ثبت نمایه بنیان‌گذار</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">انصراف</button>
                </div>

                <form onSubmit={handleSubmitProfile} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-700 block">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: علی محمدی"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 block">نقش اصلی</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      >
                        <option value="Technical">فنی (Technical)</option>
                        <option value="Business">بیزنس (Business)</option>
                        <option value="Product">محصول (Product)</option>
                        <option value="Marketing">مارکتینگ</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 block">شهر پایگاه</label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                      >
                        <option value="تهران">تهران</option>
                        <option value="اصفهان">اصفهان</option>
                        <option value="شیراز">شیراز</option>
                        <option value="مشهد">مشهد</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 block">سهم درخواستی سهام استارتاپ</label>
                    <input
                      type="text"
                      value={equityRange}
                      onChange={(e) => setEquityRange(e.target.value)}
                      placeholder="مثال: ۳۰٪ - ۵۰٪"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 block">مهارت‌ها (با کامای فارسی جدا کنید) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="مثال: React، Node.js، Docker، Go"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 block">معرفی خود و تجربیات به اختصار <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="درباره پروژه‌های قبلی و ایده مورد علاقه‌تان برای مشارکت بگویید."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 block">اطلاعات تماس (ایمیل/تلگرام) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="مثال: email@domain.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    ثبت نهایی نمایه هم‌بنیان‌گذار
                  </button>
                </form>
              </motion.div>
            )}

            {/* Chat module with cofounder */}
            {activeChatProfile && !showAddForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-200 card-shadow rounded-2xl overflow-hidden flex flex-col justify-between h-[500px]"
              >
                {/* Chat Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-150 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{activeChatProfile.avatar}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{activeChatProfile.fullName}</h4>
                      <span className="text-[9px] text-slate-500">سهم درخواستی: {activeChatProfile.equityRange}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveChatProfile(null)}
                    className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Messages Box */}
                <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'user' ? 'mr-auto items-end' : 'ml-auto items-start'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-orange-500 text-white rounded-tl-none'
                          : 'bg-slate-50 text-slate-800 rounded-tr-none border border-slate-150'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-150 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10 transition"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl transition cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4 transform rotate-180" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* Default side instructions if nothing is clicked */}
            {!activeChatProfile && !showAddForm && (
              <div className="bg-white border border-slate-200 card-shadow rounded-2xl p-6 text-center space-y-4 min-h-[350px] flex flex-col justify-center items-center">
                <Briefcase className="w-10 h-10 text-slate-300 animate-pulse" />
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-extrabold text-slate-800 text-xs">ارتباط بی‌واسطه با نخبگان اکوسیستم</h4>
                  <p className="text-slate-500 leading-relaxed max-w-xs">
                    با کلیک روی گزینه «شروع گفتگو» در کارت هر بنیان‌گذار، شبیه‌ساز امن ارسال پیام را راه‌اندازی کرده و سوابق و تفاهم‌نامه‌های همکاری را نهایی کنید.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
