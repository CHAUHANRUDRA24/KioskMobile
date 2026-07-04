import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ArrowRight, 
  Lock, 
  Shield
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import logoImg from './assets/creator_lab_logo.jpg';

interface LoginScreenProps {
  lang: 'en' | 'hi' | 'gu';
  setLang: (lang: 'en' | 'hi' | 'gu') => void;
  onLoginSuccess: (user?: any) => void;
}

const LOGIN_TRANSLATIONS = {
  en: {
    privateSecure: "Private & Secure",
    welcome: "Welcome Back",
    subtitle: "Sign in to manage your health essentials",
    phoneLabel: "Mobile Number",
    otpLabel: "Enter 6-Digit OTP",
    sendOtp: "Send OTP",
    resendOtp: "Resend OTP",
    resendOtpIn: "Resend OTP in {seconds}s",
    otpSentMsg: "OTP sent successfully to your mobile!",
    signIn: "Verify & Sign In",
    or: "OR",
    google: "Continue with Google",
    trust: "Your data is strictly confidential and protected by end-to-end encryption.",
    privacy: "Privacy Policy",
    terms: "Terms",
    security: "Security",
    copyright: "© 2024 Smart Kiosk Secure Access",
    invalidCreds: "Invalid OTP. For demo use Mobile: 9876543210 & OTP: 123456",
    enterPhone: "Please enter a valid 10-digit mobile number.",
    enterOtp: "Please enter the 6-digit OTP.",
    connectingGoogle: "Connecting with Google...",
    signingIn: "Sending OTP...",
    telegramSignIn: "Sign in with Telegram QR",
    telegramPhoneSignIn: "Sign in with Mobile OTP",
    scanTitle: "Scan to Sign In",
    scanSubtitle: "Scan with your phone's camera or Telegram scanner to connect",
    awaitingBot: "Awaiting Bot Scan...",
    botInstructions: "Open the bot in Telegram on your phone and press Start to login automatically.",
    backToLogin: "Back to Login Options",
    expiresIn: "Expires in {time}",
    expired: "QR Code Expired",
    refresh: "Tap to refresh",
    phoneSignInTitle: "Mobile OTP Sign In",
    phoneSignInSubtitle: "Enter your mobile number to receive a verification code on Telegram",
    changeNumber: "Change Number",
    notLinkedTitle: "Link Telegram Bot",
    notLinkedSubtitle: "Your number is not linked. Scan this QR code with your phone or click the button to open Telegram, share your mobile number with the bot, and then click the button below.",
    openTelegram: "Open Telegram Bot",
    iveRegistered: "I've Linked My Number"
  },
  hi: {
    privateSecure: "निजी और सुरक्षित",
    welcome: "वापसी पर स्वागत है",
    subtitle: "अपने स्वास्थ्य उत्पादों को प्रबंधित करने के लिए साइन इन करें",
    phoneLabel: "मोबाइल नंबर",
    otpLabel: "६-अंकीय ओटीपी दर्ज करें",
    sendOtp: "ओटीपी भेजें",
    resendOtp: "ओटीपी पुनः भेजें",
    resendOtpIn: "{seconds}s में ओटीपी पुनः भेजें",
    otpSentMsg: "आपके मोबाइल नंबर पर ओटीपी सफलतापूर्वक भेज दिया गया है!",
    signIn: "सत्यापित करें और साइन इन करें",
    or: "अथवा",
    google: "गूगल के साथ जारी रखें",
    trust: "आपका डेटा पूरी तरह से गोपनीय है और एंड-टू-एंड एन्क्रिप्शन द्वारा सुरक्षित है।",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",
    security: "सुरक्षा श्वेतपत्र",
    copyright: "© २०२४ स्मार्ट कियोस्क सुरक्षित पहुंच",
    invalidCreds: "अमान्य विवरण। कृपया उपयोग करें: मोबाइल: 9876543210 और ओटीपी: 123456",
    enterPhone: "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।",
    enterOtp: "कृपया 6-अंकीय ओटीपी दर्ज करें।",
    connectingGoogle: "गूगल से कनेक्ट किया जा रहा है...",
    signingIn: "ओटीपी भेजा जा रहा है...",
    telegramSignIn: "टेलीग्राम क्यूआर से लॉगिन करें",
    telegramPhoneSignIn: "मोबाइल ओटीपी से लॉगिन करें",
    scanTitle: "साइन इन करने के लिए स्कैन करें",
    scanSubtitle: "कनेक्ट करने के लिए अपने फोन के कैमरे या टेलीग्राम स्कैनर से स्कैन करें",
    awaitingBot: "बॉट स्कैन की प्रतीक्षा है...",
    botInstructions: "अपने फोन पर टेलीग्राम में बॉट खोलें और स्वचालित रूप से लॉगिन करने के लिए स्टार्ट दबाएं।",
    backToLogin: "लॉगिन विकल्पों पर वापस जाएं",
    expiresIn: "समाप्त होने में: {time}",
    expired: "क्यूआर कोड समाप्त हो गया",
    refresh: "ताज़ा करने के लिए टैप करें",
    phoneSignInTitle: "मोबाइल ओटीपी लॉगिन",
    phoneSignInSubtitle: "टेलीग्राम पर सत्यापन कोड प्राप्त करने के लिए अपना मोबाइल नंबर दर्ज करें",
    changeNumber: "नंबर बदलें",
    notLinkedTitle: "टेलीग्राम बॉट लिंक करें",
    notLinkedSubtitle: "आपका मोबाइल नंबर लिंक नहीं है। अपने फोन से क्यूआर कोड स्कैन करें या टेलीग्राम बॉट खोलने के लिए बटन पर क्लिक करें, बॉट के साथ अपना मोबाइल नंबर साझा करें, फिर 'मैंने अपना नंबर लिंक कर लिया है' पर क्लिक करें।",
    openTelegram: "टेलीग्राम बॉट खोलें",
    iveRegistered: "मैंने अपना नंबर लिंक कर लिया है"
  },
  gu: {
    privateSecure: "ખાનગી અને સુરક્ષિત",
    welcome: "આપનું સ્વાગત છે",
    subtitle: "તમારી સ્વાસ્થ્ય જરૂરિયાતોનું સંચાન કરવા માટે સાઇન ઇન કરો",
    phoneLabel: "મોબાઇલ નંબર",
    otpLabel: "૬-આંકડાનો OTP દાખલ કરો",
    sendOtp: "OTP મોકલો",
    resendOtp: "OTP ફરીથી મોકલો",
    resendOtpIn: "{seconds}s માં OTP ફરીથી મોકલો",
    otpSentMsg: "તમારા મોબાઇલ નંબર પર OTP સફળતાપૂર્વક મોકલવામાં આવ્યો છે!",
    signIn: "વેરિફાય કરો અને સાઇન ઇન કરો",
    or: "અથવા",
    google: "ગૂગલ સાથે ચાલુ રાખો",
    trust: "તમારો ડેટા સંપૂર્ણપણે ગુપ્ત છે અને એન્ડ-તૃ-એન્ડ એન્ક્રિપ્શન દ્વારા સુરક્ષિત છે.",
    privacy: "ગોપનીયતા નીતિ",
    terms: "સેવાની શરતો",
    security: "સુરક્ષા શ્વેતપત્ર",
    copyright: "© ૨૦૨૪ સ્માર્ટ કિઓસ્ક સુરક્ષિત ઍક્સેસ",
    invalidCreds: "અમાન્ય ઓળખપત્રો. કૃપા કરીને ઉપયોગ કરો: મોબાઇલ: 9876543210 અને OTP: 123456",
    enterPhone: "કૃપા કરીને માનય 10-આંકડાનો મોબાઇલ નંબર દાખલ કરો.",
    enterOtp: "કૃપા કરીને 6-આંકડાનો OTP દાખલ કરો.",
    connectingGoogle: "ગૂગલ સાથે કનેક્ટ થઈ રહ્યું છે...",
    signingIn: "OTP મોકલી રહ્યું છે...",
    telegramSignIn: "ટેલિગ્રામ QR થી સાઇન ઇન કરો",
    telegramPhoneSignIn: "મોબાઇલ OTP થી સાઇન ઇન કરો",
    scanTitle: "સાઇન ઇન કરવા માટે સ્કેન કરો",
    scanSubtitle: "કનેક્ટ કરવા માટે તમારા ફોનના કેમેરા અથવા ટેલિગ્રામ સ્કેનરથી સ્કેન કરો",
    awaitingBot: "બોટ સ્કેનની રાહ જોઈ રહ્યા છીએ...",
    botInstructions: "તમારા ફોન પર ટેલિગ્રામમાં બોટ ખોલો અને આપમેળે લોગિન કરવા માટે સ્ટાર્ટ દબાવો.",
    backToLogin: "લોગિન વિકલ્પો પર પાછા જાઓ",
    expiresIn: "સમાપ્તિ સમય: {time}",
    expired: "ક્યૂઆર કોડ સમાપ્ત થઈ ગયો છે",
    refresh: "તાજું કરવા માટે ટેપ કરો",
    phoneSignInTitle: "મોબાઇલ OTP સાઇન ઇન",
    phoneSignInSubtitle: "ટેલિગ્રામ પર વેરિફિકેશન કોડ મેળવવા માટે તમારો મોબાઈલ નંબર દાખલ કરો",
    changeNumber: "નંબર બદલો",
    notLinkedTitle: "ટેલિગ્રામ બોટ લિંક કરો",
    notLinkedSubtitle: "તમારો મોબાઇલ નંબર લિંક કરેલ નથી. ક્યૂઆર કોડ સ્કેન કરો અથવા ટેલિગ્રામ બોટ ખોલવા માટે બટન પર ક્લિક કરો, બોટ સાથે તમારો મોબાઇલ નંબર શેર કરો, પછી 'મેં મારો નંબર લિંક કરી દીધો છે' બટન પર ક્લિક કરો.",
    openTelegram: "ટેલિગ્રામ બોટ ખોલો",
    iveRegistered: "મેં મારો નંબર લિંક કરી દીધો છે"
  }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ lang, setLang, onLoginSuccess }) => {
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Mobile OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpTimeLeft, setOtpTimeLeft] = useState(120);
  const [otpExpired, setOtpExpired] = useState(false);

  // Registration Flow state
  const [isNotRegistered, setIsNotRegistered] = useState(false);

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'creato4_kiosk_bot';

  const generateSession = () => {
    const randId = 'tg_' + Math.random().toString(36).substring(2, 10);
    setSessionId(randId);
  };

  const cleanupSessionOnServer = async (idToClean: string) => {
    try {
      await fetch(`/api/telegram-login-cleanup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: idToClean }),
        keepalive: true
      });
    } catch (err) {
      console.error("Failed to run session cleanup on server:", err);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setStatusMsg(t('enterPhone'));
      setStatusIsError(true);
      return;
    }

    setStatusMsg(null);
    setOtpSending(true);

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const randId = 'tg_' + Math.random().toString(36).substring(2, 10);
      setSessionId(randId);
      currentSessionId = randId;
    }

    try {
      const res = await fetch('/api/send-telegram-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, sessionId: currentSessionId })
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404 || data.error === "NOT_REGISTERED") {
          setIsNotRegistered(true);
        } else {
          setStatusMsg(data.message || "Failed to send OTP.");
          setStatusIsError(true);
        }
        setOtpSending(false);
      } else {
        setOtpSent(true);
        setOtpTimeLeft(120);
        setOtpExpired(false);
        setStatusMsg(null);
        setStatusIsError(false);
        setOtpSending(false);
        setIsNotRegistered(false);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to connect to the server.");
      setStatusIsError(true);
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setStatusMsg(t('enterOtp'));
      setStatusIsError(true);
      return;
    }

    setStatusMsg(null);
    setOtpVerifying(true);

    try {
      const res = await fetch('/api/verify-telegram-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp, sessionId })
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.message || "Invalid OTP code.");
        setStatusIsError(true);
        setOtpVerifying(false);
      } else {
        setStatusMsg("Login successful!");
        setStatusIsError(false);
        setOtpVerifying(false);
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to verify OTP.");
      setStatusIsError(true);
      setOtpVerifying(false);
    }
  };

  const handleRetrySendOtp = () => {
    setIsNotRegistered(false);
    handleSendOtp();
  };

  // Generate session on mount
  useEffect(() => {
    generateSession();
  }, []);

  // Cleanup sessionId on change/unmount
  useEffect(() => {
    const currentSessionId = sessionId;
    return () => {
      if (currentSessionId) {
        cleanupSessionOnServer(currentSessionId);
      }
    };
  }, [sessionId]);

  // OTP Countdown Timer
  useEffect(() => {
    if (!otpSent || otpExpired) return;

    const timer = setInterval(() => {
      setOtpTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpExpired(true);
          setStatusMsg("OTP has expired. Please request a new one.");
          setStatusIsError(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, otpExpired]);

  const t = (key: keyof typeof LOGIN_TRANSLATIONS.en) => {
    return LOGIN_TRANSLATIONS[lang]?.[key] || LOGIN_TRANSLATIONS.en[key];
  };

  return (
    <div className="w-full flex-grow flex flex-col justify-between bg-white text-[#0b1c30] select-none h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 py-3 bg-white border-b border-[#bdcaba]/35 shrink-0 transition-all select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <img 
            src={logoImg} 
            alt="Creator Lab" 
            className="w-8 h-8 rounded-lg border border-[#006e2f]/20 shadow-sm flex-shrink-0 object-cover" 
          />
          <h1 className="font-sans font-extrabold text-lg tracking-tight text-[#006e2f] truncate">
            Smart Kiosk
          </h1>
        </div>
        <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200/60 shadow-inner">
          <button 
            type="button"
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
              lang === 'en' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-[#5e6d5b] hover:text-[#0b1c30]'
            }`}
          >
            EN
          </button>
          <button 
            type="button"
            onClick={() => setLang('hi')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
              lang === 'hi' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-[#5e6d5b] hover:text-[#0b1c30]'
            }`}
          >
            HI
          </button>
          <button 
            type="button"
            onClick={() => setLang('gu')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
              lang === 'gu' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-[#5e6d5b] hover:text-[#0b1c30]'
            }`}
          >
            GU
          </button>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-grow flex items-center justify-center p-4 relative shrink-0">
        {/* Background Decorative Gradient Elements */}
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-[#bdcaba]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-[#006e2f]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[380px] bg-white border border-slate-100/90 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-stretch justify-center relative backdrop-blur-sm transition-all duration-300">
          {/* Top Logo */}
          <div className="flex justify-center mb-4 select-none shrink-0 transition-transform hover:scale-102 duration-300">
            <img 
              src={logoImg} 
              alt="Logo" 
              className="w-16 h-16 rounded-[22px] border border-[#006e2f]/10 shadow-sm object-cover" 
            />
          </div>
          
          {/* Badge */}
          <div className="flex justify-center mb-3.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006e2f] border border-emerald-100 font-semibold text-xs shadow-sm">
              <Lock size={12} className="stroke-[2.5]" />
              <span>{t('privateSecure')}</span>
            </span>
          </div>

          {/* Headings */}
          <div className="text-center mb-5 shrink-0 transition-all duration-350">
            <h2 className="font-sans font-bold text-xl text-[#0b1c30] mb-1.5">
              {isNotRegistered 
                ? t('notLinkedTitle') 
                : otpSent 
                  ? t('otpLabel') 
                  : t('phoneSignInTitle')}
            </h2>
            <p className="text-xs text-[#5e6d5b] font-medium max-w-[280px] mx-auto leading-relaxed">
              {isNotRegistered 
                ? t('notLinkedSubtitle') 
                : otpSent 
                  ? t('otpSentMsg') 
                  : t('phoneSignInSubtitle')}
            </p>
          </div>

          {/* Form Content */}
          <div className="w-full flex flex-col items-center gap-4 text-center shrink-0">
            {isNotRegistered ? (
              // Link Telegram Bot View (Registration QR Code)
              <div className="w-full flex flex-col items-center gap-4 text-center shrink-0">
                <div className="relative border border-slate-200/80 rounded-3xl p-5 bg-white shadow-md overflow-hidden select-none">
                  {/* Decorative corners */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-3 border-l-3 border-[#006e2f] rounded-tl-md z-10"></div>
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-3 border-r-3 border-[#006e2f] rounded-tr-md z-10"></div>
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-3 border-l-3 border-[#006e2f] rounded-bl-md z-10"></div>
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-3 border-r-3 border-[#006e2f] rounded-br-md z-10"></div>
                  
                  <div className="relative z-0 p-1.5 bg-white rounded-xl">
                    <QRCodeSVG
                      value={`https://t.me/${botUsername}`}
                      size={170}
                      level="H"
                      includeMargin={false}
                      className="transition-all duration-300"
                    />
                  </div>
                </div>

                <a
                  href={`https://t.me/${botUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#24A1DE] hover:bg-[#1d82b2] text-white rounded-2xl p-4 shadow-md font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.02-.75 3.99-1.73 6.66-2.88 8.01-3.44 3.81-1.58 4.6-.1.08.38z"/>
                  </svg>
                  <span>{t('openTelegram')}</span>
                </a>

                <button
                  type="button"
                  onClick={handleRetrySendOtp}
                  className="w-full bg-[#006e2f] hover:bg-[#005321] text-white rounded-2xl p-4 shadow-md font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('iveRegistered')}</span>
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsNotRegistered(false);
                    setStatusMsg(null);
                  }}
                  className="mt-1 text-xs text-[#5e6d5b] hover:text-[#0b1c30] hover:underline transition-colors font-bold cursor-pointer"
                >
                  Go Back
                </button>
              </div>
            ) : !otpSent ? (
              // Enter Phone Number View
              <div className="w-full flex flex-col items-stretch text-left gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">{t('phoneLabel')}</label>
                  <div className="flex gap-2">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 flex items-center text-sm font-extrabold text-slate-600 select-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-grow bg-slate-50 border border-slate-200/85 rounded-2xl px-4 py-3 text-sm font-bold text-[#0b1c30] focus:outline-none focus:border-[#006e2f] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpSending}
                  className="w-full bg-[#006e2f] hover:bg-[#005321] disabled:bg-slate-200 text-white rounded-2xl p-4 shadow-md font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {otpSending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>{t('signingIn')}</span>
                    </span>
                  ) : (
                    <>
                      <span>{t('sendOtp')}</span>
                      <ArrowRight size={16} className="stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Enter OTP View
              <div className="w-full flex flex-col items-stretch text-left gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-end items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setStatusMsg(null);
                      }}
                      className="text-[11px] text-[#006e2f] hover:underline font-extrabold transition-all cursor-pointer"
                    >
                      {t('changeNumber')}
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-lg font-black tracking-[0.6em] text-[#0b1c30] placeholder:tracking-normal focus:outline-none focus:border-[#006e2f] transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerifying || otpExpired}
                  className="w-full bg-[#006e2f] hover:bg-[#005321] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl p-4 shadow-md font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {otpVerifying ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <span>{t('signIn')}</span>
                  )}
                </button>

                <div className="text-center mt-1 select-none">
                  {!otpExpired ? (
                    <span className="text-xs font-bold text-slate-500">
                      {t('resendOtpIn').replace('{seconds}', String(otpTimeLeft))}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending}
                      className="text-xs font-extrabold text-[#006e2f] hover:underline transition-all cursor-pointer"
                    >
                      {t('resendOtp')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status Alert */}
          {statusMsg && (
            <div className={`text-xs font-semibold rounded-2xl py-2.5 px-3.5 leading-relaxed text-center border transition-all duration-300 mt-4 shrink-0 ${
              statusIsError 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {statusMsg}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-transparent flex flex-col items-center justify-center py-4 text-center gap-3 shrink-0 px-4">
        <div className="flex flex-col items-center gap-1.5 max-w-[340px] mx-auto select-none">
          <div className="flex items-center justify-center gap-2 text-[#006e2f] text-xs font-bold uppercase tracking-wider">
            <Shield size={16} className="stroke-[2]" />
            <span>{t('privateSecure')}</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-[290px] mx-auto">
            {t('trust')}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap mt-1">
          <a className="text-[10px] text-[#5e6d5b] hover:text-[#006e2f] transition-all duration-200 underline font-semibold" href="#">{t('privacy')}</a>
          <a className="text-[10px] text-[#5e6d5b] hover:text-[#006e2f] transition-all duration-200 underline font-semibold" href="#">{t('terms')}</a>
          <a className="text-[10px] text-[#5e6d5b] hover:text-[#006e2f] transition-all duration-200 underline font-semibold" href="#">{t('security')}</a>
        </div>
        <p className="text-[9px] font-extrabold text-[#006e2f]/70 mt-1">{t('copyright')}</p>
      </footer>
    </div>
  );
};
