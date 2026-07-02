import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
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
  User,
  BadgeAlert,
  Smartphone,
  CreditCard,
  Home,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { PRODUCTS, CATEGORIES } from './data';
import { Product, CartItem, ScreenType } from './types';
import logoImg from './assets/creator_lab_logo.jpg';
import { LoginScreen } from './LoginScreen';


const Logo: React.FC<{ className?: string }> = ({ className }) => {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState("/creator_lab_logo.jpg");

  if (error) {
    return (
      <div 
        className={`bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-sans font-black select-none ${className}`}
        style={{ fontSize: 'min(12px, 1.25rem)', lineHeight: 1 }}
      >
        CL
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt="Creator Lab"
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc === "/creator_lab_logo.jpg") {
          setImgSrc(logoImg);
        } else {
          setError(true);
        }
      }}
      className={`${className} object-cover`}
    />
  );
};

const TRANSLATIONS = {
  en: {
    tagline: 'Your Private Health Store',
    description: 'Buy health products anytime, privately, without talking to anyone.',
    private: 'Private',
    instant: 'Instant',
    alwaysOpenBadge: '24×7',
    startShopping: 'Start Shopping',
    browseEssentials: 'Browse 20+ health essentials',
    howItWorks: 'HOW IT WORKS',
    chooseProducts: 'Choose Products',
    browseMenu: 'Browse menu and tap what you need.',
    payWithUpi: 'Pay with UPI',
    scanQrCode: 'Scan the QR code with any UPI app.',
    collectItems: 'Collect Your Items',
    machineGives: 'The machine gives your items instantly.',
    whyTrust: 'WHY TRUST THIS KIOSK',
    fullyPrivate: 'Fully Private',
    alwaysOpen: 'Always Open',
    easyPayment: 'Easy Payment',
    superFast: 'Super Fast',
    madeWithCare: 'MADE WITH CARE',
    byTeam: 'By Team CREATO4',
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    pay: 'Pay',
    account: 'Account',
    howToUse: 'How to Use Kiosk',
    getProductsSteps: 'Get your health products in 3 simple steps:',
    selectProducts: 'Select Products',
    browseCategories: 'Browse through hygiene & medical categories and add what you need to your cart.',
    scanPayUpi: 'Scan & Pay via UPI',
    clickProceed: 'Click "Proceed to Pay" and scan the QR code with GPay, PhonePe, Paytm, or BHIM.',
    collectInstantly: 'Collect Instantly',
    itemsDispense: 'Your items will immediately dispense into the delivery tray at the bottom.',
    confidential: '100% Confidential & Secure',
    close: 'Close'
  },
  hi: {
    tagline: 'आपका निजी स्वास्थ्य स्टोर',
    description: 'किसी से बात किए बिना, निजी तौर पर, कभी भी स्वास्थ्य उत्पाद खरीदें।',
    private: 'निजी',
    instant: 'तुरंत',
    alwaysOpenBadge: '२४×७',
    startShopping: 'खरीदारी शुरू करें',
    browseEssentials: '२०+ आवश्यक उत्पाद देखें',
    howItWorks: 'यह कैसे काम करता है',
    chooseProducts: 'उत्पाद चुनें',
    browseMenu: 'मेन्यू ब्राउज़ करें और अपनी ज़रूरत की चीज़ों पर टैप करें।',
    payWithUpi: 'UPI से भुगतान',
    scanQrCode: 'किसी भी UPI ऐप से QR कोड स्कैन करें।',
    collectItems: 'सामान प्राप्त करें',
    machineGives: 'मशीन आपको तुरंत सामान प्रदान करती है।',
    whyTrust: 'इस कियोस्क पर भरोसा क्यों करें',
    fullyPrivate: 'पूर्ण गोपनीय',
    alwaysOpen: 'हमेशा खुला',
    easyPayment: 'आसान भुगतान',
    superFast: 'अत्यधिक तेज़',
    madeWithCare: 'देखभाल के साथ बनाया गया',
    byTeam: 'टीम CREATO4 द्वारा',
    home: 'होम',
    products: 'उत्पाद',
    cart: 'कार्ट',
    pay: 'भुगतान',
    account: 'खाता',
    howToUse: 'कियोस्क का उपयोग कैसे करें',
    getProductsSteps: 'अपने स्वास्थ्य उत्पादों को 3 आसान चरणों में प्राप्त करें:',
    selectProducts: 'उत्पाद चुनें',
    browseCategories: 'हाइजीन और मेडिकल श्रेणियों को देखें और अपनी जरूरत के सामान को कार्ट में जोड़ें।',
    scanPayUpi: 'स्कैन और यूपीआई भुगतान',
    clickProceed: '"Proceed to Pay" पर क्लिक करें और GPay, PhonePe, Paytm या BHIM से QR कोड स्कैन करें।',
    collectInstantly: 'तुरंत सामान प्राप्त करें',
    itemsDispense: 'आपका सामान मशीन के सबसे निचले हिस्से में स्थित डिलीवरी ट्रे में तुरंत आ जाएगा।',
    confidential: '100% गोपनीय और सुरक्षित',
    close: 'बंद करें'
  },
  gu: {
    tagline: 'તમારો ખાનગી સ્વાસ્થ્ય સ્ટોર',
    description: 'કોઈપણ સાથે વાત કર્યા વિના, ખાનગી રીતે, ગમે ત્યારે આરોગ્ય ઉત્પાદનો ખરીદો.',
    private: 'ખાનગી',
    instant: 'ત્વરિત',
    alwaysOpenBadge: '૨૪×૭',
    startShopping: 'ખરીદી શરૂ કરો',
    browseEssentials: '૨૦+ આરોગ્યની આવશ્યક ચીજો જુઓ',
    howItWorks: 'તે કેવી રીતે કાર્ય કરે છે',
    chooseProducts: 'ઉત્પાદનો પસંદ કરો',
    browseMenu: 'મેનૂ બ્રાઉઝ કરો અને તમને જે જોઈએ તે પર ટેપ કરો.',
    payWithUpi: 'UPI વડે ચૂકવણી કરો',
    scanQrCode: 'કોઈપણ UPI એપ વડે QR કોડ સ્કેન કરો.',
    collectItems: 'તમારી વસ્તુઓ મેળવો',
    machineGives: 'મશીન તમને તમારી વસ્તુઓ તરત જ આપશે.',
    whyTrust: 'આ કિઓસ્ક પર શા માટે વિશ્વાસ કરવો',
    fullyPrivate: 'સંપૂર્ણ ખાનગી',
    alwaysOpen: 'હંમેશા ખુલ્લું',
    easyPayment: 'સરળ ચુકવણી',
    superFast: 'અતિ ઝડપી',
    madeWithCare: 'કાળજીપૂર્વક બનાવેલ',
    byTeam: 'ટીમ CREATO4 દ્વારા',
    home: 'હોમ',
    products: 'ઉત્પાદનો',
    cart: 'કાર્ટ',
    pay: 'ચૂકવો',
    account: 'ખાતું',
    howToUse: 'કિઓસ્કનો ઉપયોગ કેવી રીતે કરવો',
    getProductsSteps: 'તમારા આરોગ્ય ઉત્પાદનો 3 સરળ પગલાંમાં મેળવો:',
    selectProducts: 'ઉત્પાદનો પસંદ કરો',
    browseCategories: 'હાઇજીન અને મેડિકલ કેટેગરીઝ બ્રાઉઝ કરો અને તમને જોઈતી વસ્તુઓ તમારા કાર્ટમાં ઉમેરો.',
    scanPayUpi: 'સ્કેન અને UPI દ્વારા ચુકવણી',
    clickProceed: '"Proceed to Pay" પર ક્લિક કરો અને GPay, PhonePe, Paytm અથવા BHIM વડે QR કોડ સ્કેન કરો.',
    collectInstantly: 'તરત જ મેળવો',
    itemsDispense: 'તમારી વસ્તુઓ તરત જ નીચે ડિલિવરી ટ્રેમાં વિતરિત થઈ જશે.',
    confidential: '100% ગોપનીય અને સુરક્ષિત',
    close: 'બંધ કરો'
  }
};

