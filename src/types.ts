/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Startup {
  id: string;
  name: string;
  logo: string;
  pitch: string;
  description: string;
  batch: string; // e.g., "1404-Winter", "1403-Summer"
  sector: string; // e.g., "Fintech", "SaaS", "E-commerce", "AI"
  location: string; // e.g., "Tehran", "Isfahan", "Mashhad"
  website: string;
  founders: string[];
  fundingState: string; // e.g., "پیش‌بذری (Pre-seed)", "بذری (Seed)", "راند اول (Series A)"
  revenueModel: string;
}

export interface CoFounderProfile {
  id: string;
  fullName: string;
  avatar: string;
  role: 'Technical' | 'Business' | 'Product' | 'Marketing' | 'Design';
  technicalSkills: string[];
  businessSkills: string[];
  location: string;
  equityRange: string; // e.g., "20% - 40%", "40% - 50%"
  description: string;
  contactInfo: string;
  isAvailable: boolean;
}

export interface ApplicationFeedback {
  strengths: string[];
  weaknesses: string[];
  scoreMarket: number;
  scoreProduct: number;
  scoreTeam: number;
  verdict: 'Accepted' | 'Deferred' | 'Interview';
  verdictReason: string;
  partnerComments: string;
  recommendedMilestones: string[];
}

export interface StartupApplication {
  id: string;
  name: string;
  pitch: string;
  description: string;
  uniqueness: string;
  marketSize: string;
  revenueModel: string;
  teamBackground: string;
  location: string;
  sector: string;
  status: 'submitted' | 'reviewing' | 'evaluated';
  submissionDate: string;
  feedback?: ApplicationFeedback;
}

export interface ReleaseVersion {
  version: string;
  date: string;
  title: string;
  changelog: string[];
  status: 'stable' | 'beta' | 'latest';
  isCompiled: boolean;
}

export interface CMSContent {
  id: string;
  title: string;
  content: string;
  category: 'Guide' | 'News' | 'Project' | 'Success Story';
  author: string;
  readTime: string; // e.g. "5 دقیقه"
  tags: string[];
  emoji: string;
  date: string;
  isFeatured: boolean;
}

export interface PlatformSettings {
  capacityLimit: number;
  weightTeam: number;
  weightMarket: number;
  weightProduct: number;
  isRegistrationOpen: boolean;
  acceleratorFundSize: string; // e.g., "۵۰ میلیارد تومان"
  cohortName: string;
}

export interface SWOTPoint {
  title: string;
  description: string;
}

export interface StartupInsights {
  strengths: SWOTPoint[];
  weaknesses: SWOTPoint[];
  opportunities: SWOTPoint[];
  threats: SWOTPoint[];
  investorAdvice: string;
  potentialRating: 'Low' | 'Medium' | 'High' | 'Very High';
  recommendation: 'Pass' | 'Watch' | 'Invest' | 'Strong Invest';
}


