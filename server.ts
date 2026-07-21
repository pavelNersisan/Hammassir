/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Startup, CoFounderProfile, StartupApplication, ReleaseVersion, ApplicationFeedback, CMSContent, PlatformSettings } from "./src/types";

dotenv.config();

// Default in-memory database
let startups: Startup[] = [
  {
    id: "1",
    name: "اسنپ (Snapp)",
    logo: "🚗",
    pitch: "سوپراپلیکیشن ارائه‌دهنده خدمات حمل‌ونقل هوشمند، سفارش غذا و پرداخت خرد در ایران",
    description: "اولین و بزرگ‌ترین سرویس تاکسی اینترنتی در ایران که هم‌اکنون به یک سوپراپلیکیشن بزرگ با ده‌ها خدمت متنوع تبدیل شده است.",
    batch: "۱۴۰۰-زمستان",
    sector: "حمل و نقل / لجستیک",
    location: "تهران",
    website: "https://snapp.ir",
    founders: ["شهرام شاهکار", "ژوبین علاقبند"],
    fundingState: "راند اول (Series A)",
    revenueModel: "کمیسیون از تراکنش‌ها + تبلیغات"
  },
  {
    id: "2",
    name: "دیجی‌کالا (Digikala)",
    logo: "📦",
    pitch: "بزرگ‌ترین پلتفرم تجارت الکترونیک و مارکت‌پلیس ایران با پشتیبانی سراسری",
    description: "مرجع اصلی بررسی و خرید اینترنتی کالا در ایران که دارای سیستم لجستیک فوق پیشرفته و سیستم فروشندگان مارکت‌پلیس است.",
    batch: "۱۳۹۹-بهار",
    sector: "تجارت الکترونیک",
    location: "تهران",
    website: "https://digikala.com",
    founders: ["حمید محمدی", "سعید محمدی"],
    fundingState: "راند اول (Series A)",
    revenueModel: "مارژین فروش مستقیم + کمیسیون فروشندگان مارکت‌پلیس"
  },
  {
    id: "3",
    name: "آپ (Asan Pardakht)",
    logo: "💳",
    pitch: "بزرگ‌ترین پلتفرم خدمات پرداخت هوشمند موبایلی و کارت‌خوان‌های فروشگاهی",
    description: "سیستم جامع خدمات فین‌تک، خرید شارژ، پرداخت قبوض و انتقال وجه فوری شتابی بر بستر وب و اپلیکیشن.",
    batch: "۱۳۹۸-پاییز",
    sector: "فین‌تک / مالی",
    location: "اصفهان",
    website: "https://asanpardakht.ir",
    founders: ["حامد منصوری"],
    fundingState: "عرضه اولیه عمومی (IPO)",
    revenueModel: "کارمزد تراکنش شاپرک + اشتراک خدمات ویژه"
  },
  {
    id: "4",
    name: "علی‌بابا (Alibaba)",
    logo: "✈️",
    pitch: "سامانه پیشتاز خرید آنلاین بلیط هواپیما، قطار، اتوبوس و رزرو هتل",
    description: "رتبه یک گردشگری کشور که کل فرآیند سفر از رزرو پروازهای داخلی و خارجی تا تورهای گردشگری را اتوماتیک کرده است.",
    batch: "۱۴۰۱-زمستان",
    sector: "گردشگری / سفر",
    location: "تهران",
    website: "https://alibaba.ir",
    founders: ["مجید حسینی‌نژاد"],
    fundingState: "بذری (Seed)",
    revenueModel: "کمیسیون فروش بلیط و هتل"
  },
  {
    id: "5",
    name: "کمدا (Komodaa)",
    logo: "👗",
    pitch: "پلتفرم اجتماعی خرید و فروش پوشاک و لوازم دخترانه با رویکرد پایداری محیط زیست",
    description: "یک جامعه صمیمی و خلاق از خانم‌های ایرانی برای نجات کمد‌های شلوغ و بازیافت لباس‌ها به صورت کاملاً اجتماعی.",
    batch: "۱۴۰۲-بهار",
    sector: "شبکه‌های اجتماعی / خرده‌فروشی",
    location: "شیراز",
    website: "https://komodaa.com",
    founders: ["سنا خالصی"],
    fundingState: "جذب سرمایه بذری (Seed)",
    revenueModel: "کارمزد فروش و خدمات بهینه‌سازی کمدها"
  }
];

let cofounders: CoFounderProfile[] = [
  {
    id: "c1",
    fullName: "علیرضا رضایی",
    avatar: "👨‍💻",
    role: "Technical",
    technicalSkills: ["React", "Node.js", "MongoDB", "Docker", "Go"],
    businessSkills: ["رهبری فنی", "مدیریت سرور"],
    location: "تهران",
    equityRange: "۳۰٪ - ۴۹٪",
    description: "توسعه‌دهنده ارشد فول‌استک با ۶ سال سابقه کار در تیم‌های استارتاپی. به دنبال یک هم‌بنیان‌گذار حوزه بیزنس برای راه‌اندازی پلتفرم B2B زنجیره تامین هستم.",
    contactInfo: "alireza.dev@email.ir",
    isAvailable: true
  },
  {
    id: "c2",
    fullName: "سارا کریمی",
    avatar: "👩‍💼",
    role: "Business",
    technicalSkills: [],
    businessSkills: ["توسعه بازار", "مذاکره و فروش", "جذب سرمایه", "طرح کسب‌وکار"],
    location: "اصفهان",
    equityRange: "۴۰٪ - ۵۰٪",
    description: "فارغ‌التحصیل MBA دانشگاه شریف با سابقه فروش سازمانی در شرکت‌های بزرگ فناوری. به دنبال یک هم‌بنیان‌گذار فنی هستم تا ایده استارتاپ لجستیک شهری را پیاده کنیم.",
    contactInfo: "sara.karimi@email.ir",
    isAvailable: true
  },
  {
    id: "c3",
    fullName: "محمد اکبری",
    avatar: "👨‍🎨",
    role: "Product",
    technicalSkills: ["Figma", "Sketch", "HTML/CSS"],
    businessSkills: ["تحقیق کاربر", "تست محصول", "طراحی تجربه کاربر"],
    location: "مشهد",
    equityRange: "۲۰٪ - ۳۵٪",
    description: "مدیر محصول و طراح UX باسابقه. به شدت علاقه‌مند به کار روی حوزه‌های فین‌تک و سلامت هوشمند. یک ایده پروتوتایپ‌شده دارم و دنبال برنامه‌نویس می‌گردم.",
    contactInfo: "m.akbari@email.ir",
    isAvailable: true
  },
  {
    id: "c4",
    fullName: "مریم نظری",
    avatar: "👩‍🚀",
    role: "Marketing",
    technicalSkills: ["SEO", "Google Analytics", "Social Media"],
    businessSkills: ["دیجیتال مارکتینگ", "هک رشد", "روابط عمومی"],
    location: "شیراز",
    equityRange: "۱۵٪ - ۳۰٪",
    description: "متخصص هک رشد با جذب بیش از ۵۰ هزار کاربر فعال برای یک استارتاپ گردشگری. علاقه‌مند به ملحق شدن به استارتاپ‌های آماده لانچ محصول اولیه.",
    contactInfo: "maryam.marketing@email.ir",
    isAvailable: true
  }
];