export default function App() {
  // Navigation & Cart States
  const [screen, setScreen] = useState<ScreenType>('login');
  const [lang, setLangState] = useState<'en' | 'hi' | 'gu'>(() => {
    return (localStorage.getItem('lang') as 'en' | 'hi' | 'gu') || 'en';
  });

  const setLang = (newLang: 'en' | 'hi' | 'gu') => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };
  
  const t = (key: keyof typeof TRANSLATIONS.en) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
  };
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);

  const formatProductName = (name: string) => {
    if (!privacyMode) return name;
    return name.split(' ').map(word => {
      if (word.length <= 4) return word[0] + '*'.repeat(word.length - 1);
      return word.slice(0, 2) + '*'.repeat(word.length - 4) + word.slice(-2);
    }).join(' ');
  };
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("Women's Health");
  const isScrollingRef = useRef<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  

  // Payment States
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('GPay');
  const [upiId, setUpiId] = useState<string>('');
  const [paymentProcessing, setPaymentSuccess] = useState<boolean>(false);
  const [paymentFinished, setPaymentFinished] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);
  const [pickupCode, setPickupCode] = useState<string>('');

  // Real-time Session Account States
  const [sessionTransactions, setSessionTransactions] = useState<Array<{
    id: string;
    itemsCount: number;
    total: number;
    date: string;
  }>>([]);

  const [carePoints, setCarePoints] = useState<number>(100); // starts with Welcome Bonus
  const [pointsHistory, setPointsHistory] = useState<Array<{
    name: string;
    date: string;
    points: number;
  }>>([
    { name: 'Welcome Bonus', date: '01 Jul 2026', points: 100 }
  ]);

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
      setCountdown(10);
      setUpiId('');
      setPickupCode('');
    }
    return () => clearTimeout(timer);
  }, [paymentFinished, countdown]);

  // Effect to record transaction and rewards points in real-time
  useEffect(() => {
    if (paymentFinished) {
      const cartTotal = getCartTotal();
      const cartCount = getCartCount();
      if (cartTotal > 0 && cartCount > 0) {
        // Generate real-time transaction ID (e.g. TX-9874)
        const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
        const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        // Record transaction
        setSessionTransactions(prev => [
          { id: txId, itemsCount: cartCount, total: cartTotal, date: dateStr },
          ...prev
        ]);
        
        // Calculate and add rewards points
        const earnedPoints = Math.max(10, Math.round(cartTotal / 10));
        setCarePoints(prev => prev + earnedPoints);
        setPointsHistory(prev => [
          { name: 'Kiosk Purchase', date: dateStr, points: earnedPoints },
          ...prev
        ]);
      }
    }
  }, [paymentFinished]);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPickupCode(code);
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

  // Group products by category, filtering each product by searchQuery
  const groupedProducts = CATEGORIES.map(category => {
    const productsInCategory = PRODUCTS.filter(product => {
      const matchesCategory = product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    return {
      category,
      products: productsInCategory
    };
  }).filter(group => group.products.length > 0);

  const totalMatchingProducts = groupedProducts.reduce((sum, group) => sum + group.products.length, 0);

  const scrollToCategory = (category: string) => {
    setSelectedCategory(category);
    isScrollingRef.current = true;
    
    const container = document.getElementById('products-scroll-container');
    const target = document.getElementById(`section-${category.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (container && target) {
      const topPos = target.offsetTop - container.offsetTop;
      container.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 700);
    } else {
      isScrollingRef.current = false;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    const container = e.currentTarget;
    const containerRect = container.getBoundingClientRect();
    
    const scrollRange = container.scrollHeight - container.clientHeight;
    const scrollPercent = scrollRange > 0 ? Math.max(0, Math.min(1, container.scrollTop / scrollRange)) : 0;
    
    // targetY interpolates from container top (when at top) to container bottom (when at bottom)
    const targetY = containerRect.top + scrollPercent * containerRect.height;
    
    let closestCategory = selectedCategory;
    let minDistance = Infinity;
    
    CATEGORIES.forEach(category => {
      const targetId = `section-${category.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        let dist = 0;
        if (targetY < rect.top) {
          dist = rect.top - targetY;
        } else if (targetY > rect.bottom) {
          dist = targetY - rect.bottom;
        } else {
          dist = 0; // targetY is inside this section
        }
        
        if (dist < minDistance) {
          minDistance = dist;
          closestCategory = category;
        }
      }
    });
    
    if (closestCategory !== selectedCategory) {
      setSelectedCategory(closestCategory);
    }
  };

  // Automatically scroll horizontal categories bar when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      const btnId = `category-btn-${selectedCategory.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const btn = document.getElementById(btnId);
      const container = document.getElementById('categories-bar-container');
      if (btn && container) {
        const containerWidth = container.clientWidth;
        const btnLeft = btn.offsetLeft;
        const btnWidth = btn.clientWidth;
        // Scroll target to center the active category tab
        const targetScrollLeft = btnLeft - (containerWidth / 2) + (btnWidth / 2);
        
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedCategory]);

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

  if (screen === 'login') {
    return (
      <div className="w-full max-w-[430px] h-screen md:h-[92vh] md:max-h-[850px] bg-surface flex flex-col relative shadow-[0_0_30px_rgba(0,110,47,0.1)] md:rounded-3xl overflow-hidden mx-auto border border-[#bdcaba]/30 my-0 md:my-auto">
        <LoginScreen lang={lang} setLang={setLang} onLoginSuccess={() => setScreen('landing')} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[430px] h-screen md:h-[92vh] bg-surface flex flex-col relative shadow-[0_0_30px_rgba(0,110,47,0.1)] md:rounded-3xl overflow-hidden mx-auto border border-[#bdcaba]/30 my-0 md:my-auto pb-16">

      {/* HEADER BAR */}
      {screen === 'landing' ? (
        <header className="w-full pt-4 pb-4 px-4 sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#bdcaba]/30 flex items-center justify-between transition-all select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Logo 
                className="w-8 h-8 rounded-md border border-[#006e2f]/20 shadow-sm flex-shrink-0" 
              />
              <h1 className="font-sans font-extrabold text-xl tracking-tight text-[#006e2f] truncate">
                Smart Kiosk
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* English / Hindi / Gujarati Switcher */}
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
              <button 
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
                  lang === 'hi' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिं
              </button>
              <button 
                onClick={() => setLang('gu')}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
                  lang === 'gu' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ગુ
              </button>
            </div>
          </div>
        </header>
      ) : (
        <header className="w-full pt-4 pb-4 px-4 sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#bdcaba]/30 flex items-center justify-between transition-all select-none">
          <div className="flex items-center gap-3.5 min-w-0">
            <button 
              onClick={() => {
                if (screen === 'payment') setScreen('cart');
                else if (screen === 'cart') setScreen('products');
                else if (screen === 'products') setScreen('landing');
                else if (screen === 'account') setScreen('landing');
              }}
              className="text-[#006b2c] hover:opacity-80 transition-opacity active:scale-90 p-1.5 rounded-full hover:bg-secondary-container flex-shrink-0 cursor-pointer"
            >
              <ArrowLeft size={22} className="stroke-[2.5px]" />
            </button>
            
            <h1 className="font-sans font-black text-lg tracking-tight text-[#006e2f] truncate">
              {screen === 'products' && (lang === 'en' ? 'Products' : lang === 'hi' ? 'उत्पाद' : 'ઉત્પાદનો')}
              {screen === 'cart' && (lang === 'en' ? 'My Cart' : lang === 'hi' ? 'मेरी कार्ट' : 'મારું કાર્ટ')}
              {screen === 'payment' && (lang === 'en' ? 'Payment Checkout' : lang === 'hi' ? 'भुगतान चेकआउट' : 'ચુકવણી ચેકઆઉટ')}
              {screen === 'account' && (lang === 'en' ? 'My Account' : lang === 'hi' ? 'मेरा खाता' : 'મારું ખાતું')}
            </h1>
          </div>
          <div className="w-9 h-9" />
        </header>
      )}


      <main className={`flex-1 flex flex-col no-scrollbar min-h-0 ${
        screen === 'products' 
          ? 'p-0 overflow-hidden' 
          : 'p-5 overflow-y-auto'
      } ${
        screen === 'cart' && cart.length > 0
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
              <section className="bg-gradient-to-tr from-[#F0FDF4] via-[#DCFCE7] to-white px-4 pt-6 pb-6 text-center rounded-[24px] overflow-hidden relative border border-emerald-100/50 shadow-sm flex flex-col items-center">


                {/* Brand Logo Circle */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white mb-2 bg-white flex-shrink-0">
                  <Logo className="w-full h-full object-cover" />
                </div>

                <p className="font-bold text-[10px] tracking-[3px] text-[#16A34A] mb-2 uppercase">
                  SMART KIOSK
                </p>
                <h2 className="font-sans font-bold text-xl text-[#0F172A] mb-1.5 leading-tight">
                  {t('tagline')}
                </h2>
                <p className="font-sans text-xs text-[#6B7280] mb-4 max-w-[280px] mx-auto leading-relaxed">
                  {t('description')}
                </p>

                {/* Status Badges */}
                <div className="flex justify-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 bg-white text-[#16A34A] border border-[#BBF7D0]/60 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">lock</span> {t('private')}
                  </span>
                  <span className="px-2.5 py-1 bg-white text-[#16A34A] border border-[#BBF7D0]/60 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">bolt</span> {t('instant')}
                  </span>
                  <span className="px-2.5 py-1 bg-white text-[#16A34A] border border-[#BBF7D0]/60 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">spa</span> {t('alwaysOpenBadge')}
                  </span>
                </div>
              </section>

              {/* Get Started Card */}
              <button 
                onClick={() => setScreen('products')}
                className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white rounded-2xl p-4 shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all group flex items-center justify-between border-b-4 border-emerald-800"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow-inner">🛒</div>
                  <div className="text-left font-sans">
                    <p className="text-[16px] font-extrabold tracking-tight">{t('startShopping')}</p>
                    <p className="text-white/80 text-[11px] font-medium">{t('browseEssentials')}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </button>

              {/* How It Works Section */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-gray-100"></div>
                  <h3 className="text-[11px] font-bold tracking-[2px] text-[#6B7280] uppercase">
                    {t('howItWorks')}
                  </h3>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#FEF9C3] rounded-full flex-shrink-0 flex items-center justify-center text-xl">👆</div>
                    <div className="text-left">
                      <h4 className="font-sans text-[15px] font-bold text-[#111827] mb-0.5">
                        {t('chooseProducts')}
                      </h4>
                      <p className="font-sans text-xs text-[#6B7280]">
                        {t('browseMenu')}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#F0FDF4] rounded-full flex-shrink-0 flex items-center justify-center text-xl">💳</div>
                    <div className="text-left">
                      <h4 className="font-sans text-[15px] font-bold text-[#111827] mb-0.5">
                        {t('payWithUpi')}
                      </h4>
                      <p className="font-sans text-xs text-[#6B7280]">
                        {t('scanQrCode')}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#EFF6FF] rounded-full flex-shrink-0 flex items-center justify-center text-xl">📦</div>
                    <div className="text-left">
                      <h4 className="font-sans text-[15px] font-bold text-[#111827] mb-0.5">
                        {t('collectItems')}
                      </h4>
                      <p className="font-sans text-xs text-[#6B7280]">
                        {t('machineGives')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="text-[11px] font-bold tracking-[2px] text-[#6B7280] mb-5 uppercase text-center">
                  {t('whyTrust')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">lock</span>
                    <p className="font-bold text-[13px] text-[#111827]">{t('fullyPrivate')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">schedule</span>
                    <p className="font-bold text-[13px] text-[#111827]">{t('alwaysOpen')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">qr_code_2</span>
                    <p className="font-bold text-[13px] text-[#111827]">{t('easyPayment')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#16A34A] text-[28px] mb-2">bolt</span>
                    <p className="font-bold text-[13px] text-[#111827]">{t('superFast')}</p>
                  </div>
                </div>
              </div>

              {/* Made with care by Team CREATO4 Footer Bar */}
              <div className="w-full bg-[#e3eae0] border border-[#d2dbce] rounded-3xl p-3 flex items-center gap-3.5 select-none mt-1 shadow-[0_2px_8px_rgba(0,110,47,0.03)]">
                {/* Shield badge */}
                <div className="w-12 h-12 rounded-[18px] bg-[#d3ded0] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#2e6d53]">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                {/* Text lines */}
                <div className="flex flex-col text-left">
                  <h4 className="font-sans font-black text-[13px] tracking-wider text-[#1e2e1c] leading-tight uppercase">
                    {t('madeWithCare')}
                  </h4>
                  <p className="font-sans font-semibold text-[11px] text-[#556251] mt-0.5 leading-none">
                    {t('byTeam')}
                  </p>
                </div>
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
              className="flex-1 flex flex-col h-full min-h-0 overflow-hidden"
            >
              {/* Top Side: Horizontal Scrollable Category Bar */}
              <div 
                id="categories-bar-container"
                className="flex gap-2.5 overflow-x-auto no-scrollbar py-3 px-4 bg-[#f2f6f1] border-b border-[#d5ded3]/60 flex-shrink-0"
              >
                {CATEGORIES.map(category => {
                  const isActive = category === selectedCategory;
                  const emoji = category === "Women's Health" ? "🧘"
                    : category === "Pregnancy & Fertility" ? "👶"
                    : category === "Sexual Wellness" ? "💖"
                    : category === "Hygiene & Personal Care" ? "🧴"
                    : category === "First Aid & Emergency" ? "🩹"
                    : category === "Health & Nutrition" ? "🍬"
                    : "🪒";
                  
                  return (
                    <button
                      key={category}
                      id={`category-btn-${category.replace(/[^a-zA-Z0-9]/g, '-')}`}
                      onClick={() => scrollToCategory(category)}
                      className={`shrink-0 px-4 py-2 rounded-full font-sans text-xs font-extrabold tracking-wider transition-all duration-200 uppercase flex items-center gap-2 select-none active:scale-95 border ${
                        isActive 
                          ? 'bg-[#0a2614] text-white border-[#0a2614] shadow-sm shadow-emerald-950/15' 
                          : 'bg-white text-[#4c5b49] hover:bg-[#f8faf8] border-[#dae3d9]'
                      }`}
                    >
                      <span className="text-sm select-none leading-none">{emoji}</span>
                      <span className="whitespace-nowrap">{category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Side: Scrollable Products List Grouped by Category */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#f4f7f3]">
                {/* Vertical Scroll List */}
                <div 
                  id="products-scroll-container"
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-6 scroll-smooth pb-6"
                >
                  {totalMatchingProducts === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                      <span className="text-4xl text-slate-300">📦</span>
                      <p className="text-sm text-slate-500 font-semibold">No products found matching your search.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory("Women's Health"); }}
                        className="mt-2 text-xs font-bold text-[#006e2f] underline"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    groupedProducts.map(group => {
                      const groupEmoji = group.category === "Women's Health" ? "🧘"
                        : group.category === "Pregnancy & Fertility" ? "👶"
                        : group.category === "Sexual Wellness" ? "💖"
                        : group.category === "Hygiene & Personal Care" ? "🧴"
                        : group.category === "First Aid & Emergency" ? "🩹"
                        : group.category === "Health & Nutrition" ? "🍬"
                        : "🪒";

                      return (
                        <div 
                          key={group.category}
                          id={`section-${group.category.replace(/[^a-zA-Z0-9]/g, '-')}`}
                          className="flex flex-col gap-3 scroll-mt-2"
                        >
                          {/* Category Header exactly matching screenshot layout */}
                          <div className="flex items-center gap-2 py-2 border-b border-[#bdcaba]/35 mb-1">
                            <span className="text-sm select-none leading-none">{groupEmoji}</span>
                            <h2 className="font-sans font-black text-xs text-[#12240f] uppercase tracking-wider">
                              {group.category}
                            </h2>
                          </div>

                          {/* Products List inside this group */}
                          <div className="flex flex-col gap-2.5">
                            {group.products.map(product => {
                              const cartItem = cart.find(item => item.product.id === product.id);
                              const qty = cartItem ? cartItem.quantity : 0;
                              
                              return (
                                <div 
                                  key={product.id}
                                  className={`group border-2 rounded-2xl p-2.5 flex items-center justify-between gap-3 transition-all duration-200 select-none ${
                                    qty > 0 
                                      ? 'bg-[#ecf3ec] border-[#006e2f] shadow-[0_3px_10px_rgba(0,110,47,0.05)]' 
                                      : 'bg-white hover:bg-[#fcfdfc] border-[#e6ebe5] hover:border-[#cbd7ca] shadow-[0_1.5px_3px_rgba(0,0,0,0.015)]'
                                  }`}
                                >
                                  {/* Left: Rounded Square Image Box with image or emoji */}
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center select-none flex-shrink-0 transition-all border overflow-hidden ${
                                    qty > 0 
                                      ? 'bg-white border-[#b8c9b7] shadow-[0_2px_6px_rgba(0,110,47,0.03)]' 
                                      : 'bg-[#f4f7f3] border-[#e3ebe2] shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
                                  }`}>
                                    {product.imageUrl ? (
                                      <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <span className="text-2xl drop-shadow-sm select-none">{product.imageEmoji}</span>
                                    )}
                                  </div>

                                  {/* Center: Details */}
                                  <div className="flex-1 min-w-0 text-left flex flex-col justify-center pl-0.5">
                                    {/* ID Code */}
                                    <span className="font-mono text-[8px] font-extrabold tracking-wider text-[#4d5e4a]/75 uppercase leading-none">
                                      ID: {product.idCode}
                                    </span>
                                    {/* Product Name */}
                                    <h3 className="font-sans font-black text-[13.5px] text-[#12240f] leading-tight mt-0.5 line-clamp-1">
                                      {formatProductName(product.name)}
                                    </h3>
                                    {/* Description */}
                                    <p className="font-sans font-semibold text-[10.5px] text-[#5e6d5b] mt-0.5 leading-none line-clamp-1">
                                      {product.description}
                                    </p>
                                    
                                    {/* Price & Stock Badge Row */}
                                    <div className="flex items-center gap-1.5 mt-1.5 leading-none">
                                      {/* Price Pill */}
                                      <span className="bg-[#006e2f]/8 px-2 py-0.5 rounded-full font-black text-[11px] text-[#006e2f] shrink-0">
                                        ₹{product.price}
                                      </span>
                                      {/* Separator Pipe */}
                                      <span className="text-[#b4c5b3]/50 text-[9px] font-light">|</span>
                                      {/* Stock status badge */}
                                      {product.stockStatus === 'IN STOCK' ? (
                                        <span className="text-[7.5px] font-black uppercase text-[#0c6b2d] border border-emerald-200/50 px-1.5 py-0.5 rounded bg-emerald-50/40 tracking-wider shrink-0">
                                          In Stock
                                        </span>
                                      ) : (
                                        <span className="text-[7.5px] font-black uppercase text-[#b45309] border border-amber-200/50 px-1.5 py-0.5 rounded bg-amber-50/40 tracking-wider shrink-0">
                                          Low Stock
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Right: Round-Square Selection Checkbox replaced with an outstanding Quantity selector / Add Button */}
                                  <div className="flex-shrink-0 pr-0.5">
                                    {qty === 0 ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addToCart(product);
                                        }}
                                        className="px-4 py-1.5 rounded-full border border-[#006e2f] text-[#006e2f] bg-white hover:bg-[#006e2f] hover:text-white active:scale-95 transition-all duration-150 font-sans font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1 cursor-pointer min-w-[70px] h-7.5"
                                      >
                                        ADD
                                      </button>
                                    ) : (
                                      <div className="flex items-center gap-1 bg-[#006e2f] text-white p-0.5 rounded-full shadow-sm border border-[#006e2f] min-w-[76px] h-7.5 justify-between">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updateQuantity(product.id, -1);
                                          }}
                                          className="w-6.5 h-6.5 rounded-full hover:bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all font-bold text-xs cursor-pointer"
                                        >
                                          <Minus size={11} className="stroke-[3]" />
                                        </button>
                                        <span className="font-sans font-black text-xs text-white min-w-[14px] text-center select-none">
                                          {qty}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                          }}
                                          className="w-6.5 h-6.5 rounded-full hover:bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all font-bold text-xs cursor-pointer"
                                        >
                                          <Plus size={11} className="stroke-[3]" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: CART */}
          {screen === 'cart' && (() => {
            const hygieneItems = cart.filter(item => item.product.id !== 'tc3');
            const bagItem = cart.find(item => item.product.id === 'tc3');
            const bagQty = bagItem ? bagItem.quantity : 0;
            const hygieneCount = hygieneItems.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="font-sans font-bold text-xs text-[#5e6d5b] uppercase tracking-wider">
                    Items In Cart ({hygieneCount})
                  </h2>
                  {cart.length > 0 && (
                    <button 
                      onClick={clearCart}
                      className="text-[11px] font-extrabold text-red-600 hover:text-red-700 active:scale-95 transition-all flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100/70 px-3 py-1 rounded-full border border-red-100/60 shadow-sm"
                    >
                      <Trash2 size={11} className="stroke-[2.5]" />
                      Clear All
                    </button>
                  )}
                </div>

                {hygieneItems.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl soft-shadow border border-slate-100 flex flex-col items-center gap-4">
                    <span className="text-5xl">🛒</span>
                    <p className="text-base text-slate-500 font-bold">Your cart is currently empty.</p>
                    <button 
                      onClick={() => setScreen('products')}
                      className="px-6 py-2.5 bg-[#006e2f] text-white rounded-full font-sans font-bold text-sm shadow-md hover:bg-[#005222] active:scale-95 transition-all cursor-pointer"
                    >
                      Go Back to Shop
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div className="flex flex-col gap-3">
                      {hygieneItems.map(item => (
                        <div 
                          key={item.product.id}
                          className="bg-white border-2 border-[#e6ebe5] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-[0_1.5px_3px_rgba(0,0,0,0.015)]"
                        >
                          {/* Left: Rounded Image Box */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center select-none flex-shrink-0 border border-[#e3ebe2] shadow-[0_1px_2px_rgba(0,0,0,0.01)] overflow-hidden ${getProductBg(item.product.type)}`}>
                            {item.product.imageUrl ? (
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <span className="text-2xl drop-shadow-sm">{item.product.imageEmoji}</span>
                            )}
                          </div>

                          {/* Center details */}
                          <div className="flex-1 min-w-0 text-left pl-1">
                            <h3 className="font-sans font-black text-[14px] text-[#12240f] leading-snug truncate">
                              {formatProductName(item.product.name)}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-sans font-semibold text-[10.5px] text-[#5e6d5b]">
                                ₹{item.product.price} each
                              </span>
                              <span className="text-[#cbd7ca] text-[10px] font-light">|</span>
                              <span className="font-mono text-[9px] font-black bg-[#f4f7f3] border border-[#cbd7ca]/40 text-[#006e2f] px-2 py-0.5 rounded-full">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Right: Price & Delete Button */}
                          <div className="flex items-center gap-3 shrink-0 pl-2">
                            <span className="font-sans font-black text-[14px] text-[#006e2f] min-w-[50px] text-right">
                              ₹{item.product.price * item.quantity}
                            </span>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-[#b45309]/80 hover:text-rose-600 active:scale-90 transition-all p-2 bg-[#fbf5f1] hover:bg-rose-50 rounded-xl border border-[#e6ebe5] hover:border-rose-100 flex items-center justify-center cursor-pointer shadow-sm"
                              title="Remove item"
                            >
                              <Trash2 size={14} className="stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Discreet Bag Option Card */}
                    <div className={`border rounded-2xl p-4 transition-all duration-200 select-none flex items-center justify-between gap-3 ${
                      bagQty > 0
                        ? 'bg-[#ecf3ec]/60 border-[#cbd7ca] shadow-[0_3px_10px_rgba(0,110,47,0.02)]' 
                        : 'bg-white border-[#cbd7ca]/40 hover:border-[#cbd7ca]/80 shadow-sm'
                    }`}>
                      <div className="flex items-start gap-3.5 text-left">
                        <div className="w-11 h-11 rounded-xl bg-[#f4f7f3] border border-[#cbd7ca]/30 flex items-center justify-center shrink-0 overflow-hidden">
                          {PRODUCTS.find(p => p.id === 'tc3')?.imageUrl ? (
                            <img 
                              src={PRODUCTS.find(p => p.id === 'tc3')?.imageUrl} 
                              alt="Discreet Bag" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-xl">🛍️</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-sans font-black text-[13px] text-[#12240f]">
                            Need Extra Discreet Bags?
                          </h4>
                          <p className="font-sans font-semibold text-[10.5px] text-[#5e6d5b] mt-0.5 leading-tight">
                            Add opaque carry bags for privacy (₹5 each)
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls / Add Button */}
                      {bagQty === 0 ? (
                        <button
                          onClick={() => {
                            const bagProduct = PRODUCTS.find(p => p.id === 'tc3');
                            if (bagProduct) {
                              addToCart(bagProduct);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#f4f7f3] hover:bg-[#cbd7ca]/20 hover:border-[#cbd7ca] border border-[#cbd7ca]/60 text-[#006e2f] text-xs font-black transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
                        >
                          <Plus size={11} className="stroke-[3.5]" />
                          Add Bag
                        </button>
                      ) : (
                        <div className="flex items-center gap-2.5 bg-white text-[#12240f] p-0.5 rounded-full border border-[#cbd7ca]/80 shadow-sm shrink-0">
                          <button
                            onClick={() => updateQuantity('tc3', -1)}
                            className="w-6.5 h-6.5 rounded-full bg-[#f4f7f3] hover:bg-[#cbd7ca]/20 text-[#12240f] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                            aria-label="Decrease bag quantity"
                          >
                            <Minus size={11} className="stroke-[3]" />
                          </button>
                          <span className="font-sans font-black text-xs min-w-[14px] text-center select-none px-1">
                            {bagQty}
                          </span>
                          <button
                            onClick={() => {
                              const bagProduct = PRODUCTS.find(p => p.id === 'tc3');
                              if (bagProduct) {
                                addToCart(bagProduct);
                              }
                            }}
                            className="w-6.5 h-6.5 rounded-full bg-[#006e2f] hover:bg-[#005222] text-white flex items-center justify-center active:scale-90 transition-all shadow-sm cursor-pointer"
                            aria-label="Increase bag quantity"
                          >
                            <Plus size={11} className="stroke-[3]" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white border border-[#cbd7ca]/40 rounded-3xl p-5 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006e2f] text-[20px] font-bold">receipt_long</span>
                          <h2 className="font-sans font-black text-xs text-[#12240f] uppercase tracking-wider">
                            Payment Summary
                          </h2>
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <span className="text-[10px] text-[#5e6d5b] font-bold uppercase tracking-wider leading-none mb-1">Total Bill</span>
                          <span className="font-sans font-black text-2xl text-[#006e2f] leading-none">
                            ₹{getCartTotal()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Strip */}
                    <div className="bg-[#ecf3ec] border border-[#cbd7ca]/50 rounded-2xl p-4 flex items-start gap-3">
                      <span className="text-2xl shrink-0 mt-0.5">🛡️</span>
                      <div className="flex flex-col text-left">
                        <h4 className="font-sans font-black text-[13px] text-[#12240f]">
                          100% Secure &amp; Confined
                        </h4>
                        <p className="font-sans font-semibold text-[11px] text-[#5e6d5b] mt-0.5 leading-relaxed">
                          Anonymous dispensing directly to the secure kiosk tray. No printed names, no leftover paper slips, and a discreet, secure descriptor on your bank/UPI statement.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })()}

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
              {/* Payment Processing Card */}
              <section className="bg-white border border-[#cbd7ca]/40 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden">
                {!paymentProcessing ? (
                  <div className="flex flex-col gap-4.5">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-[#006e2f] text-[28px] font-bold">qr_code_scanner</span>
                      <h3 className="font-sans font-black text-xs text-[#12240f] uppercase tracking-wider">
                        Scan QR Code to Pay
                      </h3>
                      <p className="font-sans text-[11px] text-[#5e6d5b] font-medium leading-none">
                        All transaction data is fully anonymized
                      </p>
                    </div>

                    {/* QR Code SVG with scan corners */}
                    <div className="flex flex-col items-center gap-2">
                      <a 
                        href={`upi://pay?pa=rudrachauhan2475@gmail.com&pn=Discreet%20Kiosk&am=${getCartTotal()}&cu=INR&tn=Kiosk%20Purchase`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (window.innerWidth > 768) {
                            e.preventDefault();
                          }
                          setPaymentSuccess(true);
                          const code = Math.floor(100000 + Math.random() * 900000).toString();
                          setPickupCode(code);
                          setTimeout(() => {
                            setPaymentFinished(true);
                          }, 1800);
                        }}
                        className="relative block border border-[#cbd7ca]/30 rounded-2xl p-4 bg-white mx-auto shadow-[0_4px_15px_rgba(0,110,47,0.04)] select-none overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        title="Scan or tap to open in UPI application / Click to simulate pay"
                      >
                        {/* Decorative corners */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-3 border-l-3 border-[#006e2f] rounded-tl-md z-10"></div>
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-3 border-r-3 border-[#006e2f] rounded-tr-md z-10"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-3 border-l-3 border-[#006e2f] rounded-bl-md z-10"></div>
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-3 border-r-3 border-[#006e2f] rounded-br-md z-10"></div>
                        
                        {/* Laser Scanner Line Animation ("scnner pack") */}
                        <motion.div 
                          className="absolute left-2 right-2 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981,0_0_15px_#10b981] z-20"
                          animate={{ top: ['16px', '166px', '16px'] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                        />

                        {/* Real QR Code Component */}
                        <div className="relative z-0 p-1 bg-white rounded-lg">
                          <QRCodeSVG
                            value={`upi://pay?pa=rudrachauhan2475@gmail.com&pn=Discreet%20Kiosk&am=${getCartTotal()}&cu=INR&tn=Kiosk%20Purchase`}
                            size={140}
                            level="H"
                            includeMargin={false}
                          />
                        </div>
                      </a>
                      
                      {/* Interactive scanner feedback */}
                      <div className="flex flex-col items-center gap-1 mb-1">
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[11px] text-[#006e2f] font-black uppercase tracking-wider">Awaiting UPI Scan</span>
                        </div>
                        <p className="font-sans text-[10px] text-slate-400 font-semibold leading-normal mt-1 max-w-[240px]">
                          Click or tap the QR code to simulate payment completion
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Loading and Success States */
                  <div className="flex flex-col items-center justify-center py-6">
                    {!paymentFinished ? (
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="relative flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full border-4 border-[#e6ebe5] border-t-[#006e2f] animate-spin"></div>
                          <span className="material-symbols-outlined text-[#006e2f] absolute text-[24px] animate-pulse">lock</span>
                        </div>
                        <div>
                          <h4 className="font-sans font-black text-base text-[#12240f] uppercase tracking-wide">
                            Verifying Payment...
                          </h4>
                          <p className="font-sans text-xs text-[#5e6d5b] font-semibold mt-1">
                            Securing transaction with end-to-end encryption
                          </p>
                        </div>
                        <div className="px-3.5 py-1.5 bg-[#f4f7f3] rounded-full text-[#006e2f] text-[10px] font-black uppercase tracking-wider border border-[#cbd7ca]/30 mt-1">
                          Do not close this screen
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center text-center w-full"
                      >
                        {/* Animated success checkmark */}
                        <div className="w-18 h-18 bg-[#ecf3ec] border-2 border-[#cbd7ca] rounded-full flex items-center justify-center text-[#006e2f] mb-4 shadow-sm">
                          <Check size={32} className="stroke-[4]" />
                        </div>
                        <h4 className="font-sans font-black text-xl text-[#12240f] leading-tight">
                          Payment Successful! 🎉
                        </h4>
                        <p className="font-sans text-sm text-[#5e6d5b] font-semibold mt-1.5 max-w-[280px]">
                          Your items are now dispensing in the private tray below.
                        </p>
                        
                        {/* Pickup Code Display */}
                        {pickupCode && (
                          <div className="mt-4 p-4 bg-[#f0fdf4] border border-[#cbd7ca]/40 rounded-2xl flex flex-col items-center w-full max-w-[280px]">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#5e6d5b]">
                              Kiosk Collection Code
                            </span>
                            <span className="text-2xl font-black font-mono text-[#006e2f] mt-1 tracking-widest">
                              {pickupCode.slice(0, 3)} {pickupCode.slice(3)}
                            </span>
                          </div>
                        )}

                        <div className="mt-5.5 px-4.5 py-2 bg-[#006e2f] text-white rounded-2xl text-xs font-black tracking-wide uppercase shadow-sm">
                          Returning to Home in {countdown}s
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </section>

              {/* Privacy Banner */}
              <section className="bg-[#ecf3ec] border border-[#cbd7ca]/50 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">🔒</span>
                <p className="text-[11.5px] text-[#006e2f] font-semibold leading-normal text-left">
                  <strong>100% Anonymous Transaction.</strong> No personal information, phone numbers, or transaction logs are collected or saved.
                </p>
              </section>

              {/* Order Items list */}
              <section className="bg-white border border-[#cbd7ca]/40 rounded-3xl p-5 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-3.5 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-[#006e2f] text-[20px] font-bold">receipt_long</span>
                  <h2 className="font-sans font-black text-xs text-[#12240f] uppercase tracking-wider">
                    Payment Summary
                  </h2>
                </div>
                <div className="flex flex-col gap-2.5">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-100 last:border-0 last:pb-0 first:pt-0">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Quantity Badge */}
                        <span className="bg-[#f0fdf4] border border-[#dcfce7] text-[#008744] font-sans font-black text-[10px] px-2 py-0.5 rounded-lg shrink-0 mt-0.5">
                          {item.quantity}x
                        </span>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[#12240f] font-extrabold text-[13.5px] leading-tight truncate text-left">
                            {formatProductName(item.product.name)}
                          </span>
                          <span className="text-[10px] text-[#5e6d5b] text-left font-semibold">
                            ₹{item.product.price} each
                          </span>
                        </div>
                      </div>
                      <span className="text-[14.5px] font-black font-mono text-[#12240f] shrink-0">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Total Bill section styled like receipt footer */}
                <div className="flex justify-between items-center bg-[#f7faf6] -mx-5 -mb-5 mt-4 p-4.5 rounded-b-[22px] border-t border-[#cbd7ca]/20">
                  <span className="font-sans font-black text-[11px] text-[#12240f] uppercase tracking-wider">Total Bill</span>
                  <span className="text-xl font-black font-mono text-[#006e2f]">₹{getCartTotal()}</span>
                </div>
              </section>

            </motion.div>
          )}

          {/* SCREEN 5: ACCOUNT */}
          {screen === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 text-left"
            >
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-5 border border-[#cbd7ca]/40 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#006e2f] to-emerald-400 text-white flex items-center justify-center shadow-md shrink-0">
                    <User size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-base text-[#12240f] leading-tight truncate">
                      {lang === 'en' ? 'Guest Customer' : lang === 'hi' ? 'अतिथि ग्राहक' : 'અતિથિ ગ્રાહક'}
                    </h4>
                    <p className="text-xs font-semibold text-[#5e6d5b] mt-0.5">ID: PC-8893-X</p>
                  </div>
                  <div className="bg-[#ecf3ec] border border-[#cbd7ca]/50 text-[#006e2f] text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shrink-0">
                    {lang === 'en' ? 'Active' : lang === 'hi' ? 'सक्रिय' : 'સક્રિય'}
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Session Status</span>
                    <span className="text-xs font-extrabold text-[#12240f] mt-0.5 block">Anonymous Session</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Kiosk Location</span>
                    <span className="text-xs font-extrabold text-[#12240f] mt-0.5 block">Kiosk DEL-09</span>
                  </div>
                </div>
              </div>

              {/* Rewards Progress Card */}
              <div className="bg-white rounded-3xl p-5 border border-[#cbd7ca]/40 shadow-sm flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-[#12240f] uppercase tracking-wide">CarePoints Rewards</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Earn points on every purchase</p>
                  </div>
                  <span className="text-lg font-black text-[#006e2f] font-mono">{carePoints} pts</span>
                </div>
                
                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#006e2f] h-full rounded-full" style={{ width: `${Math.min(100, (carePoints / 200) * 100)}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {carePoints >= 200 
                      ? 'You qualify for a free hygiene sample!' 
                      : `${200 - carePoints} more points to get a free hygiene sample`}
                  </span>
                </div>

                {/* Points history list */}
                <div className="h-px bg-slate-100 w-full my-1"></div>
                <div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Points History</h5>
                  <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto no-scrollbar">
                    {pointsHistory.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-extrabold text-[#12240f]">{item.name}</span>
                          <span className="text-[9.5px] text-slate-400 font-medium">{item.date}</span>
                        </div>
                        <span className="font-mono font-black text-[#006e2f]">+{item.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Session Transaction History */}
              <div className="bg-white rounded-3xl p-5 border border-[#cbd7ca]/40 shadow-sm flex flex-col gap-3.5 text-left">
                <div>
                  <h4 className="text-xs font-black text-[#12240f] uppercase tracking-wide">Session Transactions</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {sessionTransactions.length > 0 
                      ? 'Receipts from this session' 
                      : 'No transactions in this session yet'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto no-scrollbar">
                  {sessionTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">receipt_long</span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-extrabold text-[#12240f]">Receipt #{tx.id}</span>
                          <span className="text-[9.5px] text-slate-400 font-medium">
                            Completed • {tx.itemsCount} {tx.itemsCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black font-mono text-[#12240f]">₹{tx.total}</span>
                    </div>
                  ))}
                  
                  {sessionTransactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                      <span className="material-symbols-outlined text-3xl text-slate-300">receipt_long</span>
                      <p className="text-[10.5px] font-semibold mt-1">Your purchase receipts will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings & Support Section */}
              <div className="bg-white rounded-3xl p-5 border border-[#cbd7ca]/40 shadow-sm flex flex-col gap-3 text-left">
                <h4 className="text-xs font-black text-[#12240f] uppercase tracking-wide mb-1">Session Settings</h4>
                
                {/* Current Language */}
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                     <span className="material-symbols-outlined text-slate-500 text-lg">translate</span>
                     <span className="text-xs font-extrabold text-[#12240f]">Session Language</span>
                  </div>
                  <span className="text-xs font-black text-[#006e2f] uppercase bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/40">
                    {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ગુજરાતી'}
                  </span>
                </div>

                <div className="h-px bg-slate-100 w-full my-1"></div>

                {/* Toll-Free Help */}
                <div className="flex items-start gap-2.5 py-1">
                  <span className="material-symbols-outlined text-slate-500 text-lg mt-0.5">call</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-extrabold text-[#12240f]">Toll-Free Helpline</span>
                    <span className="text-[11.5px] font-black text-[#006e2f] font-mono">1800-111-2222</span>
                    <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Available 24/7 for technical and ordering support</p>
                  </div>
                </div>
              </div>

              {/* Secure Badge */}
              <div className="flex items-center justify-center gap-1.5 py-3 text-[10px] font-black text-[#006e2f] uppercase tracking-wider bg-emerald-50/50 rounded-2xl border border-emerald-100/30 shrink-0">
                <Shield size={12} className="stroke-[3]" />
                <span>
                  {t('confidential')}
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* STICKY BOTTOM ACTIONS ROW */}
      {screen === 'cart' && cart.length > 0 && (
        <div className="absolute bottom-16 left-0 right-0 w-full z-40 bg-white/80 backdrop-blur-md border-t border-[#bdcaba]/30 px-5 py-4 flex justify-center shadow-lg rounded-t-3xl">
          <div className="w-full flex flex-col gap-2">

            {/* Cart Bottom Action: Proceed to Payment */}
            <div className="w-full flex flex-col gap-2">
              <button 
                onClick={() => {
                  setUpiId('anonymous@gpay');
                  setScreen('payment');
                }}
                className="w-full h-14 rounded-2xl bg-[#006e2f] text-white font-sans font-black text-base shadow-lg active-shadow hover:bg-[#005222] active:scale-[0.98] transition-all flex items-center justify-between px-5 cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-extrabold">
                  Proceed to Pay
                </span>
                <span className="flex items-center gap-0.5 bg-white/15 px-3 py-1 rounded-xl text-sm font-black tracking-wide">
                  ₹{getCartTotal()}
                  <ChevronRight size={15} className="ml-0.5 stroke-[3.5]" />
                </span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5e6d5b] font-semibold mt-1">
                <Lock size={12} className="text-[#006e2f] stroke-[2.5]" />
                Secure &amp; Anonymous Checkout
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER TAB NAV BAR SHELL FOR DEEP SIMULATION */}
      <nav className="absolute bottom-0 left-0 right-0 h-[64px] bg-white z-30 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center">
        {/* Home */}
        <button 
          onClick={() => setScreen('landing')}
          className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
        >
          {screen === 'landing' && <div className="absolute top-0 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
          <Home size={20} className={`mb-1 transition-colors duration-200 ${screen === 'landing' ? 'text-[#006e2f]' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold transition-colors duration-200 ${screen === 'landing' ? 'text-[#006e2f]' : 'text-slate-400'}`}>
            {t('home')}
          </span>
        </button>

        {/* Products */}
        <button 
          onClick={() => setScreen('products')}
          className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
        >
          {screen === 'products' && <div className="absolute top-0 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
          <Grid size={20} className={`mb-1 transition-colors duration-200 ${screen === 'products' ? 'text-[#006e2f]' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold transition-colors duration-200 ${screen === 'products' ? 'text-[#006e2f]' : 'text-slate-400'}`}>
            {t('products')}
          </span>
        </button>

        {/* Cart */}
        <button 
          onClick={() => setScreen('cart')}
          className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
        >
          {screen === 'cart' && <div className="absolute top-0 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
          <div className="relative mb-0.5">
            <ShoppingCart size={20} className={`mb-0.5 transition-colors duration-200 ${screen === 'cart' ? 'text-[#006e2f]' : 'text-slate-400'}`} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full border border-white">
                {getCartCount()}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-bold transition-colors duration-200 ${screen === 'cart' ? 'text-[#006e2f]' : 'text-slate-400'}`}>
            {t('cart')}
          </span>
        </button>

        {/* Account */}
        <button 
          onClick={() => setScreen('account')}
          className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
        >
          {screen === 'account' && <div className="absolute top-0 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
          <User size={20} className={`mb-1 transition-colors duration-200 ${screen === 'account' ? 'text-[#006e2f]' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold transition-colors duration-200 ${screen === 'account' ? 'text-[#006e2f]' : 'text-slate-400'}`}>
            {t('account')}
          </span>
        </button>
      </nav>



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
                <p>Welcome to <strong>Smart Kiosk</strong>! Follow these steps to purchase products anonymously:</p>
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



    </div>
  );
}
