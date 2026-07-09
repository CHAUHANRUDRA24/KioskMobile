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
  Grid,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { PRODUCTS, CATEGORIES } from './data';
import { Product, CartItem, ScreenType } from './types';
import logoImg from './assets/creator_lab_logo.jpg';
import { LoginScreen } from './LoginScreen';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';


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
  const [screen, setScreen] = useState<ScreenType>('landing');
  const [user, setUser] = useState<any | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      setUserOrders([]);
    }
  }, [user]);
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
  const [countdown, setCountdown] = useState<number>(20);
  const [pickupCode, setPickupCode] = useState<string>('');

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayPayment = () => {
    const totalAmount = getCartTotal();
    if (totalAmount <= 0) return;

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T909ZVJnRZ8gmE";
    if (!keyId) {
      alert("Razorpay Key ID is not configured in .env file.");
      return;
    }

    const options = {
      key: keyId,
      amount: totalAmount * 100, // in paise
      currency: "INR",
      name: "CREATO4 Smart Kiosk",
      description: "Discreet Hygiene & Health Products",
      image: logoImg,
      handler: async function (response: any) {
        const paymentId = response.razorpay_payment_id;
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Save order to shared Firestore (also sends Telegram receipt)
        try {
          const phone = user?.phoneNumber
            ? String(user.phoneNumber).replace(/\D/g, '').slice(-10)
            : null;

          if (phone) {
            await fetch('/api/orders/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone,
                name: user?.first_name || user?.name || 'Guest',
                items: cart.map(ci => ({
                  productId: ci.product.id,
                  product: { title: ci.product.title, price: ci.product.price },
                  quantity: ci.quantity
                })),
                totalAmount,
                paymentMethod: 'RAZORPAY',
                paymentId
              })
            });
          }
        } catch (e) {
          console.warn('Order save failed (non-critical):', e);
        }

        setPaymentSuccess(true);
        setPickupCode(code);
        setPaymentFinished(true);
      },
      prefill: {
        contact: user?.phoneNumber || "9876543210"
      },
      theme: {
        color: "#006e2f"
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (resp: any) {
      alert("Payment Failed: " + resp.error.description);
    });
    rzp.open();
  };

  const handleRazorpayDebtPayment = () => {
    if (!pendingDebt) return;
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T909ZVJnRZ8gmE";
    const phoneStr = user?.phoneNumber ? String(user.phoneNumber).replace(/\D/g, '').slice(-10) : "";
    
    const options = {
      key: keyId,
      amount: pendingDebt.amount * 100, // in paise
      currency: "INR",
      name: "CREATO4 Smart Kiosk",
      description: "Emergency Debt Repayment",
      image: logoImg,
      handler: async function (response: any) {
        // On success, mark debt as paid in Firestore
        try {
          if (phoneStr) {
            await setDoc(doc(db, 'emergencyDebts', phoneStr), { paid: true }, { merge: true });
          }
        } catch (e) {
          console.warn("Could not write debt clearance to Firestore", e);
        }
        setPendingDebt(null);
        alert(lang === 'en' ? "Debt cleared successfully! Thank you." : "कर्ज चुका दिया गया! धन्यवाद।");
      },
      prefill: {
        contact: phoneStr || "9876543210"
      },
      theme: {
        color: "#006e2f"
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (resp: any) {
      alert("Payment Failed: " + resp.error.description);
    });
    rzp.open();
  };

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

  // Order history
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [pendingDebt, setPendingDebt] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setOrdersLoading(true);
      try {
        // Use the canonical 10-digit phone as the lookup key (shared with Kiosk)
        const phone = user.phoneNumber
          ? String(user.phoneNumber).replace(/\D/g, '').slice(-10)
          : null;

        if (!phone) {
          setUserOrders([]);
          return;
        }

        // Query by 'phone' field which is what the Kiosk uses
        const q = query(
          collection(db, 'orders'),
          where('phone', '==', phone)
        );
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort by 'date' (Kiosk schema) falling back to 'createdAt'
        ordersData.sort((a: any, b: any) => {
          const da = new Date(a.date || a.createdAt || 0).getTime();
          const db2 = new Date(b.date || b.createdAt || 0).getTime();
          return db2 - da;
        });
        setUserOrders(ordersData);

        // Fetch emergency debt status
        try {
          const res = await fetch(`/api/debt/${phone}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hasDebt) setPendingDebt(data);
            else setPendingDebt(null);
          }
        } catch (e) {
          console.error('Failed to fetch debt:', e);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (screen === 'account') {
      fetchOrders();
    }
  }, [screen, user]);

  // Custom state for Add to Cart Popup
  const [showAddPopup, setShowAddPopup] = useState<boolean>(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [popupTriggerId, setPopupTriggerId] = useState<number>(0);

  // Cart operations
  const addToCart = (product: Product) => {
    if (screen === 'products') {
      setLastAddedProduct(product);
      setShowAddPopup(true);
      setPopupTriggerId(prev => prev + 1);
    }
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
      setPaymentFinished(false);
      setPaymentSuccess(false);
      setScreen('landing');
      setCart([]);
      setPickupCode(null);
      setCountdown(20);
    }
    return () => clearTimeout(timer);
  }, [paymentFinished, countdown]);

  // Added to Cart popup auto-hide disabled per user request (it now stays until dismissed or navigated away)

  // Dismiss/restore the "Added to Cart" popup based on products screen navigation
  const prevScreenRef = useRef<ScreenType | null>(null);
  useEffect(() => {
    if (prevScreenRef.current === 'products' && screen !== 'products') {
      setShowAddPopup(false);
    } else if (screen === 'products' && cart.length > 0) {
      setShowAddPopup(true);
      if (!lastAddedProduct) {
        setLastAddedProduct(cart[cart.length - 1].product);
      }
    }
    prevScreenRef.current = screen;
  }, [screen, cart, lastAddedProduct]);

  // Reset payment states when navigating away from the payment screen
  useEffect(() => {
    if (screen !== 'payment') {
      setPaymentSuccess(false);
      setPaymentFinished(false);
      setCountdown(20);
      setPickupCode(null);
    }
  }, [screen]);

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

        // Record order to Firestore for checkout
        const saveOrderToFirestore = async () => {
          try {
            const orderId = `REDEEM-${pickupCode}`;
            await setDoc(doc(db, "orders", orderId), {
              userId: String(user?.phoneNumber || user?.id || 'guest'),
              orderId: txId,
              items: cart.map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
              })),
              totalAmount: cartTotal,
              createdAt: new Date().toISOString(),
              status: "pending_redemption",
              paymentMethod: "upi",
              redeemCode: `REDEEM-${pickupCode}`,
              pickupCode: pickupCode,
              isUsed: false
            });
            console.log("Order saved to Firestore:", orderId);
          } catch (error) {
            console.error("Error saving order to Firestore:", error);
          }
        };
        saveOrderToFirestore();
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
        <LoginScreen lang={lang} setLang={setLang} onLoginSuccess={(userDetails) => { 
          setUser(userDetails); 
          if (cart.length > 0) {
            setUpiId('anonymous@gpay');
            setScreen('payment');
          } else {
            setScreen('landing'); 
          }
        }} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[430px] h-screen md:h-[92vh] bg-surface flex flex-col relative shadow-[0_0_30px_rgba(0,110,47,0.1)] md:rounded-3xl overflow-hidden mx-auto border border-[#bdcaba]/30 my-0 md:my-auto pb-16">

      {/* HEADER BAR */}
      {screen === 'landing' ? (
        <header className="w-full pt-4 pb-4 px-4 sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#bdcaba]/30 flex items-center justify-between transition-all select-none">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-sans font-extrabold text-xl tracking-tight text-[#006e2f] truncate">
              Smart Kiosk
            </h1>
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

                <p className="font-bold text-[10px] tracking-[3px] text-[#006e2f] mb-2 uppercase">
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
                  <span className="px-2.5 py-1 bg-white text-[#006e2f] border border-[#cbd7ca]/40 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">lock</span> {t('private')}
                  </span>
                  <span className="px-2.5 py-1 bg-white text-[#006e2f] border border-[#cbd7ca]/40 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">bolt</span> {t('instant')}
                  </span>
                  <span className="px-2.5 py-1 bg-white text-[#006e2f] border border-[#cbd7ca]/40 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">spa</span> {t('alwaysOpenBadge')}
                  </span>
                </div>
              </section>

              {/* Get Started Card */}
              <button 
                onClick={() => setScreen('products')}
                className="w-full bg-[#006e2f] hover:bg-[#005321] text-white rounded-2xl p-4 shadow-lg shadow-[#006e2f]/20 active:scale-[0.98] transition-all group flex items-center justify-between border-b-4 border-[#00471b]"
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
                    <span className="material-symbols-outlined text-[#006e2f] text-[28px] mb-2">lock</span>
                    <p className="font-bold text-[13px] text-[#111827]">{t('fullyPrivate')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#006e2f] text-[28px] mb-2">schedule</span>
                    <p className="font-bold text-[13px] text-[#111827]">{t('alwaysOpen')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#006e2f] text-[28px] mb-2">qr_code_2</span>
                    <p className="font-bold text-[13px] text-[#111827]">{t('easyPayment')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#006e2f] text-[28px] mb-2">bolt</span>
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
                  className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-6 scroll-smooth pb-24"
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
                                  onClick={() => {
                                    if (qty === 0) {
                                      addToCart(product);
                                    }
                                  }}
                                  className={`group border-2 rounded-2xl p-2.5 flex items-center justify-between gap-3 transition-all duration-200 select-none ${
                                    qty > 0 
                                      ? 'bg-[#ecf3ec] border-[#006e2f] shadow-[0_3px_10px_rgba(0,110,47,0.05)]' 
                                      : 'bg-white hover:bg-[#fcfdfc] border-[#e6ebe5] hover:border-[#cbd7ca] shadow-[0_1.5px_3px_rgba(0,0,0,0.015)] cursor-pointer'
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
                                        className={`w-full h-full ${product.id === 'fa5' ? 'object-contain p-0.5' : 'object-cover'}`} 
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
                                className={`w-full h-full ${item.product.id === 'fa5' ? 'object-contain p-0.5' : 'object-cover'}`} 
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
                    <div className="flex flex-col items-center gap-1.5">
                      <CreditCard size={28} className="text-[#006e2f] stroke-[2.5]" />
                      <h3 className="font-sans font-black text-sm text-[#12240f] uppercase tracking-wider">
                        Secure Checkout
                      </h3>
                      <p className="font-sans text-[11px] text-[#5e6d5b] font-medium leading-none">
                        All transactions are encrypted and 100% private
                      </p>
                    </div>

                    {/* Razorpay Button */}
                    <div className="w-full mt-4 px-2">
                      <button
                        onClick={handleRazorpayPayment}
                        className="w-full min-h-[48px] bg-[#006e2f] hover:bg-[#005321] text-white font-extrabold text-xs rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CreditCard size={14} className="stroke-[3]" />
                        <span>Pay with Razorpay (Card/Netbanking/UPI)</span>
                      </button>
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
                          <div className="mt-4 flex flex-col items-center w-full">
                            <div className="p-4 bg-[#f0fdf4] border border-[#cbd7ca]/40 rounded-2xl flex flex-col items-center w-full max-w-[280px]">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#5e6d5b]">
                                Kiosk Collection Code
                              </span>
                              <span className="text-2xl font-black font-mono text-[#006e2f] mt-1 tracking-widest">
                                {pickupCode.slice(0, 3)} {pickupCode.slice(3)}
                              </span>
                            </div>
                            <div className="mt-4 p-3 bg-white border border-[#cbd7ca]/40 rounded-2xl shadow-sm">
                              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=REDEEM-${pickupCode}`} alt="QR Code" className="w-32 h-32" />
                            </div>
                            <span className="text-xs text-[#5e6d5b] mt-2 font-semibold">Scan this at the Kiosk to collect items</span>
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
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Quantity Badge */}
                        <span className="bg-[#f0fdf4] border border-[#dcfce7] text-[#008744] font-sans font-black text-[10px] px-2 py-0.5 rounded-lg shrink-0">
                          {item.quantity}x
                        </span>

                        {/* Product Image */}
                        <div className="w-9 h-9 rounded-lg border border-[#cbd7ca]/30 flex items-center justify-center shrink-0 overflow-hidden bg-[#f4f7f3]">
                          {item.product.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className={`w-full h-full ${item.product.id === 'fa5' ? 'object-contain p-0.5' : 'object-cover'}`} 
                            />
                          ) : (
                            <span className="text-sm">{item.product.imageEmoji}</span>
                          )}
                        </div>

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
              {/* Friendly Welcome Card */}
              <div className="bg-white rounded-3xl p-5 border border-[#cbd7ca]/40 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#006e2f] to-emerald-400 text-white flex items-center justify-center shadow-md shrink-0">
                  <User size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-base text-[#12240f] leading-tight">
                    {user 
                      ? `${lang === 'en' ? 'Welcome' : lang === 'hi' ? 'स्वागत है' : 'સ્વાગત છે'}, ${user.first_name || 'User'}!`
                      : (lang === 'en' ? 'Welcome, Guest!' : lang === 'hi' ? 'स्वागत है, अतिथि!' : 'સ્વાગત છે, અતિથિ!')
                    }
                  </h4>
                  <p className="text-xs text-[#5e6d5b] font-semibold mt-1 leading-snug">
                    {user 
                      ? (lang === 'en' 
                        ? `Signed in via Telegram (@${user.username || 'user'})` 
                        : lang === 'hi' 
                        ? `टेलीग्राम के माध्यम से साइन इन किया गया (@${user.username || 'user'})` 
                        : `ટેલિગ્રામ દ્વારા સાઇન ઇન કરેલ છે (@${user.username || 'user'})`)
                      : (lang === 'en' 
                        ? 'You are signed in anonymously. Your privacy is fully secured.' 
                        : lang === 'hi' 
                        ? 'आप गुमनाम रूप से साइन इन हैं। आपकी गोपनीयता पूरी तरह से सुरक्षित है।' 
                        : 'તમે અનામી રીતે સાઇન ઇન છો. તમારી ગોપનીયતા સંપૂર્ણપણે સુરક્ષિત છે.')
                    }
                  </p>
                </div>
              </div>

              {/* Order History */}
              {user && (
                <div className="bg-white rounded-3xl p-5 border border-[#cbd7ca]/40 shadow-sm flex flex-col gap-4 text-left">
                  <h4 className="text-sm font-black text-[#12240f] uppercase tracking-wide">
                    {lang === 'en' ? 'My Orders' : lang === 'hi' ? 'मेरे आदेश' : 'મારા ઓર્ડર'}
                  </h4>
                  
                  {ordersLoading ? (
                    <div className="text-center py-4 text-sm text-gray-400 font-bold">
                      {lang === 'en' ? 'Loading orders...' : 'लोड हो रहा है...'}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Debt Alert Block */}
                      {pendingDebt && pendingDebt.hasDebt && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-rose-700">🚨 Unpaid Emergency Order</span>
                              <span className="text-xs font-bold text-rose-500 mt-1">
                                {new Date(pendingDebt.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <span className="text-sm font-black text-rose-700 bg-rose-100 px-2 py-1 rounded-md">
                              ₹{pendingDebt.amount}
                            </span>
                          </div>
                          <button
                            onClick={handleRazorpayDebtPayment}
                            className="w-full h-10 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                          >
                            <CreditCard size={16} />
                            Pay Emergency Debt
                          </button>
                        </div>
                      )}

                      {userOrders.length > 0 ? userOrders.map((order, idx) => {
                        const orderDate = new Date(order.date || order.createdAt || Date.now());
                        const isInvalid = isNaN(orderDate.getTime());
                        const displayDate = isInvalid ? 'Recent' : orderDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                        
                        // Formatting status
                        let statusColor = 'bg-gray-100 text-gray-600';
                        let statusText = (order.status || 'unknown').replace('_', ' ').toUpperCase();
                        
                        if (order.status === 'redeemed' || order.status === 'paid') {
                          statusColor = 'bg-emerald-100 text-emerald-800';
                        } else if (order.status === 'pending_redemption') {
                          statusColor = 'bg-blue-100 text-blue-800';
                          statusText = 'PENDING REDEEM';
                        } else if (order.status === 'unpaid' || order.type === 'emergency') {
                          statusColor = 'bg-amber-100 text-amber-800';
                          if (order.type === 'emergency') statusText = 'EMERGENCY';
                        }

                        return (
                          <div key={idx} className="flex flex-col gap-2 p-4 rounded-2xl bg-[#f7faf7] border border-[#006e2f]/10">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-500">
                                {displayDate}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${statusColor}`}>
                                {statusText}
                              </span>
                            </div>
                            <div className="text-sm font-black text-[#12240f]">
                              ₹{order.totalAmount} • {order.items?.length || 0} items
                            </div>
                            
                            {/* Redeem Code Display */}
                            {order.redeemCode && (
                              <div className={`mt-2 text-xs font-black py-2 rounded-xl text-center tracking-widest ${order.status === 'redeemed' ? 'bg-gray-200 text-gray-500 line-through' : 'bg-[#006e2f] text-white shadow-md'}`}>
                                {order.status === 'redeemed' ? 'REDEEMED' : `CODE: ${order.redeemCode.split('-')[1] || order.redeemCode}`}
                              </div>
                            )}
                          </div>
                        );
                      }) : !pendingDebt && (
                        <div className="text-center py-6">
                          <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs font-bold text-gray-400">
                            {lang === 'en' ? 'No orders yet.' : 'कोई आदेश नहीं.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Logout Button */}
              {user && (
                <button 
                  onClick={() => {
                    setUser(null);
                    setCart([]);
                    setScreen('landing');
                  }}
                  className="mt-2 w-full h-14 rounded-2xl bg-rose-50 text-rose-600 font-sans font-black text-sm shadow-sm active-shadow active:scale-[0.98] transition-all flex items-center justify-center border border-rose-100"
                >
                  {lang === 'en' ? 'Sign Out' : lang === 'hi' ? 'साइन आउट करें' : 'સાઇન આઉટ કરો'}
                </button>
              )}

              {/* Support Helpline Card */}
              <div className="bg-white rounded-3xl p-5 border border-[#cbd7ca]/40 shadow-sm flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#006e2f] flex items-center justify-center shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-lg">call</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-black text-[#12240f] uppercase tracking-wide">
                    {lang === 'en' ? 'Need Help?' : lang === 'hi' ? 'मदद चाहिए?' : 'મદદ જોઈતી હોય તો?'}
                  </h4>
                  <span className="text-[13px] font-black text-[#006e2f] font-mono mt-0.5 block">1800-111-2222</span>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-none mt-1">
                    {lang === 'en' ? 'Free 24/7 helpline for ordering support' : lang === 'hi' ? 'निशुल्क 24/7 तकनीकी और ऑर्डर हेल्पलाइन' : 'મફત 24/7 તકનીકી અને ઓર્ડર હેલ્પલાઇન'}
                  </p>
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
        <div className="absolute bottom-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-[#cbd7ca]/40 px-4 py-3 flex justify-center shadow-xl rounded-2xl">
          <div className="w-full flex flex-col gap-2">

            {/* Cart Bottom Action: Proceed to Payment */}
            <div className="w-full flex flex-col gap-2">
              <button 
                onClick={() => {
                  if (!user) {
                    setScreen('login');
                  } else {
                    setUpiId('anonymous@gpay');
                    setScreen('payment');
                  }
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

      {/* Added to Cart Toast Popup */}
      <AnimatePresence>
        {showAddPopup && lastAddedProduct && screen === 'products' && cart.length > 0 && (
          <motion.div
            key={`popup-${lastAddedProduct.id}-${popupTriggerId}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-4 right-4 z-40 bg-[#0a2614]/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-emerald-950/20"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {lastAddedProduct.imageUrl ? (
                  <img 
                    src={lastAddedProduct.imageUrl} 
                    alt={lastAddedProduct.name} 
                    className={`w-full h-full ${lastAddedProduct.id === 'fa5' ? 'object-contain p-0.5' : 'object-cover'}`} 
                  />
                ) : (
                  <span className="text-base select-none">{lastAddedProduct.imageEmoji || '🛒'}</span>
                )}
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-wider leading-none">Added to Cart</p>
                <p className="text-xs font-bold text-white mt-1 truncate leading-tight">
                  {formatProductName(lastAddedProduct.name)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <button
                onClick={() => {
                  setScreen('cart');
                  setShowAddPopup(false);
                }}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white active:scale-95 transition-all px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1"
              >
                <span>Go to Cart</span>
                <span className="material-symbols-outlined text-[12px] font-bold">arrow_forward</span>
              </button>
              <button
                onClick={() => setShowAddPopup(false)}
                className="text-white/60 hover:text-white transition-colors p-1"
                aria-label="Dismiss"
              >
                <X size={16} className="stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER TAB NAV BAR SHELL FOR DEEP SIMULATION */}
      <nav className="absolute bottom-0 left-0 right-0 h-[64px] bg-white z-30 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center">
        {/* Home */}
        <button 
          onClick={() => setScreen('landing')}
          className="flex flex-col items-center justify-center w-16 h-full relative group active:scale-95 transition-all cursor-pointer"
        >
          {screen === 'landing' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
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
          {screen === 'products' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
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
          {screen === 'cart' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
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
          {screen === 'account' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#006e2f] rounded-b-full"></div>}
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