let applications: StartupApplication[] = [
  {
    id: "app1",
    name: "رایان‌کلود (RayanCloud)",
    pitch: "پلتفرم ابری اتوماتیک مدیریت سرورهای ارزان ایرانی برای توسعه‌دهندگان",
    description: "سیستمی که به برنامه‌نویسان ایرانی امکان می‌دهد تا سرورهای ابری خود را از ارائه‌دهندگان مختلف داخلی با یک کلیک راه‌اندازی و مدیریت کنند، مشابه با هروکو (Heroku) ولی بومی‌سازی شده.",
    uniqueness: "اتصال یکپارچه به دیتاسنترهای زیرساخت کشور، پشتیبانی کامل از داکر بدون نیاز به دانش دواپس و هزینه کاملاً ریالی و رقابتی.",
    marketSize: "بیش از ۳۰۰ هزار توسعه‌دهنده فعال و شرکت‌های نرم‌افزاری کوچک و متوسط در کشور.",
    revenueModel: "اشتراک ماهیانه بر اساس تعداد سرورها و پهنای باند مصرفی.",
    teamBackground: "دو مهندس نرم‌افزار فارغ‌التحصیل کامپیوتر دانشگاه امیرکبیر با سابقه زیرساخت و شبکه.",
    location: "تهران",
    sector: "SaaS / توسعه‌دهندگان",
    status: "evaluated",
    submissionDate: "۱۴۰۴/۱۲/۱۵",
    feedback: {
      strengths: [
        "درک بسیار عمیق از خلاء بازار و مشکلات فعلی توسعه‌دهندگان در کار با دیتاسنترهای داخلی.",
        "تیم فنی فوق‌العاده قوی با پیشینه تحصیلی و تجربی مرتبط در مقیاس زیرساخت.",
        "مدل درآمدی پایدار اشتراکی (SaaS) با قابلیت رشد و تکرار‌پذیری بالا."
      ],
      weaknesses: [
        "وابستگی زیاد به زیرساخت‌ها و شبکه‌های دیتاسنترهای داخلی و خطر قطعی‌های خارج از کنترل.",
        "چالش سخت متقاعد کردن شرکت‌های سنتی‌تر برای برون‌سپاری فرآیند دواپس به یک استارتاپ جدید.",
        "قیمت‌گذاری در مقیاس پایین ممکن است هزینه‌های نگهداری را در ابتدا پوشش ندهد."
      ],
      scoreMarket: 85,
      scoreProduct: 90,
      scoreTeam: 95,
      verdict: "Interview",
      verdictReason: "بازار خدمات ابری در ایران پتانسیل فوق‌العاده‌ای دارد و تیم فنی توانایی اجرای بدون نقص این ایده را دارد. مصاحبه فنی و تجاری توصیه می‌شود.",
      partnerComments: "توصیه می‌کنم قبل از مصاحبه، حداقل یک مشتری بزرگ شرکتی (Enterprise) به عنوان اثبات مفهوم داشته باشید و روی استراتژی ثبات و پایداری شبکه تمرکز بیشتری نشان دهید.",
      recommendedMilestones: [
        "راه‌اندازی نسخه آزمایشی (Beta) با مشارکت حداقل ۲۰ تیم توسعه‌دهنده خصوصی.",
        "امضای تفاهم‌نامه تضمین کیفیت (SLA) با حداقل یکی از دیتاسنترهای معتبر مانند افرانت یا پارس‌آنلاین.",
        "تدوین سناریوی امنیتی شفاف برای حفاظت از داده‌های کاربران روی سرورها."
      ]
    }
  }
];

let releases: ReleaseVersion[] = [
  {
    version: "v1.0.0",
    date: "۱۴۰۵/۰۴/۱۵",
    title: "لانچ هسته اولیه پلتفرم شتاب‌دهنده",
    changelog: [
      "راه‌اندازی پورتال رسمی پذیرش استارتاپ‌ها با ساختار فرم‌های پیشرفته YC.",
      "توسعه لیست استارتاپ‌های برتر ایرانی (شبیه‌ساز دایرکتوری YC).",
      "سیستم هم‌بنیان‌یاب هوشمند بر اساس فیلتر مهارت‌ها و شهرهای ایران."
    ],
    status: "stable",
    isCompiled: true
  },
  {
    version: "v1.1.0",
    date: "۱۴۰۵/۰۴/۳۰",
    title: "ادغام هوش مصنوعی ارزیاب (Gemini Partner Review)",
    changelog: [
      "پیاده‌سازی ارزیابی کامپایل‌شده اتوماتیک با مدل پیشرفته Gemini 3.5 Flash.",
      "آنالیز چندبعدی ایده‌ها بر اساس معیارهای سنجش بازار، تیم و مدل اقتصادی.",
      "اضافه شدن قابلیت خروجی منظم گزارشات پذیرش استارتاپ به فرمت JSON قابل دانلود."
    ],
    status: "latest",
    isCompiled: false
  }
];

