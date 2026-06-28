import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Shield, 
  Check, 
  Clock, 
  Lock, 
  ShoppingBag, 
  EyeOff, 
  ChevronRight,
  Info,
  BadgeAlert,
  Smartphone,
  CreditCard,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, CATEGORIES } from './data';
import { Product, CartItem, ScreenType } from './types';
import logoImg from '@/assets/creator_lab_logo.jpg';

const TRANSLATIONS = {
  en: {
    welcome: "Welcome",
    tagline: "Your Private 24/7 Health Dispenser",
    description: "Purchase personal health and wellness products anonymously through the Creator Lab Smart Kiosk.",
    startShopping: "Start Shopping",
    whyChooseUs: "Why choose us",
    anonymousTitle: "Anonymous",
    anonymousDesc: "No tracking. Complete isolation of your medical transaction records.",
    touchlessTitle: "Touchless",
    touchlessDesc: "Hygienic use. Conduct purchase on your screen, collect directly.",
    upiQrTitle: "UPI & QR",
    upiQrDesc: "Fast, secure payments. Instant scan code and pick.",
    realTimeTitle: "Real-Time",
    realTimeDesc: "Always accurate. Showing live dispenser inventory of products.",
    howItWorks: "How It Works",
    step1Title: "Scan QR",
    step1Desc: "Start your session anonymously at the physical kiosk screen.",
    step2Title: "Select",
    step2Desc: "Choose your medical products on your own phone or kiosk screen.",
    step3Title: "Pay",
    step3Desc: "Secure touchless mobile payment (UPI, cards, or digital wallets).",
    step4Title: "Collect",
    step4Desc: "Your items dispense instantly in the kiosk's private pick-up tray.",
    secureTitle: "100% Secure",
    secureDesc: "Encrypted",
    privacyTitle: "Total Privacy",
    privacyDesc: "Verified",
    guideBtn: "GUIDE",
    needHelp: "Need help? 1800-111-2222",
    safetyHelpline: "Women's Safety Helpline: 1091",
  },
  hi: {
    welcome: "स्वागत है",
    tagline: "आपका निजी 24/7 स्वास्थ्य डिस्पेंसर",
    description: "द क्रिएटर लैब स्मार्ट कियोस्क के माध्यम से गुमनाम रूप से व्यक्तिगत स्वास्थ्य और कल्याण उत्पाद खरीदें।",
    startShopping: "खरीदारी शुरू करें",
    whyChooseUs: "हमारा चयन क्यों करें",
    anonymousTitle: "गुमनाम",
    anonymousDesc: "कोई ट्रैकिंग नहीं। आपके चिकित्सा लेनदेन रिकॉर्ड का पूर्ण अलगाव।",
    touchlessTitle: "स्पर्श रहित",
    touchlessDesc: "हाइजीनिक उपयोग। अपनी स्वयं की स्क्रीन पर खरीदारी करें, सीधे कलेक्ट करें।",
    upiQrTitle: "UPI और QR",
    upiQrDesc: "तेज़, सुरक्षित भुगतान। तुरंत कोड स्कैन करें और चुनें।",
    realTimeTitle: "रियल-टाइम",
    realTimeDesc: "हमेशा सटीक। उत्पादों की लाइव डिस्पेंसर इन्वेंट्री दिखा रहा है।",
    howItWorks: "यह कैसे काम करता है",
    step1Title: "QR स्कैन करें",
    step1Desc: "भौतिक कियोस्क स्क्रीन पर गुमनाम रूप से अपना सत्र शुरू करें।",
    step2Title: "उत्पाद चुनें",
    step2Desc: "अपने फोन या कियोस्क स्क्रीन पर अपने चिकित्सा उत्पाद चुनें।",
    step3Title: "भुगतान करें",
    step3Desc: "सुरक्षित स्पर्श रहित मोबाइल भुगतान (UPI, कार्ड, या डिजिटल वॉलेट)।",
    step4Title: "सामान प्राप्त करें",
    step4Desc: "आपकी वस्तुएं तुरंत कियोस्क की निजी पिक-अप ट्रे में डिस्पेंस हो जाएंगी।",
    secureTitle: "100% सुरक्षित",
    secureDesc: "एन्क्रिप्टेड",
    privacyTitle: "पूर्ण गोपनीयता",
    privacyDesc: "सत्यापित",
    guideBtn: "गाइड",
    needHelp: "सहायता चाहिए? 1800-111-2222",
    safetyHelpline: "महिला सुरक्षा हेल्पलाइन: 1091",
  }
};

