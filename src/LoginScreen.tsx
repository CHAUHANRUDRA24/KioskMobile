import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ArrowRight, 
  Lock, 
  Shield,
  Edit2,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from './assets/creator_lab_logo.jpg';

interface LoginScreenProps {
  lang: 'en' | 'hi' | 'gu';
  setLang: (lang: 'en' | 'hi' | 'gu') => void;
  onLoginSuccess: () => void;
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
    signingIn: "Sending OTP..."
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
    signingIn: "ओटीपी भेजा जा रहा है..."
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
    trust: "તમારો ડેટા સંપૂર્ણપણે ગુપ્ત છે અને એન્ડ-ટુ-એન્ડ એન્ક્રિપ્શન દ્વારા સુરક્ષિત છે.",
    privacy: "ગોપનીયતા નીતિ",
    terms: "સેવાની શરતો",
    security: "સુરક્ષા શ્વેતપત્ર",
    copyright: "© ૨૦૨૪ સ્માર્ટ કિઓસ્ક સુરક્ષિત ઍક્સેસ",
    invalidCreds: "અમાન્ય ઓળખપત્રો. કૃપા કરીને ઉપયોગ કરો: મોબાઇલ: 9876543210 અને OTP: 123456",
    enterPhone: "કૃપા કરીને માન્ય 10-આંકડાનો મોબાઇલ નંબર દાખલ કરો.",
    enterOtp: "કૃપા કરીને 6-આંકડાનો OTP દાખલ કરો.",
    connectingGoogle: "ગૂગલ સાથે કનેક્ટ થઈ રહ્યું છે...",
    signingIn: "OTP મોકલી રહ્યું છે..."
  }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ lang, setLang, onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(true);

  const t = (key: keyof typeof LOGIN_TRANSLATIONS.en) => {
    return LOGIN_TRANSLATIONS[lang]?.[key] || LOGIN_TRANSLATIONS.en[key];
  };

  // OTP Countdown Timer Effect
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMsg(null);

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setStatusMsg(t('enterPhone'));
      setStatusIsError(true);
      return;
    }

    setIsSending(true);
    // Simulate sending OTP API call
    setTimeout(() => {
      setIsSending(false);
      setOtpSent(true);
      setTimer(30);
      setStatusMsg(t('otpSentMsg'));
      setStatusIsError(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!otpSent) {
      handleSendOtp();
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    const cleanOtp = otp.trim().replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setStatusMsg(t('enterPhone'));
      setStatusIsError(true);
      return;
    }

    if (cleanOtp.length !== 6) {
      setStatusMsg(t('enterOtp'));
      setStatusIsError(true);
      return;
    }

    // Verify credentials (demo mode: 9876543210 and 123456)
    if (cleanPhone === '9876543210' && cleanOtp === '123456') {
      setStatusMsg(t('signingIn'));
      setStatusIsError(false);
      setTimeout(() => {
        onLoginSuccess();
      }, 800);
    } else {
      setStatusMsg(t('invalidCreds'));
      setStatusIsError(true);
    }
  };

  const handleGoogleLogin = () => {
    setStatusMsg(null);
    setStatusMsg(t('connectingGoogle'));
    setStatusIsError(false);
    setTimeout(() => {
      onLoginSuccess();
    }, 800);
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
            हिं
          </button>
          <button 
            type="button"
            onClick={() => setLang('gu')}
            className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
              lang === 'gu' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-[#5e6d5b] hover:text-[#0b1c30]'
            }`}
          >
            ગુ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center px-6 py-5">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo centered */}
          <div className="flex justify-center mb-4 shrink-0">
            <img 
              src={logoImg} 
              alt="Creator Lab Logo" 
              className="w-14 h-14 rounded-2xl object-cover shadow-md border border-slate-200" 
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
          <div className="text-center mb-5 shrink-0">
            <h2 className="font-sans font-bold text-xl text-[#0b1c30] mb-1">{t('welcome')}</h2>
            <p className="text-xs text-[#5e6d5b] font-medium">{t('subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mobile Number Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-[#0b1c30] block pl-0.5" htmlFor="phone">
                {t('phoneLabel')}
              </label>
              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5e6d5b] pointer-events-none">
                  <Smartphone size={16} />
                </span>
                <input 
                  className={`w-full min-h-[48px] pl-9 pr-12 bg-[#f8f9fa] border border-[#bdcaba]/50 rounded-2xl text-xs text-[#0b1c30] placeholder:text-slate-400 focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f] transition-all outline-none ${
                    otpSent ? 'opacity-70 font-semibold cursor-not-allowed bg-slate-100' : ''
                  }`}
                  id="phone" 
                  name="phone" 
                  placeholder="Enter 10-digit number" 
                  type="tel"
                  maxLength={10}
                  disabled={otpSent}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                />
                {otpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setStatusMsg(null);
                    }}
                    className="absolute right-3 flex items-center justify-center p-1.5 text-[#006e2f] hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                    title="Edit Phone Number"
                  >
                    <Edit2 size={14} className="stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

            {/* OTP Field with Animation */}
            <AnimatePresence>
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <div className="flex justify-between items-center px-0.5">
                    <label className="font-bold text-xs text-[#0b1c30] block pl-0.5" htmlFor="otp">
                      {t('otpLabel')}
                    </label>
                    {timer > 0 ? (
                      <span className="text-[10px] font-bold text-slate-400">
                        {t('resendOtpIn').replace('{seconds}', timer.toString())}
                      </span>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="font-bold text-[11px] text-[#006e2f] hover:text-[#005321] transition-colors cursor-pointer underline"
                      >
                        {t('resendOtp')}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5e6d5b] pointer-events-none">
                      <MessageSquare size={16} />
                    </span>
                    <input 
                      className="w-full min-h-[48px] pl-9 pr-4 bg-[#f8f9fa] border border-[#bdcaba]/50 rounded-2xl text-xs text-[#0b1c30] placeholder:text-slate-400 focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f] transition-all outline-none font-mono tracking-widest text-center"
                      id="otp" 
                      name="otp" 
                      placeholder="••••••" 
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Alert */}
            {statusMsg && (
              <div className={`text-xs font-semibold rounded-2xl py-2.5 px-3.5 leading-relaxed text-center border transition-all duration-300 ${
                statusIsError 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {statusMsg}
              </div>
            )}

            {/* Submit Button */}
            <button 
              className="w-full min-h-[48px] bg-[#006e2f] hover:bg-[#005321] text-white font-extrabold text-xs rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={isSending}
            >
              <span>{isSending ? t('signingIn') : (otpSent ? t('signIn') : t('sendOtp'))}</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4 shrink-0">
            <div className="flex-grow h-px bg-slate-200"></div>
            <span className="font-semibold text-xs text-[#5e6d5b]">{t('or')}</span>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>

          {/* Google Auth */}
          <button 
            id="google-btn" 
            className="w-full min-h-[48px] bg-white border border-[#bdcaba]/50 hover:border-slate-300 hover:bg-[#f8f9fa] text-[#0b1c30] font-extrabold text-xs rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            type="button"
            onClick={handleGoogleLogin}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path>
              <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
              <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"></path>
              <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
            </svg>
            <span>{t('google')}</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-transparent flex flex-col items-center justify-center py-3 text-center gap-1 shrink-0 px-4">
        <div className="flex items-center justify-center gap-1 px-4 text-[#006e2f] text-[10px] font-bold uppercase tracking-wider mb-1.5">
          <Shield size={12} className="stroke-[2.5]" />
          <span>{t('trust')}</span>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a className="text-[10px] text-[#5e6d5b] hover:text-[#006e2f] transition-all duration-200 underline font-semibold" href="#">{t('privacy')}</a>
          <a className="text-[10px] text-[#5e6d5b] hover:text-[#006e2f] transition-all duration-200 underline font-semibold" href="#">{t('terms')}</a>
          <a className="text-[10px] text-[#5e6d5b] hover:text-[#006e2f] transition-all duration-200 underline font-semibold" href="#">{t('security')}</a>
        </div>
        <p className="text-[10px] font-extrabold text-[#006e2f]/80 mt-0.5">{t('copyright')}</p>
      </footer>
    </div>
  );
};