// Content Management System (CMS) State
let cmsArticles: CMSContent[] = [
  {
    id: "art1",
    title: "راهنمای جامع تدوین توصیف ایده برای ثبت پذیرش هم‌مسیر",
    category: "Guide",
    author: "تیم پذیرش هم‌مسیر",
    readTime: "۴ دقیقه",
    tags: ["پذیرش", "آموزش", "بنیان‌گذاران"],
    emoji: "💡",
    date: "۱۴۰۵/۰۴/۱۸",
    isFeatured: true,
    content: `ثبت پذیرش در یک شتاب‌دهنده یکی از گام‌های اساسی هر استارتاپی است. در شتاب‌دهنده هم‌مسیر، ما بر اساس متدهای استاندارد وای‌کامبینیتور (YC) اپلیکیشن‌ها را بررسی می‌کنیم. 
    
### سه اصل توصیف ایده طلایی:
۱. **سادگی و وضوح**: ایده خود را بدون اصطلاحات پیچیده بازاریابی توضیح دهید. مثلاً به جای «پلتفرم پارادایم شیفت صنعت زنجیره تامین»، بنویسید «اتصال مستقیم سوپرمارکت‌ها به بنکداران برای سفارش عمده با قیمت کمتر».
۲. **اندازه بازار**: بازار ملموس خود را به خوبی برآورد کنید. چند مشتری پتانسیل در سال اول وجود دارند؟
۳. **تیم و تخصص**: چرا شما بهترین تیم برای اجرای این محصول هستید؟ سابقه فنی و بیزنس تیم را صادقانه شرح دهید.`
  },
  {
    id: "art2",
    title: "مجموعه سرمایه‌گذاری خطرپذیر هم‌مسیر، صندوق رشد جدید را لانچ کرد",
    category: "News",
    author: "روابط عمومی هم‌مسیر",
    readTime: "۳ دقیقه",
    tags: ["سرمایه‌گذاری", "اخبار", "صندوق_رشد"],
    emoji: "📢",
    date: "۱۴۰۵/۰۴/۲۵",
    isFeatured: false,
    content: `شتاب‌دهنده هم‌مسیر در راستای ارتقای ظرفیت مالی استارتاپ‌های جوان ایرانی، هم‌زمان با آغاز پذیرش کوهورت ۱۴۰۵، صندوق رشد جدیدی به ارزش ۱۰۰ میلیارد ریال با مشارکت نهادهای سرمایه‌گذاری خصوصی ایجاد کرده است.
    
این صندوق با هدف حمایت از استارتاپ‌های حوزه‌های هوش مصنوعی، فین‌تک، لجستیک و تجارت الکترونیک طراحی شده است. استارتاپ‌های پذیرفته‌شده به محض قبولی علاوه بر حمایت‌های آموزشی و فضای کار اشتراکی، راند پیش‌بذری (Pre-seed) را با شرایط منصفانه دریافت خواهند کرد.`
  },
  {
    id: "art3",
    title: "داستان موفقیت استارتاپ رایان‌کلود: مسیر اعتبارسنجی تا ۳ هزار کاربر فعال",
    category: "Success Story",
    author: "تحریریه هم‌مسیر",
    readTime: "۶ دقیقه",
    tags: ["داستان_موفقیت", "رایان‌کلود", "فنی"],
    emoji: "🚀",
    date: "۱۴۰۵/۰۴/۱۰",
    isFeatured: true,
    content: `رایان‌کلود یکی از نمونه‌های الهام‌بخش در حوزه ابزارهای توسعه‌دهندگان (DevTools) در ایران است. بنیان‌گذاران این استارتاپ کار خود را با حل مشکل شخصی خودشان در پیکربندی سرورهای داکری در ایران شروع کردند.
    
آن‌ها با عرضه یک MVP بسیار ساده به ۳۰ تیم برنامه‌نویس، توانستند بازخوردها را دریافت و بر اساس آن محصول را ارتقا دهند. امروز رایان‌کلود با مدیریت بیش از ۳۰۰۰ سرور فعال توسعه‌دهندگان ایرانی به یکی از پایدارترین زیرساخت‌های بوم‌گردی ابری کشور تبدیل شده است.`
  },
  {
    id: "art4",
    title: "پروژه متن‌باز سیستم ارزیاب خودکار استارتاپ‌ها با مدل هوش مصنوعی",
    category: "Project",
    author: "آزمایشگاه هوش مصنوعی هم‌مسیر",
    readTime: "۵ دقیقه",
    tags: ["پروژه", "متن_باز", "هوش_مصنوعی"],
    emoji: "🔧",
    date: "۱۴۰۵/۰۴/۲۰",
    isFeatured: false,
    content: `ما بر این باوریم که دسترسی عادلانه به راهنمایی‌های شتاب‌دهی حق همه بنیان‌گذاران کشور است. به همین دلیل سیستم هوش مصنوعی ارزیاب خودکار درخواست‌های پذیرش را به صورت متن‌باز منتشر کردیم.
    
این پروژه به شتاب‌دهنده‌ها و صندوق‌های سرمایه‌گذاری اجازه می‌دهد اپلیکیشن‌های دریافتی خود را بر اساس وزن‌های قابل تنظیم در حوزه‌های بازار، تیم و محصول پردازش کنند و بازخوردهای استانداردی بر اساس بهترین شیوه‌های وای‌کامبینیتور دریافت نمایند. مشارکت‌کنندگان می‌توانند از گیت‌هاب رسمی ما کد را دریافت کنند.`
  }
];

let platformSettings: PlatformSettings = {
  capacityLimit: 25,
  weightTeam: 45,
  weightMarket: 30,
  weightProduct: 25,
  isRegistrationOpen: true,
  acceleratorFundSize: "۱۰۰ میلیارد تومان",
  cohortName: "کوهورت پاییز ۱۴۰۵"
};