export default function App() {
  // Navigation & Cart States
  const [screen, setScreen] = useState<ScreenType>('landing');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS.find(p => p.id === 'w2') || PRODUCTS[1], // XL Sanitary Pad (₹20)
      quantity: 1
    },
    {
      product: PRODUCTS.find(p => p.id === 'w3') || PRODUCTS[2], // Painkiller Meftal-Spas (₹30)
      quantity: 1
    },
    {
      product: PRODUCTS.find(p => p.id === 'h1') || PRODUCTS[10], // Hand Sanitizer (₹30)
      quantity: 1
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("Women's Health");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  

  // Payment States
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('GPay');
  const [upiId, setUpiId] = useState<string>('');
  const [paymentProcessing, setPaymentSuccess] = useState<boolean>(false);
  const [paymentFinished, setPaymentFinished] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  // Custom state for Guide modal
  const [guideOpen, setGuideOpen] = useState<boolean>(false);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) {
            return null;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Payment Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentFinished && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Reset after purchase complete and go back to landing
      setCart([]);
      setScreen('landing');
      setPaymentSuccess(false);
      setPaymentFinished(false);
      setCountdown(5);
      setUpiId('');
    }
    return () => clearTimeout(timer);
  }, [paymentFinished, countdown]);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentFinished(true);
    }, 1800); // 1.8 seconds processing time
  };

  // Filtered products list based on category and search query
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Card Background Color helper
  const getProductBg = (type: string) => {
    switch (type) {
      case 'fluid':
        return 'bg-rose-50/70 border-rose-100';
      case 'pill':
        return 'bg-amber-50/70 border-amber-100';
      case 'spray':
        return 'bg-sky-50/70 border-sky-100';
      default:
        return 'bg-emerald-50/70 border-emerald-100';
    }
  };

  return (
    <div className="w-full max-w-[430px] h-screen md:h-[92vh] bg-surface flex flex-col relative shadow-[0_0_30px_rgba(0,110,47,0.1)] md:rounded-3xl overflow-hidden mx-auto border border-[#bdcaba]/30 my-0 md:my-auto pb-16">
      
      {/* BLACK DYNAMIC ISLAND NOTCH */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1f2022] rounded-b-xl flex items-center justify-center gap-1.5 z-50">
        <div className="w-2 h-2 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
      </div>

      {/* FLOATING GREEN SAGE STATUS BAR */}
      <div className="mx-4 mt-7 mb-2 bg-[#c9d9cb] border border-[#b7c6b9] rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-sm z-40">
        <div className="flex items-center gap-2 font-sans font-bold text-xs text-[#2d3e30]">
          <span className="material-symbols-outlined text-[18px] text-[#16A34A]">health_metrics</span>
          <span>PrivaCare</span>
        </div>
        <button 
          onClick={() => setGuideOpen(true)}
          className="bg-[#b7c6b9]/40 border border-[#aab9ad] text-[#2d3e30] rounded-full px-3 py-1 text-[11px] font-bold flex items-center gap-1 hover:bg-[#b7c6b9]/60 active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {TRANSLATIONS[lang].guideBtn}
        </button>
      </div>

      {/* HEADER BAR */}
      <header className="w-full pt-3 pb-4 px-5 sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#bdcaba]/30 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          {screen !== 'landing' && (
            <button 
              onClick={() => {
                if (screen === 'payment') setScreen('cart');
                else if (screen === 'cart') setScreen('products');
                else if (screen === 'products') setScreen('landing');
              }}
              className="text-[#006b2c] hover:opacity-80 transition-opacity active:scale-90 p-1 rounded-full hover:bg-secondary-container"
            >
              <ArrowLeft size={22} className="stroke-[2.5px]" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            {screen === 'landing' ? (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#16A34A] text-2xl">health_metrics</span>
                <h1 className="font-sans font-bold text-2xl tracking-tight text-[#16A34A]">
                  PrivaCare
                </h1>
              </div>
            ) : (
              <h1 className="font-sans font-bold text-2xl tracking-tight text-primary">
                {screen === 'products' ? 'Products' : screen === 'cart' ? 'My Cart' : 'Payment'}
              </h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {screen === 'landing' && (
            <>
              {/* English / Hindi Switcher */}
              <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200 shadow-inner mr-1.5">
                <button 
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-[11px] font-extrabold rounded-full transition-all cursor-pointer ${
                    lang === 'en' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('hi')}
                  className={`px-3 py-1 text-[11px] font-extrabold rounded-full transition-all cursor-pointer ${
                    lang === 'hi' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  हिं
                </button>
              </div>

              {/* Account Profile Circle Button */}
              <button 
                onClick={() => setAboutOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary-container/50 transition-colors active:scale-95 text-[#16A34A] border border-[#d9e6dd]"
              >
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
              </button>
            </>
          )}
          {screen === 'products' && (
            <>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-primary hover:opacity-80 transition-opacity active:scale-90 p-1.5 rounded-full hover:bg-secondary-container cursor-pointer"
              >
                <Search size={22} className="stroke-[2.5]" />
              </button>
              <button 
                onClick={() => setScreen('cart')}
                className="relative text-primary hover:opacity-80 transition-opacity active:scale-90 p-1.5 rounded-full hover:bg-secondary-container cursor-pointer"
              >
                <ShoppingCart size={22} className="stroke-[2.5]" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </header>

      {/* SEARCH BAR (EXPANDABLE) */}
      <AnimatePresence>
        {searchOpen && screen === 'products' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 py-3 bg-white border-b border-outline-variant/10 overflow-hidden flex gap-2"
          >
            <input 
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 border border-outline-variant/30 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-1 flex flex-col p-5 overflow-y-auto ${
        (screen === 'products' && getCartCount() > 0) || (screen === 'cart' && cart.length > 0)
          ? 'pb-36' 
          : ''
      }`}>
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: LANDING */}
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {/* Hero Section */}
              <section className="bg-gradient-to-tr from-[#F0FDF4] via-[#DCFCE7] to-white px-5 pt-8 pb-10 text-center rounded-[28px] overflow-hidden relative border border-emerald-100/50 shadow-sm flex flex-col items-center">
                <div className="flex justify-center mb-6 relative z-10">
                  {/* Vending Machine SVG */}
                  <svg fill="none" height="130" viewBox="0 0 130 150" width="130" xmlns="http://www.w3.org/2000/svg">
                    <rect fill="#16A34A" height="130" rx="12" width="80" x="25" y="10"></rect>
                    <rect fill="#16A34A" height="15" rx="8" width="80" x="25" y="10"></rect>
                    <circle cx="90" cy="40" fill="#22C55E" r="4"></circle>
                    <circle cx="90" cy="52" fill="#22C55E" r="4"></circle>
                    <rect fill="#064E3B" height="35" rx="6" width="45" x="35" y="35"></rect>
                    {/* Heart Accent */}
                    <path d="M57.5 58C57.5 58 54.5 54 51.5 54C48.5 54 47.5 56 47.5 57.5C47.5 59 49.5 61 57.5 65C65.5 61 67.5 59 67.5 57.5C67.5 56 66.5 54 63.5 54C60.5 54 57.5 58 57.5 58Z" fill="#10B981"></path>
                    <rect fill="#064E3B" height="8" rx="4" width="50" x="40" y="110"></rect>
                    {/* Leaf Accent */}
                    <path d="M100 15C100 15 110 5 115 15C115 25 105 30 100 15Z" fill="#4ADE80"></path>
                  </svg>
                </div>

                <p className="font-bold text-[11px] tracking-[3px] text-[#16A34A] mb-3 uppercase">
                  PRIVACARE
                </p>
                <h2 className="font-sans font-bold text-2xl text-[#0F172A] mb-2 leading-tight">
                  {lang === 'en' ? 'Your Private Health Store' : 'आपका निजी स्वास्थ्य स्टोर'}
                </h2>
                <p className="font-sans text-sm text-[#6B7280] mb-6 max-w-[280px] mx-auto leading-relaxed">
                  {lang === 'en' ? 'Buy health products anytime, privately, without talking to anyone.' : 'किसी से बात किए बिना, निजी तौर पर, कभी भी स्वास्थ्य उत्पाद खरीदें।'}
                </p>

                {/* Status Badges */}
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="px-3.5 py-1.5 bg-white text-[#16A34A] border border-[#BBF7D0]/60 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">lock</span> {lang === 'en' ? 'Private' : 'निजी'}
                  </span>
                  <span className="px-3.5 py-1.5 bg-white text-[#16A34A] border border-[#BBF7D0]/60 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">bolt</span> {lang === 'en' ? 'Instant' : 'तुरंत'}
                  </span>
                  <span className="px-3.5 py-1.5 bg-white text-[#16A34A] border border-[#BBF7D0]/60 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">spa</span> {lang === 'en' ? '24×7' : '२४×७'}
                  </span>
                </div>
              </section>

              {/* Get Started Card */}
              <button 
                onClick={() => setScreen('products')}
                className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white rounded-2xl p-4 shadow-lg shadow-emerald-700/10 active:scale-[0.97] transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🛒</div>
                  <div className="text-left font-sans">
                    <p className="text-[18px] font-bold">{lang === 'en' ? 'Start Shopping' : 'खरीदारी शुरू करें'}</p>
                    <p className="text-white/80 text-xs font-medium">{lang === 'en' ? 'Browse 20+ products' : '२०+ उत्पाद देखें'}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>

              {/* How It Works Section */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-gray-100"></div>
                  <h3 className="text-[11px] font-bold tracking-[2px] text-[#6B7280] uppercase">
                    {lang === 'en' ? 'HOW IT WORKS' : 'यह कैसे काम करता है'}
                  </h3>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#FEF9C3] rounded-full flex-shrink-0 flex items-center justify-center text-xl">👆</div>
                    <div className="text-left">
                      <h4 className="font-sans text-[15px] font-bold text-[#111827] mb-0.5">
                        {lang === 'en' ? 'Choose Products' : 'उत्पाद चुनें'}
                      </h4>
                      <p className="font-sans text-xs text-[#6B7280]">
                        {lang === 'en' ? 'Browse menu and tap what you need.' : 'मेन्यू ब्राउज़ करें और अपनी ज़रूरत की चीज़ों पर टैप करें।'}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#F0FDF4] rounded-full flex-shrink-0 flex items-center justify-center text-xl">💳</div>
                    <div className="text-left">
                      <h4 className="font-sans text-[15px] font-bold text-[#111827] mb-0.5">
                        {lang === 'en' ? 'Pay with UPI' : 'UPI से भुगतान'}
                      </h4>
                      <p className="font-sans text-xs text-[#6B7280]">
                        {lang === 'en' ? 'Scan the QR code with any UPI app.' : 'किसी भी UPI ऐप से QR कोड स्कैन करें।'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#EFF6FF] rounded-full flex-shrink-0 flex items-center justify-center text-xl">📦</div>
                    <div className="text-left">
                      <h4 className="font-sans text-[15px] font-bold text-[#111827] mb-0.5">
                        {lang === 'en' ? 'Collect Your Items' : 'सामान प्राप्त करें'}
                      </h4>
                      <p className="font-sans text-xs text-[#6B7280]">
                        {lang === 'en' ? 'The machine gives your items instantly.' : 'मशीन आपको तुरंत सामान प्रदान करती है।'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="text-[11px] font-bold tracking-[2px] text-[#6B7280] mb-5 uppercase text-center">
                  {lang === 'en' ? 'WHY TRUST PRIVACARE' : 'प्रिवाकेयर पर भरोसा क्यों करें'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">lock</span>
                    <p className="font-bold text-[13px] text-[#111827]">{lang === 'en' ? 'Fully Private' : 'पूर्ण गोपनीय'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">schedule</span>
                    <p className="font-bold text-[13px] text-[#111827]">{lang === 'en' ? 'Always Open' : 'हमेशा खुला'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">qr_code_2</span>
                    <p className="font-bold text-[13px] text-[#111827]">{lang === 'en' ? 'Easy Payment' : 'आसान भुगतान'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">bolt</span>
                    <p className="font-bold text-[13px] text-[#111827]">{lang === 'en' ? 'Super Fast' : 'अत्यधिक तेज़'}</p>
                  </div>
                </div>
              </div>

              {/* Products We Offer */}
              <div>
                <h3 className="text-[11px] font-bold tracking-[2px] text-[#6B7280] mb-4 uppercase text-center">
                  {lang === 'en' ? 'PRODUCTS WE OFFER' : 'हमारे उत्पाद'}
                </h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                  {CATEGORIES.map((category, index) => {
                    const count = PRODUCTS.filter(p => p.category === category).length;
                    const emoji = category === "Women's Health" ? "🩸"
                      : category === "Pregnancy" ? "🤰"
                      : category === "Sexual Wellness" ? "💊"
                      : category === "Hygiene" ? "🧴"
                      : category === "First Aid" ? "🩹"
                      : category === "Nutrition" ? "🍬"
                      : "😷";
                    return (
                      <div 
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setScreen('products');
                        }}
                        className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer text-left ${
                          index !== CATEGORIES.length - 1 ? 'border-b border-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{emoji}</span>
                          <span className="font-bold text-[15px] text-[#111827]">{category}</span>
                        </div>
                        <span className="text-[10px] bg-[#F0FDF4] text-[#16A34A] px-2.5 py-0.5 rounded-full font-bold uppercase">
                          {count} {count === 1 ? (lang === 'en' ? 'item' : 'आइटम') : (lang === 'en' ? 'items' : 'आइटम्स')}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => setScreen('products')}
                  className="mt-4 flex items-center justify-between w-full bg-[#F0FDF4] hover:bg-[#dcfce7] p-4 rounded-xl border border-[#BBF7D0] text-[#16A34A] font-bold active:scale-[0.97] transition-all"
                >
                  <span>{lang === 'en' ? 'View All Products' : 'सभी उत्पाद देखें'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>

              <div className="h-4" />
            </motion.div>
          )}

          {/* SCREEN 2: PRODUCTS */}
          {screen === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Category Scrollable Header */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-5 px-5">
                {CATEGORIES.map(category => {
                  const isActive = category === selectedCategory;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 px-4 py-2.5 rounded-full font-sans text-xs font-bold transition-all active:scale-95 ${
                        isActive 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-slate-100 text-on-surface-variant hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Catalog Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <span className="text-4xl text-slate-300">📦</span>
                  <p className="text-sm text-slate-500 font-semibold">No products found matching your search.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory("Women's Health"); }}
                    className="mt-2 text-xs font-bold text-primary underline"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map(product => {
                    const cartItem = cart.find(item => item.product.id === product.id);
                    const qty = cartItem ? cartItem.quantity : 0;
                    
                    return (
                      <div 
                        key={product.id} 
                        className="bg-white border border-outline-variant/35 rounded-2xl p-3 flex flex-col shadow-sm transition-all hover:shadow-md h-full"
                      >
                        {/* Emoji Container with product specific style */}
                        <div className={`w-full aspect-square rounded-xl mb-3 flex items-center justify-center text-4xl border ${getProductBg(product.type)}`}>
                          <span className="drop-shadow-sm select-none">{product.imageEmoji}</span>
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-sans font-bold text-sm text-on-surface line-clamp-2 leading-tight mb-1">
                              {product.name}
                            </h3>
                            <p className="font-sans font-extrabold text-base text-primary">₹{product.price}</p>
                          </div>

                          {/* Action Button / Quantity Selector */}
                          <div className="mt-3">
                            {qty > 0 ? (
                              <div className="flex items-center justify-between bg-primary/10 rounded-full border border-primary/20 p-0.5">
                                <button 
                                  onClick={() => updateQuantity(product.id, -1)}
                                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary font-bold active:scale-90 transition-transform shadow-sm"
                                >
                                  <Minus size={14} className="stroke-[3]" />
                                </button>
                                <span className="font-sans font-extrabold text-sm text-on-surface min-w-[20px] text-center">
                                  {qty}
                                </span>
                                <button 
                                  onClick={() => addToCart(product)}
                                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary font-bold active:scale-90 transition-transform shadow-sm"
                                >
                                  <Plus size={14} className="stroke-[3]" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addToCart(product)}
                                className="w-full h-9 bg-primary text-white rounded-full font-sans font-bold text-xs flex items-center justify-center gap-1 hover:bg-primary-hover active:scale-95 transition-transform"
                              >
                                <Plus size={14} className="stroke-[3]" />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN 3: CART */}
          {screen === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h2 className="font-sans font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Items In Cart ({getCartCount()})
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl soft-shadow border border-slate-100 flex flex-col items-center gap-4">
                  <span className="text-5xl">🛒</span>
                  <p className="text-base text-slate-500 font-bold">Your cart is currently empty.</p>
                  <button 
                    onClick={() => setScreen('products')}
                    className="px-6 py-2.5 bg-primary text-white rounded-full font-sans font-bold text-sm shadow-md hover:bg-primary-hover active:scale-95 transition-all"
                  >
                    Go Back to Shop
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="flex flex-col gap-3">
                    {cart.map(item => (
                      <div 
                        key={item.product.id}
                        className="bg-white border border-outline-variant/20 rounded-xl p-3 shadow-sm flex items-center gap-3 relative overflow-hidden"
                      >
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-2xl border ${getProductBg(item.product.type)}`}>
                          <span>{item.product.imageEmoji}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans font-bold text-sm text-on-surface truncate">
                            {item.product.name}
                          </h3>
                          <p className="font-sans text-xs text-on-surface-variant mt-0.5">₹{item.product.price} each</p>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-7 h-7 rounded-full bg-slate-100 text-on-surface flex items-center justify-center active:scale-90 transition-transform"
                            >
                              <Minus size={12} className="stroke-[3]" />
                            </button>
                            <span className="font-sans font-bold text-xs text-on-surface min-w-[16px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => addToCart(item.product)}
                              className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center active:scale-90 transition-transform"
                            >
                              <Plus size={12} className="stroke-[3]" />
                            </button>
                          </div>
                          <span className="font-sans font-bold text-sm text-primary">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>

                        {/* Trash Delete */}
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-rose-500 hover:text-rose-600 active:scale-90 transition-transform shrink-0 ml-1 bg-rose-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Clear Cart Buttons */}
                  <div className="flex justify-end">
                    <button 
                      onClick={clearCart}
                      className="font-sans text-xs font-bold text-error active:opacity-75 hover:opacity-90 px-2 py-1"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white border border-outline-variant/20 rounded-[20px] p-5 shadow-sm">
                    <h2 className="font-sans font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-variant">Subtotal</span>
                        <span className="font-bold text-on-surface">₹{getCartTotal()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-variant">Convenience Fee</span>
                        <span className="font-bold text-primary">₹0</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-variant">Privacy Protection</span>
                        <span className="font-bold text-primary flex items-center gap-1">
                          <Check size={14} className="stroke-[3]" /> Included
                        </span>
                      </div>
                    </div>
                    <div className="h-px bg-slate-100 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-bold text-base text-on-surface">Total Amount</span>
                      <span className="font-sans font-extrabold text-xl text-primary">₹{getCartTotal()}</span>
                    </div>
                  </div>

                  {/* Privacy Strip */}
                  <div className="bg-secondary-container/40 border border-secondary-container rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-2xl shrink-0">🎉</span>
                    <span className="font-sans font-bold text-xs text-primary leading-tight">
                      Anonymous delivery. No receipt. No record on credit card statement.
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* SCREEN 4: PAYMENT */}
          {screen === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Order Items list */}
              <section className="bg-white border border-outline-variant/20 rounded-[20px] p-5 shadow-sm">
                <h2 className="font-sans font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-3.5">
                  Order Summary
                </h2>
                <div className="flex flex-col gap-2.5">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                      <span className="text-on-surface">{item.product.name}</span>
                      <span className="text-on-surface-variant text-xs">{item.quantity} x ₹{item.product.price}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-slate-100 my-4 w-full"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-on-surface">Total</span>
                  <span className="text-xl font-extrabold text-[#16A34A]">₹{getCartTotal()}</span>
                </div>
              </section>

              {/* Privacy Banner */}
              <section className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[16px] p-4 flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <p className="text-xs text-[#16A34A] font-bold leading-tight">
                  100% Anonymous Transaction. No personal data stored.
                </p>
              </section>

              {/* Payment Processing Card */}
              <section className="bg-white border border-outline-variant/20 rounded-[24px] p-6 shadow-md text-center relative overflow-hidden">
                {!paymentProcessing ? (
                  <form onSubmit={handleSimulatePayment} className="flex flex-col gap-4">
                    <h3 className="font-sans font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                      Scan &amp; Pay
                    </h3>

                    {/* QR Code SVG */}
                    <div className="inline-block border border-slate-100 rounded-2xl p-3 bg-white mx-auto shadow-sm">
                      <svg className="mx-auto block" height="180" viewBox="0 0 180 180" width="180">
                        <rect fill="white" height="180" width="180"></rect>
                        {/* Top Left Finder */}
                        <rect fill="black" height="40" width="40" x="10" y="10"></rect>
                        <rect fill="white" height="30" width="30" x="15" y="15"></rect>
                        <rect fill="black" height="20" width="20" x="20" y="20"></rect>
                        {/* Top Right Finder */}
                        <rect fill="black" height="40" width="40" x="130" y="10"></rect>
                        <rect fill="white" height="30" width="30" x="135" y="15"></rect>
                        <rect fill="black" height="20" width="20" x="140" y="20"></rect>
                        {/* Bottom Left Finder */}
                        <rect fill="black" height="40" width="40" x="10" y="130"></rect>
                        <rect fill="white" height="30" width="30" x="15" y="135"></rect>
                        <rect fill="black" height="20" width="20" x="20" y="140"></rect>
                        {/* Random blocks pattern to look like a barcode */}
                        <g fill="black">
                          <rect height="10" width="10" x="60" y="10"></rect>
                          <rect height="10" width="20" x="80" y="10"></rect>
                          <rect height="10" width="10" x="110" y="10"></rect>
                          <rect height="10" width="30" x="60" y="30"></rect>
                          <rect height="10" width="20" x="100" y="30"></rect>
                          <rect height="10" width="20" x="10" y="60"></rect>
                          <rect height="10" width="10" x="40" y="60"></rect>
                          <rect height="10" width="40" x="60" y="60"></rect>
                          <rect height="10" width="10" x="110" y="60"></rect>
                          <rect height="10" width="30" x="140" y="60"></rect>
                          <rect height="10" width="30" x="20" y="80"></rect>
                          <rect height="10" width="10" x="70" y="80"></rect>
                          <rect height="10" width="40" x="90" y="80"></rect>
                          <rect height="10" width="20" x="150" y="80"></rect>
                          <rect height="10" width="10" x="10" y="100"></rect>
                          <rect height="10" width="20" x="40" y="100"></rect>
                          <rect height="10" width="30" x="80" y="100"></rect>
                          <rect height="10" width="10" x="130" y="100"></rect>
                          <rect height="10" width="10" x="160" y="100"></rect>
                          <rect height="10" width="20" x="60" y="130"></rect>
                          <rect height="10" width="40" x="100" y="130"></rect>
                          <rect height="10" width="20" x="150" y="130"></rect>
                          <rect height="10" width="10" x="60" y="150"></rect>
                          <rect height="10" width="30" x="80" y="150"></rect>
                          <rect height="10" width="20" x="120" y="150"></rect>
                          <rect height="10" width="10" x="160" y="150"></rect>
                        </g>
                      </svg>
                    </div>

                    <p className="font-sans text-[11px] text-on-surface-variant tracking-wide">
                      Scan with GPay · PhonePe · Paytm · BHIM
                    </p>

                    {/* App Selection Chips */}
                    <div className="flex justify-center gap-2 flex-wrap">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => {
                        const isSelected = selectedUpiApp === app;
                        return (
                          <button
                            type="button"
                            key={app}
                            onClick={() => {
                              setSelectedUpiApp(app);
                              setUpiId(prev => prev || `anonymous@${app.toLowerCase()}`);
                            }}
                            className={`px-3 py-1.5 border text-xs font-bold rounded-xl transition-all ${
                              isSelected 
                                ? 'bg-primary text-white border-primary shadow-sm' 
                                : 'bg-slate-50 border-slate-200 text-on-surface hover:bg-slate-100'
                            }`}
                          >
                            {app}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-xs text-on-surface-variant my-1">— or pay with UPI ID —</div>

                    {/* UPI input */}
                    <input 
                      type="text"
                      required
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-sans text-sm focus:border-primary focus:outline-none transition-all"
                    />

                    {/* Pay Button */}
                    <button 
                      type="submit"
                      className="w-full bg-[#16A34A] text-white rounded-2xl py-4 text-base font-bold shadow-md hover:bg-[#15803d] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Pay ₹{getCartTotal()}
                    </button>
                  </form>
                ) : (
                  /* Loading and Success States */
                  <div className="flex flex-col items-center justify-center py-8">
                    {!paymentFinished ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
                        <h4 className="text-base font-bold text-on-surface">Processing Transaction...</h4>
                        <p className="text-xs text-on-surface-variant">Communicating with bank server securely.</p>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        {/* Animated success checkmark */}
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                          <Check size={36} className="stroke-[3.5]" />
                        </div>
                        <h4 className="font-sans font-extrabold text-xl text-on-surface mb-2">
                          Payment Successful! 🎉
                        </h4>
                        <p className="font-sans text-sm text-on-surface-variant mb-4">
                          Dispensing your items in the private tray...
                        </p>
                        <div className="px-4 py-2 bg-emerald-50 rounded-full text-emerald-800 text-xs font-bold">
                          Returning to home in {countdown}s...
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </section>

              {/* Help & Helpline */}
              <div className="mt-4 text-center flex flex-col gap-1.5">
                <p className="font-sans text-xs text-on-surface-variant">
                  Need help? 1800-111-2222
                </p>
                <p className="font-sans text-xs font-bold text-rose-600 animate-pulse">
                  Women's Safety Helpline: 1091
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* STICKY BOTTOM ACTIONS ROW */}
      {((screen === 'products' && getCartCount() > 0) || 
        (screen === 'cart' && cart.length > 0) || 
        (screen === 'payment' && !paymentProcessing)) && (
        <div className={`fixed ${screen === 'payment' ? 'bottom-0' : 'bottom-16'} left-0 right-0 w-full z-40 bg-white/80 backdrop-blur-md border-t border-outline-variant/10 px-5 py-4 pb-safe flex justify-center shadow-lg rounded-t-3xl max-w-[430px] mx-auto`}>
          <div className="w-full flex flex-col gap-2">

            {/* Catalog Bottom Action: Checkout Summary Pill */}
            {screen === 'products' && getCartCount() > 0 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex items-center text-on-surface-variant text-xs gap-1 font-bold">
                    <ShoppingBag size={13} className="text-primary" />
                    {getCartCount()} items
                  </div>
                  <div className="font-sans font-extrabold text-lg text-on-surface">
                    Total: ₹{getCartTotal()}
                  </div>
                </div>
                <button 
                  onClick={() => setScreen('cart')}
                  className="bg-primary text-white px-6 py-3 rounded-2xl font-sans font-bold text-sm flex items-center gap-2 active-shadow hover:bg-primary-hover active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  Proceed to Pay
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Cart Bottom Action: Proceed to Payment */}
            {screen === 'cart' && cart.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setUpiId('anonymous@gpay');
                    setScreen('payment');
                  }}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-sans font-bold text-base shadow-lg active-shadow hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Payment
                  <ChevronRight size={18} />
                </button>
                <div className="flex items-center justify-center gap-1 text-[11px] text-on-surface-variant font-medium">
                  <Lock size={12} className="text-primary" />
                  Secure &amp; Anonymous Payment
                </div>
              </div>
            )}

            {/* Payment Screen: back to home */}
            {screen === 'payment' && !paymentProcessing && (
              <button 
                onClick={() => setScreen('cart')}
                className="w-full h-12 rounded-2xl bg-slate-100 text-on-surface font-sans font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200"
              >
                Back to Cart
              </button>
            )}

          </div>
        </div>
      )}

      {/* FOOTER TAB NAV BAR SHELL FOR DEEP SIMULATION */}
      {screen !== 'payment' && (
        <nav className="absolute bottom-0 left-0 right-0 h-[64px] bg-white z-30 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center">
          {/* Home */}
          <button 
            onClick={() => { setScreen('landing'); setAboutOpen(false); }}
            className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
          >
            {screen === 'landing' && <div className="absolute top-0 w-6 h-[3px] bg-[#16A34A] rounded-b-full"></div>}
            <span className={`material-symbols-outlined text-[24px] mb-0.5 ${screen === 'landing' ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>home</span>
            <span className={`text-[10px] font-bold ${screen === 'landing' ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
              {lang === 'en' ? 'Home' : 'होम'}
            </span>
          </button>

          {/* Products */}
          <button 
            onClick={() => { setScreen('products'); setAboutOpen(false); }}
            className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
          >
            {screen === 'products' && <div className="absolute top-0 w-6 h-[3px] bg-[#16A34A] rounded-b-full"></div>}
            <span className={`material-symbols-outlined text-[24px] mb-0.5 ${screen === 'products' ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>grid_view</span>
            <span className={`text-[10px] font-bold ${screen === 'products' ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
              {lang === 'en' ? 'Products' : 'उत्पाद'}
            </span>
          </button>

          {/* Cart */}
          <button 
            onClick={() => { setScreen('cart'); setAboutOpen(false); }}
            className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
          >
            {screen === 'cart' && <div className="absolute top-0 w-6 h-[3px] bg-[#16A34A] rounded-b-full"></div>}
            <div className="relative mb-0.5">
              <span className={`material-symbols-outlined text-[24px] ${screen === 'cart' ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>shopping_cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white">
                  {getCartCount()}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold ${screen === 'cart' ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
              {lang === 'en' ? 'Cart' : 'कार्ट'}
            </span>
          </button>

          {/* Pay */}
          <button 
            onClick={() => {
              if (cart.length > 0) {
                setUpiId('anonymous@gpay');
                setScreen('payment');
              } else {
                setSelectedCategory("Women's Health");
                setScreen('products');
              }
              setAboutOpen(false);
            }}
            className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#9CA3AF] text-[24px] mb-0.5 hover:text-[#6B7280]">qr_code_scanner</span>
            <span className="text-[10px] font-bold text-[#9CA3AF]">
              {lang === 'en' ? 'Pay' : 'भुगतान'}
            </span>
          </button>

          {/* About */}
          <button 
            onClick={() => setAboutOpen(true)}
            className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
          >
            {aboutOpen && <div className="absolute top-0 w-6 h-[3px] bg-[#16A34A] rounded-b-full"></div>}
            <span className={`material-symbols-outlined text-[24px] mb-0.5 ${aboutOpen ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>info</span>
            <span className={`text-[10px] font-bold ${aboutOpen ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`}>
              {lang === 'en' ? 'About' : 'विवरण'}
            </span>
          </button>
        </nav>
      )}



      {/* GUIDE MODAL */}
      <AnimatePresence>
        {guideOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 w-full max-w-[380px] shadow-2xl border border-outline-variant/30 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h3 className="font-sans font-bold text-lg text-primary">Kiosk Guide</h3>
                </div>
                <button 
                  onClick={() => setGuideOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm text-on-surface-variant flex flex-col gap-3">
                <p>Welcome to <strong>PrivaCare Smart Kiosk</strong>! Follow these steps to purchase products anonymously:</p>
                <ol className="list-decimal pl-5 space-y-1.5 text-left">
                  <li>Tap <strong>Start Shopping</strong> to browse our catalog.</li>
                  <li>Add your desired products to your cart.</li>
                  <li>Verify your cart items and proceed to payment.</li>
                  <li>Scan the QR code and pay using any UPI application (GPay, Paytm, etc.).</li>
                  <li>Your products will dispense immediately from the physical tray below.</li>
                </ol>
                <p className="text-xs text-primary font-semibold mt-1 text-left">🔒 Your privacy is 100% guaranteed. No logs or card records are stored.</p>
              </div>
              <button 
                onClick={() => setGuideOpen(false)}
                className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-hover active:scale-[0.98] transition-all"
              >
                Got it, thanks!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ABOUT MODAL (BOTTOM SHEET) */}
      <AnimatePresence>
        {aboutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[999] flex flex-col justify-end"
          >
            {/* Backdrop click listener */}
            <div className="absolute inset-0" onClick={() => setAboutOpen(false)} />
            
            {/* Sheet Content */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white w-full rounded-t-3xl shadow-2xl relative z-10 p-6 pb-8 border-t border-gray-100 flex flex-col gap-5 text-left"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center cursor-pointer" onClick={() => setAboutOpen(false)}>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#111827]">
                  {lang === 'en' ? 'About PrivaCare' : 'प्रिवाकेयर के बारे में'}
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                  <span className="material-symbols-outlined text-[#16A34A] text-2xl mt-0.5">shield_lock</span>
                  <div className="text-left font-sans">
                    <h4 className="font-bold text-sm text-[#111827]">
                      {lang === 'en' ? '100% Confidential' : '100% गोपनीय'}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      {lang === 'en' 
                        ? 'We never share your purchase history or identity details.' 
                        : 'हम कभी भी आपकी खरीद का इतिहास या पहचान विवरण साझा नहीं करते हैं।'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                  <span className="material-symbols-outlined text-[#16A34A] text-2xl mt-0.5">verified</span>
                  <div className="text-left font-sans">
                    <h4 className="font-bold text-sm text-[#111827]">
                      {lang === 'en' ? 'Genuine Products' : 'असली उत्पाद'}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      {lang === 'en' 
                        ? 'All items are sourced directly from authorized medical distributors.' 
                        : 'सभी वस्तुएं सीधे अधिकृत चिकित्सा वितरकों से प्राप्त की जाती हैं।'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                  <span className="material-symbols-outlined text-[#16A34A] text-2xl mt-0.5">support_agent</span>
                  <div className="text-left font-sans">
                    <h4 className="font-bold text-sm text-[#111827]">
                      {lang === 'en' ? '24/7 Support' : '24/7 सहायता'}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      {lang === 'en' 
                        ? 'Need help? Email us at support@privacare.in' 
                        : 'सहायता चाहिए? हमें support@privacare.in पर ईमेल करें।'}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setAboutOpen(false)}
                className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-[#4B5563] font-bold py-3 rounded-xl active:scale-[0.97] transition-all cursor-pointer text-center text-sm font-sans"
              >
                {lang === 'en' ? 'Close' : 'बंद करें'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