// Setup Server
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini safely
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("⚠️ GEMINI_API_KEY is not configured or holds a placeholder value. Falling back to structured simulator mode for application reviews.");
  }

  // --- API Endpoints ---

  // Startups Endpoints
  app.get("/api/startups", (req, res) => {
    res.json(startups);
  });

  // Startup AI SWOT-based summary and investor insights endpoint
  app.post("/api/startups/:id/insights", async (req, res) => {
    const { id } = req.params;
    const startup = startups.find(s => s.id === id);

    if (!startup) {
      return res.status(404).json({ error: "استارتاپ مورد نظر یافت نشد." });
    }

    const prompt = `You are an expert venture capital analyst and angel investor specialized in the Iranian startup ecosystem.
Provide a professional, qualitative, SWOT-based summary and investor analysis for the startup below in Persian (Farsi) language.
Your analysis must be objective, deep, and use professional business terms.
Your evaluation MUST strictly follow this JSON schema. Return ONLY a valid JSON object matching this schema. Do not output any markdown code blocks, backticks, or wrapping, just raw clean JSON string.

Schema to match:
{
  "strengths": [
    { "title": "عنوان نقطه قوت در ۳ الی ۴ کلمه", "description": "توضیح کامل و دقیق نقطه قوت در ۱ یا ۲ جمله" }
  ],
  "weaknesses": [
    { "title": "عنوان نقطه ضعف در ۳ الی ۴ کلمه", "description": "توضیح کامل و دقیق نقطه ضعف در ۱ یا ۲ جمله" }
  ],
  "opportunities": [
    { "title": "عنوان فرصت در ۳ الی ۴ کلمه", "description": "توضیح کامل و دقیق فرصت در ۱ یا ۲ جمله" }
  ],
  "threats": [
    { "title": "عنوان تهدید در ۳ الی ۴ کلمه", "description": "توضیح کامل و دقیق تهدید در ۱ یا ۲ جمله" }
  ],
  "investorAdvice": "یک تحلیل جامع و منسجم سرمایه‌گذاری به زبان فارسی برای سرمایه‌گذار در ۲ یا ۳ پاراگراف متقاعد کننده و کارشناسی‌شده شامل توصیه‌های عملی.",
  "potentialRating": "Low" or "Medium" or "High" or "Very High",
  "recommendation": "Pass" or "Watch" or "Invest" or "Strong Invest"
}

Ensure you provide exactly 3 SWOT items for each category (strengths, weaknesses, opportunities, threats). All text fields must be in Persian (Farsi).

Startup Details to Analyze:
- Name: ${startup.name}
- Pitch: ${startup.pitch}
- Full Description: ${startup.description}
- Sector & Category: ${startup.sector}
- Target City & Location: ${startup.location}
- Funding State: ${startup.fundingState}
- Revenue Model: ${startup.revenueModel}
- Founders: ${startup.founders.join(', ')}
`;

    try {
      if (ai) {
        console.log(`Calling Gemini-3.5-Flash to generate insights for startup: ${startup.name}`);
        const geminiRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.75,
          }
        });

        const textOutput = geminiRes.text;
        if (textOutput) {
          const cleanText = textOutput.trim();
          const parsedInsights = JSON.parse(cleanText);
          return res.json(parsedInsights);
        }
      }

      // Fallback Simulator if API key is not configured or fails
      console.log(`Using fallback insights simulator for startup: ${startup.name}`);
      const simulatedInsights = generateSimulatedInsights(startup);
      res.json(simulatedInsights);

    } catch (err: any) {
      console.error("Gemini Insights Generation Failed, falling back to simulator:", err);
      const simulatedInsights = generateSimulatedInsights(startup);
      res.json(simulatedInsights);
    }
  });

  // Cofounders Endpoints
  app.get("/api/cofounders", (req, res) => {
    res.json(cofounders);
  });

  app.post("/api/cofounders", (req, res) => {
    const { fullName, role, technicalSkills, businessSkills, location, equityRange, description, contactInfo } = req.body;
    
    if (!fullName || !role || !location || !equityRange || !description || !contactInfo) {
      return res.status(400).json({ error: "پر کردن تمامی فیلدهای الزامی برای هم‌بنیان‌گذار اجباری است." });
    }

    const newProfile: CoFounderProfile = {
      id: "c" + (cofounders.length + 1),
      fullName,
      avatar: role === "Technical" ? "👨‍💻" : role === "Business" ? "👩‍💼" : role === "Product" ? "👨‍🎨" : role === "Marketing" ? "👩‍🚀" : "🎨",
      role,
      technicalSkills: technicalSkills || [],
      businessSkills: businessSkills || [],
      location,
      equityRange,
      description,
      contactInfo,
      isAvailable: true
    };

    cofounders.push(newProfile);
    res.status(201).json(newProfile);
  });

  // Applications Endpoints
  app.get("/api/applications", (req, res) => {
    res.json(applications);
  });

  app.post("/api/applications", (req, res) => {
    const { name, pitch, description, uniqueness, marketSize, revenueModel, teamBackground, location, sector } = req.body;
    
    if (!name || !pitch || !description || !teamBackground || !sector) {
      return res.status(400).json({ error: "لطفاً اطلاعات اصلی استارتاپ (نام، یک خط ایده، توصیف، سوابق تیم و حوزه) را تکمیل کنید." });
    }

    const newApplication: StartupApplication = {
      id: "app" + (applications.length + 1),
      name,
      pitch,
      description,
      uniqueness: uniqueness || "توضیح داده نشده",
      marketSize: marketSize || "نامشخص",
      revenueModel: revenueModel || "نامشخص",
      teamBackground,
      location: location || "تهران",
      sector,
      status: "submitted",
      submissionDate: new Date().toLocaleDateString("fa-IR")
    };

    applications.push(newApplication);
    res.status(201).json(newApplication);
  });

  // Gemini Automated Review Endpoint
  app.post("/api/applications/:id/evaluate", async (req, res) => {
    const { id } = req.params;
    const application = applications.find(a => a.id === id);

    if (!application) {
      return res.status(404).json({ error: "درخواست پذیرش مورد نظر پیدا نشد." });
    }

    application.status = "reviewing";

    // Build Evaluation Prompt
    const prompt = `You are an expert Y Combinator Partner specialized in reviewing and picking startups. You are reviewing an application for a startup in the Iranian market.
Provide a thorough, critical, yet helpful evaluation of the startup application below in Persian (Farsi) language.
Your evaluation MUST strictly follow this JSON schema. Return ONLY a valid JSON object matching this schema. Do not output any markdown code blocks, backticks, or wrapping, just raw clean JSON string.

Schema to match:
{
  "strengths": ["list of 3 key strengths in Persian"],
  "weaknesses": ["list of 3 key weaknesses/concerns in Persian"],
  "scoreMarket": 0 to 100 integer,
  "scoreProduct": 0 to 100 integer,
  "scoreTeam": 0 to 100 integer,
  "verdict": "Accepted" or "Deferred" or "Interview",
  "verdictReason": "One line summary of why this verdict in Persian",
  "partnerComments": "A cohesive paragraphs of constructive advice as a YC Partner in Persian",
  "recommendedMilestones": ["list of 3 actionable milestones in Persian"]
}

Startup Application Details to Evaluate:
- Startup Name: ${application.name}
- Core Pitch: ${application.pitch}
- Full Description: ${application.description}
- Unique Value: ${application.uniqueness}
- Market Size Estimation: ${application.marketSize}
- Revenue Model: ${application.revenueModel}
- Team Background: ${application.teamBackground}
- Sector & Location: ${application.sector} / ${application.location}`;

    try {
      if (ai) {
        console.log(`Calling Gemini-3.5-Flash to evaluate application: ${application.name}`);
        const geminiRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7,
          }
        });

        const textOutput = geminiRes.text;
        if (textOutput) {
          // Parse JSON feedback
          const cleanText = textOutput.trim();
          const parsedFeedback = JSON.parse(cleanText);
          application.feedback = {
            strengths: parsedFeedback.strengths || [],
            weaknesses: parsedFeedback.weaknesses || [],
            scoreMarket: parsedFeedback.scoreMarket || 70,
            scoreProduct: parsedFeedback.scoreProduct || 70,
            scoreTeam: parsedFeedback.scoreTeam || 70,
            verdict: parsedFeedback.verdict || "Interview",
            verdictReason: parsedFeedback.verdictReason || "",
            partnerComments: parsedFeedback.partnerComments || "",
            recommendedMilestones: parsedFeedback.recommendedMilestones || []
          };
          application.status = "evaluated";
          return res.json(application);
        }
      }
      
      // Fallback Simulator if API fails or is not available
      console.log(`Using fallback evaluation simulator for application: ${application.name}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async network call
      
      // Smart Fallback generator based on industry
      const simulatedFeedback = generateSimulatedFeedback(application);
      application.feedback = simulatedFeedback;
      application.status = "evaluated";
      res.json(application);

    } catch (err: any) {
      console.error("Gemini Evaluation Failed, falling back to simulator:", err);
      // Fallback to simulator
      const simulatedFeedback = generateSimulatedFeedback(application);
      application.feedback = simulatedFeedback;
      application.status = "evaluated";
      res.json(application);
    }
  });

  // CMS Articles Endpoints
  app.get("/api/cms", (req, res) => {
    res.json(cmsArticles);
  });

  app.post("/api/cms", (req, res) => {
    const { title, content, category, author, readTime, tags, emoji, isFeatured } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: "عنوان، محتوا و دسته‌بندی برای مقاله الزامی است." });
    }
    const newArticle: CMSContent = {
      id: "art" + (cmsArticles.length + 1),
      title,
      content,
      category,
      author: author || "مدیریت سیستم",
      readTime: readTime || "۳ دقیقه",
      tags: tags || [],
      emoji: emoji || "📝",
      date: new Date().toLocaleDateString("fa-IR"),
      isFeatured: !!isFeatured
    };
    cmsArticles.unshift(newArticle);
    res.status(201).json(newArticle);
  });

  app.put("/api/cms/:id", (req, res) => {
    const { id } = req.params;
    const article = cmsArticles.find(a => a.id === id);
    if (!article) {
      return res.status(404).json({ error: "مقاله پیدا نشد." });
    }
    const { title, content, category, author, readTime, tags, emoji, isFeatured } = req.body;
    if (title) article.title = title;
    if (content) article.content = content;
    if (category) article.category = category;
    if (author) article.author = author;
    if (readTime) article.readTime = readTime;
    if (tags) article.tags = tags;
    if (emoji) article.emoji = emoji;
    if (isFeatured !== undefined) article.isFeatured = isFeatured;
    res.json(article);
  });

  app.delete("/api/cms/:id", (req, res) => {
    const { id } = req.params;
    const index = cmsArticles.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "مقاله مورد نظر یافت نشد." });
    }
    cmsArticles.splice(index, 1);
    res.json({ success: true, message: "مقاله با موفقیت حذف شد." });
  });

  // Settings Endpoints
  app.get("/api/settings", (req, res) => {
    res.json(platformSettings);
  });

  app.post("/api/settings", (req, res) => {
    const { capacityLimit, weightTeam, weightMarket, weightProduct, isRegistrationOpen, acceleratorFundSize, cohortName } = req.body;
    if (capacityLimit !== undefined) platformSettings.capacityLimit = Number(capacityLimit);
    if (weightTeam !== undefined) platformSettings.weightTeam = Number(weightTeam);
    if (weightMarket !== undefined) platformSettings.weightMarket = Number(weightMarket);
    if (weightProduct !== undefined) platformSettings.weightProduct = Number(weightProduct);
    if (isRegistrationOpen !== undefined) platformSettings.isRegistrationOpen = !!isRegistrationOpen;
    if (acceleratorFundSize !== undefined) platformSettings.acceleratorFundSize = acceleratorFundSize;
    if (cohortName !== undefined) platformSettings.cohortName = cohortName;
    res.json(platformSettings);
  });

  // Additional Admin User/Application Operations
  app.put("/api/cofounders/:id", (req, res) => {
    const { id } = req.params;
    const cofounder = cofounders.find(c => c.id === id);
    if (!cofounder) {
      return res.status(404).json({ error: "نمایه هم‌بنیان‌گذار یافت نشد." });
    }
    const { isAvailable, fullName, location, description, contactInfo, role, technicalSkills, businessSkills } = req.body;
    if (isAvailable !== undefined) cofounder.isAvailable = !!isAvailable;
    if (fullName !== undefined) cofounder.fullName = fullName;
    if (location !== undefined) cofounder.location = location;
    if (description !== undefined) cofounder.description = description;
    if (contactInfo !== undefined) cofounder.contactInfo = contactInfo;
    if (role !== undefined) cofounder.role = role;
    if (technicalSkills !== undefined) cofounder.technicalSkills = technicalSkills;
    if (businessSkills !== undefined) cofounder.businessSkills = businessSkills;
    res.json(cofounder);
  });

  app.delete("/api/cofounders/:id", (req, res) => {
    const { id } = req.params;
    const idx = cofounders.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "نمایه مورد نظر یافت نشد." });
    }
    cofounders.splice(idx, 1);
    res.json({ success: true });
  });

  app.put("/api/applications/:id/status", (req, res) => {
    const { id } = req.params;
    const appRecord = applications.find(a => a.id === id);
    if (!appRecord) {
      return res.status(404).json({ error: "درخواست مورد نظر یافت نشد." });
    }
    const { status } = req.body;
    if (status) {
      appRecord.status = status;
    }
    res.json(appRecord);
  });

  app.post("/api/applications/:id/feedback", (req, res) => {
    const { id } = req.params;
    const appRecord = applications.find(a => a.id === id);
    if (!appRecord) {
      return res.status(404).json({ error: "درخواست مورد نظر یافت نشد." });
    }
    const { feedback } = req.body;
    if (feedback) {
      appRecord.feedback = feedback;
    }
    res.json(appRecord);
  });

  // Releases & Build Pipeline Simulation Endpoints
  app.get("/api/releases", (req, res) => {
    res.json(releases);
  });

  app.post("/api/releases/compile", (req, res) => {
    // Set all to compiled, mark the latest as stable/compiled
    const latest = releases.find(r => r.status === "latest");
    if (latest) {
      latest.isCompiled = true;
      latest.status = "stable";
      
      // Create a brand new next-gen release placeholder
      const newVersionNum = `v1.2.0`;
      const newRelease: ReleaseVersion = {
        version: newVersionNum,
        date: new Date().toLocaleDateString("fa-IR"),
        title: "ماژول بازخورد پیشرفته جامعه کاربری و انجمن",
        changelog: [
          "توسعه انجمن پرسش و پاسخ بنیان‌گذاران با موضوع چالش‌های رگولاتوری.",
          "یکپارچه‌سازی فرآیند امضای تفاهم‌نامه محرمانگی (NDA) دیجیتال.",
          "بهینه‌سازی پردازش هم‌زمان ارزیابی‌های سنگین استارتاپی."
        ],
        status: "latest",
        isCompiled: false
      };
      releases.unshift(newRelease);
    }
    res.json({ success: true, releases });
  });

  // Helper helper to generate nice local simulator data if key is unavailable
  function generateSimulatedInsights(startup: Startup): any {
    const id = startup.id;
    if (id === "1") {
      return {
        strengths: [
          { title: "اثر شبکه قدرتمند (Network Effects)", description: "بزرگ‌ترین پایگاه داده رانندگان و مسافران در کشور که مانع بزرگی برای ورود رقبای جدید است." },
          { title: "سوپراپلیکیشن همه‌کاره", description: "تنوع خدمات از سفارش غذا و پزشک تا پرواز، ارزش چرخه عمر مشتری (LTV) را به شدت افزایش داده است." },
          { title: "برندینگ مسلط", description: "شناخته‌شده‌ترین نام تجاری حوزه حمل‌ونقل اینترنتی در ایران با وفاداری بالای کاربران." }
        ],
        weaknesses: [
          { title: "هزینه‌های فزاینده پشتیبانی", description: "مدیریت ناوگان عظیمی از رانندگان و چالش‌های پشتیبانی ۲۴ ساعته و مرکز تماس سنگین." },
          { title: "حاشیه سود کم تاکسی", description: "هزینه‌های بالای بازاریابی و تخفیف‌ها حاشیه سود خالص خدمات پایه را تحت فشار قرار می‌دهد." },
          { title: "وابستگی زیاد به اینترنت", description: "هرگونه اختلال در شبکه اینترنت کشور مستقیماً به کاهش شدید درآمد و تعداد سفرهای روزانه منجر می‌شود." }
        ],
        opportunities: [
          { title: "توسعه لجستیک بین‌شهری", description: "استفاده از زیرساخت فعلی برای تسخیر بازار حمل بار بین‌شهری و توزیع کالای بزرگ." },
          { title: "فین‌تک و اعتبارسنجی (BNPL)", description: "ارائه اعتبارهای خرد به میلیون‌ها کاربر فعال بر بستر بازوی فین‌تک اسنپ‌پی." },
          { title: "سرویس‌های سازمانی (B2B)", description: "توسعه پنل‌های سازمانی مدیریت سفر و لجستیک برای سازمان‌ها و شرکت‌های متوسط و بزرگ." }
        ],
        threats: [
          { title: "رگولاتوری و قانون‌گذاری", description: "چالش‌های همیشگی با شهرداری‌ها، تامین اجتماعی و اصناف تاکسیرانی سنتی." },
          { title: "ریزش رانندگان", description: "تورم شدید و استهلاک بالای خودروها که انگیزه رانندگان برای کار با تعرفه‌های فعلی را کاهش می‌دهد." },
          { title: "امنیت داده‌های کاربران", description: "خطر حملات سایبری و نشت اطلاعات حساس سفرها و کاربران که به اعتبار برند ضربه می‌زند." }
        ],
        investorAdvice: "اسنپ به عنوان رهبر بلامنازع بازار سوپراپلیکیشن ایران، یک سرمایه‌گذاری بسیار پایدار است. رشد آتی این شرکت از بازوی فین‌تک و خدمات اعتباری (BNPL) تامین خواهد شد که نرخ تبدیل بالا و حاشیه سود بهتری نسبت به تاکسی سنتی دارند. با این حال، سرمایه‌گذاران باید ریسک‌های رگولاتوری و هزینه‌های عملیاتی ناشی از استهلاک رانندگان را مد نظر قرار دهند.",
        potentialRating: "Very High",
        recommendation: "Strong Invest"
      };
    } else if (id === "2") {
      return {
        strengths: [
          { title: "تسلط بر سهم بازار خرده‌فروشی", description: "سهم بیش از ۸۵ درصدی بازار تجارت الکترونیک ایران با میلیون‌ها بازدید روزانه." },
          { title: "زنجیره تامین و لجستیک", description: "بزرگ‌ترین و پیشرفته‌ترین شبکه انبارداری و ارسال کالا در سراسر ایران." },
          { title: "زیرساخت مارکت‌پلیس قوی", description: "همکاری با بیش از ۳۰۰ هزار فروشنده مستقل که تنوع کالایی را به شدت افزایش داده است." }
        ],
        weaknesses: [
          { title: "کنترل کیفیت فروشندگان", description: "چالش‌های نظارت بر اصالت کالاها و قیمت‌گذاری منصفانه توسط فروشندگان مارکت‌پلیس." },
          { title: "هزینه‌های لجستیک بالا", description: "هزینه‌های توزیع مویرگی در شهرهای دورافتاده و نگهداری ناوگان اختصاصی ارسال کالا." },
          { title: "وابستگی به تامین خارجی", description: "کاهش موجودی کالا در برخی دسته‌بندی‌های لوکس یا تکنولوژی به دلیل محدودیت‌های وارداتی کشور." }
        ],
        opportunities: [
          { title: "بخش پردازش ابری و فناوری", description: "توسعه زیرساخت دیجی‌کالا مگ، دیجی‌پی و سرویس‌های ابری اختصاصی برای بازار B2B." },
          { title: "توسعه فروشگاه‌های فیزیکی", description: "رویکرد چندکاناله (Omnichannel) و ایجاد ایستگاه‌های تحویل حضوری یا فروشگاه‌های تجربه مشتری." },
          { title: "تجارت اجتماعی (Social Commerce)", description: "بهره‌گیری از پلتفرم‌های محتوایی برای خرید مستقیم کاربران بر اساس توصیه‌های اجتماعی." }
        ],
        threats: [
          { title: "کاهش قدرت خرید مصرف‌کننده", description: "تورم شدید که باعث اولویت‌بندی خریدهای معیشتی نسبت به کالاهای غیرضروری می‌شود." },
          { title: "ظهور رقبای تخصصی", description: "تمرکز برخی رقبای نوپا روی دسته‌بندی‌های خاص مانند آرایشی, مد یا ابزارآلات صنعتی." },
          { title: "مقررات سخت‌گیرانه تعزیرات", description: "نظارت‌های قیمت‌گذاری دستوری که حاشیه سود کالاهای پرفروش را تهدید می‌کند." }
        ],
        investorAdvice: "دیجی‌کالا هم‌چنان لوکوموتیو تجارت الکترونیک کشور است. ثبات بالای مدل بیزنس و زیرساخت لجستیک عظیم آن، هرگونه رقیب جدید را در کوتاه‌مدت بی‌اثر می‌کند. نقطه عطف دیجی‌کالا در بهینه‌سازی زنجیره توزیع و بهره‌وری سرویس‌های جانبی مانند دیجی‌پی و سرویس‌های اشتراکی دیجی‌پلاس است. سرمایه‌گذاری روی این شرکت به معنای سرمایه‌گذاری روی هسته مرکزی اقتصاد دیجیتال ایران است.",
        potentialRating: "Very High",
        recommendation: "Strong Invest"
      };
    } else if (id === "3") {
      return {
        strengths: [
          { title: "پایگاه نصب فوق‌العاده بالا", description: "یکی از پرنصب‌ترین اپلیکیشن‌های پرداخت موبایلی در ایران با ضریب نفوذ بالا." },
          { title: "تنوع درگاه‌های فیزیکی و مجازی", description: "اتصال مستقیم به شبکه عظیمی از کارت‌خوان‌های فروشگاهی و درگاه‌های پرداخت اینترنتی." },
          { title: "زیرساخت قوی بانکداری", description: "شراکت‌های عمیق بانکی و پیوندهای مستحکم با سیستم شاپرک." }
        ],
        weaknesses: [
          { title: "کاهش جذابیت خدمات پایه", description: "وابستگی زیاد به کارمزدهای خدمات عمومی مانند خرید شارژ و بسته اینترنت که سود بالایی ندارند." },
          { title: "تجربه کاربری قدیمی", description: "واسط کاربری شلوغ و نسبتاً پیچیده در مقایسه با نئوبانک‌ها و فین‌تک‌های مدرن نسل جدید." },
          { title: "وابستگی به تصمیمات رگولاتور", description: "هرگونه تغییر ناگهانی در قوانین کارمزد شاپرک مستقیماً روی درآمد اصلی شرکت اثرگذار است." }
        ],
        opportunities: [
          { title: "خدمات مدیریت ثروت و سرمایه", description: "توسعه بخش‌های خرید بیمه، صندوق‌های سرمایه‌گذاری و معاملات بورس در اپلیکیشن." },
          { title: "اعتبارسنجی و لندتک (Lendtech)", description: "ارائه وام‌های خرد و متوسط با همکاری بانک‌های طرف قرارداد بر اساس داده‌های مالی غنی کاربران." },
          { title: "سرویس‌های پرداخت اختصاصی اصناف", description: "ارائه راهکارهای پرداخت تخصصی برای رستوران‌ها، زنجیره‌های تامین و بازارچه‌ها." }
        ],
        threats: [
          { title: "نئوبانک‌های جذاب", description: "جذب کاربران جوان‌تر توسط نئوبانک‌های شیک و ساده مانند بلوبانک." },
          { title: "تغییرات قوانین کارمزد", description: "ریسک‌های مربوط به کاهش دستوری تعرفه‌های شاپرک یا انتقال هزینه‌های تراکنش به پذیرندگان." },
          { title: "امنیت داده و تقلب مالی", description: "حملات سایبری و استفاده‌های سوء از کدهای USSD یا اپلیکیشن برای فیشینگ." }
        ],
        investorAdvice: "آسان پرداخت دارای زیرساخت تراکنشی بسیار عظیمی است، اما نیازمند یک بازآفرینی در تجربه کاربری و مدل‌های کسب‌وکار مدرن‌تر است. پتانسیل اصلی آپ در گذار از یک اپلیکیشن تراکنشی ساده به پلتفرم جامع مدیریت ثروت و لندتک نهفته است. در صورت اجرای موفق این گذار، ارزش سهام و بازدهی سرمایه‌گذاری روی آن تحول چشم‌گیری خواهد داشت.",
        potentialRating: "High",
        recommendation: "Watch"
      };
    } else if (id === "4") {
      return {
        strengths: [
          { title: "رهبری بازار گردشگری آنلاین", description: "بزرگ‌ترین سهم فروش بلیط هواپیما، قطار و اتوبوس در ایران با اختلاف زیاد." },
          { title: "پشتیبانی مشتریان بی‌وقفه", description: "سیستم کال‌سنتر و پشتیبانی مسافران بسیار متمرکز و قوی در حل بحران‌های سفر." },
          { title: "پوشش جامع خدمات", description: "ارائه کامل‌ترین زنجیره ارزش سفر از بلیط تا رزرو هتل و تورهای گردشگری بومی." }
        ],
        weaknesses: [
          { title: "حاشیه سود پایین بلیط", description: "حاشیه سود ناچیز حاصل از فروش پروازهای داخلی به دلیل قیمت‌گذاری دستوری." },
          { title: "وابستگی شدید به فصل", description: "نوسانات فصلی شدید در تقاضا و درآمد (تابستان و نوروز پرفروش، پاییز و زمستان کم‌رونق)." },
          { title: "زیرساخت محدود هتل‌های داخلی", description: "چالش‌های هماهنگی دستی با برخی هتل‌های سنتی به دلیل نبود نرم‌افزارهای یکپارچه رزرواسیون." }
        ],
        opportunities: [
          { title: "تورهای تخصصی و تجربی", description: "توسعه بسته‌های سفر اختصاصی و بوم‌گردی‌های خاص برای اقشار پردرآمد." },
          { title: "سفرهای شرکتی (B2B Travel)", description: "پیکربندی پنل‌های اختصاصی سفر برای مدیریت هزینه‌های ماموریت سازمان‌های بزرگ." },
          { title: "سیستم اعتباری سفر", description: "ارائه خریدهای اقساطی سفر (سفر کارت) برای افزایش کشش تقاضا در فصول کم‌تقاضا." }
        ],
        threats: [
          { title: "تنش‌های سیاسی و پروازی", description: "کنسلی‌های مکرر پروازهای خارجی یا چالش‌های ناوگان هوایی فرسوده کشور." },
          { title: "تورم و اولویت سفر در سبد خانوار", description: "حذف تدریجی سفرهای تفریحی از سبد خانواده‌های طبقه متوسط به دلیل فشارهای اقتصادی." },
          { title: "انحصار ایرلاین‌ها", description: "ریسک فروش مستقیم بلیط توسط خود شرکت‌های هواپیمایی بدون واسطه اپلیکیشن‌ها." }
        ],
        investorAdvice: "علی‌بابا نشان داده که چطور می‌توان یک بازار سنتی و آشفته را سامان‌دهی کرد. با وجود حاشیه سود اندک روی بلیط، تخصص علی‌بابا در فروش مکمل (Cross-selling) مانند هتل, بیمه و تور، سودآوری مناسبی ایجاد می‌کند. سرمایه‌گذاران باید به پایداری این شرکت در شرایط بحران اقتصادی تکیه کنند، چرا که سفر هم‌چنان یک نیاز اساسی برای بخش عمده‌ای از طبقه متوسط و سازمان‌ها باقی مانده است.",
        potentialRating: "High",
        recommendation: "Invest"
      };
    } else if (id === "5") {
      return {
        strengths: [
          { title: "جامعه مخاطب به شدت وفادار", description: "ایجاد یک شبکه اجتماعی قوی از خانم‌ها که فراتر از خرید و فروش، به تعامل اجتماعی می‌پردازند." },
          { title: "رویکرد زیست‌محیطی (Sustainability)", description: "تمرکز بر مد پایدار و استفاده مجدد از لباس‌ها که با روندهای جهانی هم‌راستاست." },
          { title: "مدل سبک دارایی (Asset-light)", description: "بدون نیاز به انبارداری کالا، تراکنش‌ها بین خود کاربران انجام می‌شود و ریسک انبار ندارد." }
        ],
        weaknesses: [
          { title: "اندازه بازار هدف محدود", description: "تمرکز انحصاری بر پوشاک و اکسسوری‌های بانکی بازار هدف تام را محدود می‌کند." },
          { title: "لجستیک بین‌کاربری پیچیده", description: "اتکا به کاربران برای بسته‌بندی و ارسال کالاها که منجر به ناهماهنگی در زمان تحویل می‌شود." },
          { title: "نرخ کارمزد پایین", description: "حاشیه کارمزد اندک که درآمدزایی در ابعاد کوچک را با چالش روبه‌رو می‌کند." }
        ],
        opportunities: [
          { title: "گسترش به دسته‌بندی‌های جدید", description: "ورود به حوزه‌های لوازم خانگی دست دوم، کتاب و لوازم کودک." },
          { title: "همکاری با برندهای پایدار", description: "ایجاد کانال‌های فروش مستقیم برای برندهای محلی که به پایداری اهمیت می‌دهند." },
          { title: "سرویس‌های ارزش‌افزوده نظیر کارشناسی", description: "ارائه خدمات کارشناسی اصالت لباس‌های برند لوکس به عنوان یک جریان درآمدی جدید." }
        ],
        threats: [
          { title: "رقبای چندمنظوره بزرگ", description: "پلتفرم شیپور یا دیوار که بخش عظیمی از کالاهای دست دوم را به صورت رایگان مبادله می‌کنند." },
          { title: "ریزش کاربران جامعه", description: "افت جذابیت شبکه اجتماعی با ورود پلتفرم‌های جدید یا خستگی مخاطب هدف." },
          { title: "کاهش کیفیت کالاها", description: "خطر از دست رفتن اعتماد جامعه کاربری در اثر فروش کالاهای بی‌کیفیت یا خراب." }
        ],
        investorAdvice: "کمدا یک استارتاپ جامعه‌محور (Community-driven) فوق‌العاده با وفاداری بالاست. ارزش اصلی کمدا در نرخ درگیری (Engagement) بالای کاربران است. برای رشد انفجاری، کمدا باید دسته‌بندی‌های خود را به سایر بخش‌های زندگی خانوادگی و اجتماعی تسری دهد. برای سرمایه‌گذارانی که به تجارت اجتماعی علاقه دارند، کمدا یک گزینه جذاب با ریسک عملیاتی پایین به دلیل مدل Asset-light است.",
        potentialRating: "Medium",
        recommendation: "Watch"
      };
    } else {
      return {
        strengths: [
          { title: `تمرکز بر حوزه ${startup.sector}`, description: `استفاده از تخصص ویژه در صنف بازار رو به رشد و پویای ${startup.sector}.` },
          { title: "مدل کسب و کار چابک", description: `طراحی چابک مدل درآمدی (${startup.revenueModel}) برای پاسخ‌گویی سریع به نیاز مخاطبان هدف.` },
          { title: "رهبری متمرکز بنیان‌گذاران", description: `هدایت استارتاپ توسط تیم بنیان‌گذار متعهد: ${startup.founders.join(' و ')}.` }
        ],
        weaknesses: [
          { title: "نبود آگاهی از برند اولیه", description: "نیاز مبرم به هزینه‌های مارکتینگ و روابط عمومی برای معرفی نام استارتاپ در بازار هدف اولیه." },
          { title: "تأمین مالی در مراحل اولیه", description: `نیاز استارتاپ به جذب منابع مالی جهت گذار از فاز توسعه فنی به مقیاس اقتصادی.` },
          { title: "موانع عملیاتی محلی", description: `چالش‌های لجستیک، هماهنگی یا انطباق با نیازمندی‌های خاص منطقه ${startup.location}.` }
        ],
        opportunities: [
          { title: "گسترش جغرافیایی کلان", description: `امکان مقیاس‌دهی بازار از شهر مبدا (${startup.location}) به تمام کلان‌شهرهای تشنه خدمات مدرن.` },
          { title: "یکپارچه‌سازی با ابزارهای هوش مصنوعی", description: "بهره‌گیری از تکنولوژی‌های هوشمند برای خودکارسازی خدمات مشتریان و کاهش چشم‌گیر هزینه‌ها." },
          { title: "همکاری‌های استراتژیک B2B", description: "انعقاد قراردادهای کلان با شرکت‌ها و صنایع مستقر جهت تضمین درآمدهای ثابت ماهانه." }
        ],
        threats: [
          { title: "ورود ناگهانی رقبای بزرگتر", description: "ریسک ورود بازیگران مسلط اکوسیستم به حوزه فعالیت تخصصی این استارتاپ چابک." },
          { title: "ریسک نوسانات بازار و ارز", description: "تغییر ناگهانی قدرت خرید کاربران هدف و افزایش هزینه‌های ابزاری و سرور زیرساخت." },
          { title: "تغییر قوانین و مجوزهای صنفی", description: "ایجاد مقررات محدودکننده دولتی یا صنفی که مدل عملیاتی کسب‌وکار نوپا را با تاخیر مواجه کند." }
        ],
        investorAdvice: `استارتاپ ${startup.name} در حوزه بسیار پرپتانسیل ${startup.sector} فعالیت می‌کند. مدل درآمدی طراحی شده یعنی "${startup.revenueModel}" پتانسیل خوبی برای شروع دارد اما برای رسیدن به نقطه سرآمدی مالی نیازمند بهینه‌سازی دقیق هزینه‌های جذب مشتری (CAC) است. حضور بنیان‌گذاران باانگیزه یعنی ${startup.founders.join(' و ')} نقطه اتکای محکمی برای سرمایه‌گذاران خطرپذیر مراحل اولیه است تا با تزریق سرمایه بذری هوشمند، مسیر ورود به بازار این ایده نوآورانه را هموار کنند.`,
        potentialRating: "High",
        recommendation: "Invest"
      };
    }
  }

  // Helper helper to generate nice local simulator data if key is unavailable
  function generateSimulatedFeedback(app: StartupApplication): ApplicationFeedback {
    const marketScore = Math.floor(Math.random() * 25) + 65; // 65-90
    const productScore = Math.floor(Math.random() * 30) + 60; // 60-90
    const teamScore = Math.floor(Math.random() * 20) + 75; // 75-95
    
    const isGood = (marketScore + productScore + teamScore) / 3 > 75;
    const verdict = isGood ? "Interview" : "Deferred";
    
    return {
      strengths: [
        `تمرکز مستقیم بر حل مسئله واقعی در بازار بومی (${app.sector}) که تقاضای بالایی دارد.`,
        `ارائه ارزش پیشنهادی نسبتاً واضح و تمرکز بر موقعیت جغرافیایی فعال در ${app.location}.`,
        `پتانسیل بالای رشد با توجه به سوابق فنی یا کسب‌وکاری تشریح شده توسط بنیان‌گذاران.`
      ],
      weaknesses: [
        `مدل درآمدی (${app.revenueModel}) نیاز به راستی‌آزمایی میدانی اولیه و بررسی کشش قیمت دارد.`,
        `وجود رقبای سنتی یا اینترنتی مستقر در بازار که نیازمند استراتژی ورود به بازار (GTM) تهاجمی‌تری است.`,
        `ابهام در چالش‌های قانونی و مجوزهای رگولاتوری مربوط به صنف هدف.`
      ],
      scoreMarket: marketScore,
      scoreProduct: productScore,
      scoreTeam: teamScore,
      verdict: verdict,
      verdictReason: verdict === "Interview" ? "تیم پرشور و بازار رو به رشد. دعوت به جلسه دفاع اولیه." : "کسب‌وکار نیاز به اعتبارسنجی بیشتر مدل اقتصادی قبل از ورود به چرخه شتاب‌دهی دارد.",
      partnerComments: `ایده استارتاپی شما (${app.name}) دارای زیربنای مناسبی است. با این حال، در اکوسیستم فعلی ایران، بزرگ‌ترین چالش شما سهم بازار اولیه و هزینه‌های جذب مشتری (CAC) خواهد بود. پیشنهاد می‌کنیم روی ارقام دقیق‌تری از اندازه بازار در دسترس (SOM) کار کنید و یک طرح پایلوت کوچک با ۱۰ مشتری کلیدی اجرا کنید تا فرضیات خود را قبل از هرگونه جذب سرمایه بزرگ ثابت کنید.`,
      recommendedMilestones: [
        `طراحی و انتشار نسخه کمینه محصول پذیرفتنی (MVP) در بازار محلی ظرف ۴ هفته آینده.`,
        `مذاکره و گرفتن تاییدیه یا بازخورد کتبی از حداقل ۵ مشتری واقعی در صنف هدف.`,
        `بررسی دقیق مدل جریان‌های مالی و کاهش هزینه‌های ثابت تا رسیدن به نقطه سرآمدی عملیاتی.`
      ]
    };
  }

  // --- Vite Dev Server & Static Assets ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 HamMasir YC Server running on http://localhost:${PORT}`);
  });
}

startServer();
