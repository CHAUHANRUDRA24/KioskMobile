import React, { useState } from 'react';
import { 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lock, 
  Shield 
} from 'lucide-react';
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
    emailLabel: "Email Address",
    passwordLabel: "Password",
    forgotPassword: "Forgot Password?",
    signIn: "Sign In",
    or: "OR",
    google: "Continue with Google",
    trust: "Your data is strictly confidential and protected by end-to-end encryption.",
    privacy: "Privacy Policy",
    terms: "Terms",
    security: "Security",
    copyright: "© 2024 Smart Kiosk Secure Access",
    invalidCreds: "Invalid credentials. Please use: demo@smartkiosk.com / password123",
    enterEmail: "Please enter your email address first.",
    resetSent: "A password reset link has been sent to your email!",
    emptyFields: "Please fill in all fields.",
    connectingGoogle: "Connecting with Google...",
    signingIn: "Signing in..."
  },
  hi: {
    privateSecure: "निजी और सुरक्षित",
    welcome: "वापसी पर स्वागत है",
    subtitle: "अपने स्वास्थ्य उत्पादों को प्रबंधित करने के लिए साइन इन करें",
    emailLabel: "ईमेल पता",
    passwordLabel: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    signIn: "साइन इन करें",
    or: "अथवा",
    google: "गूगल के साथ जारी रखें",
    trust: "आपका डेटा पूरी तरह से गोपनीय है और एंड-टू-एंड एन्क्रिप्शन द्वारा सुरक्षित है।",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",
    security: "सुरक्षा श्वेतपत्र",
    copyright: "© २०२४ स्मार्ट कियोस्क सुरक्षित पहुंच",
    invalidCreds: "अमान्य क्रेडेंशियल। कृपया उपयोग करें: demo@smartkiosk.com / password123",
    enterEmail: "कृपया पहले अपना ईमेल दर्ज करें।",
    resetSent: "आपके ईमेल पर पासवर्ड रीसेट लिंक भेज दिया गया है!",
    emptyFields: "कृपया सभी फ़ील्ड भरें।",
    connectingGoogle: "गूगल से कनेक्ट किया जा रहा है...",
    signingIn: "साइन इन हो रहा है..."
  },
  gu: {
    privateSecure: "ખાનગી અને સુરક્ષિત",
    welcome: "આપનું સ્વાગત છે",
    subtitle: "તમારી સ્વાસ્થ્ય જરૂરિયાતોનું સંચાન કરવા માટે સાઇન ઇન કરો",
    emailLabel: "ઈમેલ સરનામું",
    passwordLabel: "પાસવર્ડ",
    forgotPassword: "પાસવર્ડ ભૂલી ગયા છો?",
    signIn: "સાઇન ઇન કરો",
    or: "અથવા",
    google: "ગૂગલ સાથે ચાલુ રાખો",
    trust: "તમારો ડેટા સંપૂર્ણપણે ગુપ્ત છે અને એન્ડ-ટુ-એન્ડ એન્ક્રિપ્શન દ્વારા સુરક્ષિત છે.",
    privacy: "ગોપનીયતા નીતિ",
    terms: "સેવાની શરતો",
    security: "સુરક્ષા શ્વેતપત્ર",
    copyright: "© ૨૦૨૪ સ્માર્ટ કિઓસ્ક સુરક્ષિત ઍક્સેસ",
    invalidCreds: "અમાન્ય ઓળખપત્રો. કૃપા કરીને ઉપયોગ કરો: demo@smartkiosk.com / password123",
    enterEmail: "કૃપા કરીને પહેલા તમારો ઈમેલ દાખલ કરો.",
    resetSent: "તમારા ઈમેલ પર પાસવર્ડ રીસેટ લિંક મોકલવામાં આવી છે!",
    emptyFields: "કૃપા કરીને બધી વિગતો ભરો.",
    connectingGoogle: "ગૂગલ સાથે કનેક્ટ થઈ રહ્યું છે...",
    signingIn: "સાઇન ઇન થઈ રહ્યું છે..."
  }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ lang, setLang, onLoginSuccess }) => {
  const [email, setEmail] = useState('demo@smartkiosk.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(true);

  const t = (key: keyof typeof LOGIN_TRANSLATIONS.en) => {
    return LOGIN_TRANSLATIONS[lang]?.[key] || LOGIN_TRANSLATIONS.en[key];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setStatusMsg(t('emptyFields'));
      setStatusIsError(true);
      return;
    }

    if (trimmedEmail === 'demo@smartkiosk.com' && password === 'password123') {
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

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatusMsg(t('enterEmail'));
      setStatusIsError(true);
      return;
    }

    setStatusMsg(t('resetSent'));
    setStatusIsError(false);
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
      <header className="w-full flex justify-between items-center px-4 py-3 bg-transparent shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="font-sans font-extrabold text-lg tracking-tight text-[#006e2f]">Smart Kiosk</h1>
        </div>
        <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1 text-[11px] font-extrabold rounded-full transition-all cursor-pointer ${
              lang === 'en' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-[#5e6d5b] hover:text-[#0b1c30]'
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('hi')}
            className={`px-3 py-1 text-[11px] font-extrabold rounded-full transition-all cursor-pointer ${
              lang === 'hi' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-[#5e6d5b] hover:text-[#0b1c30]'
            }`}
          >
            हिं
          </button>
          <button 
            onClick={() => setLang('gu')}
            className={`px-3 py-1 text-[11px] font-extrabold rounded-full transition-all cursor-pointer ${
              lang === 'gu' ? 'bg-[#006b2c] text-white shadow-sm' : 'text-[#5e6d5b] hover:text-[#0b1c30]'
            }`}
          >
            ગુ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center px-6 py-4">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo centered */}
          <div className="flex justify-center mb-5">
            <img 
              src={logoImg} 
              alt="Creator Lab Logo" 
              className="w-16 h-16 rounded-2xl object-cover shadow-md border border-slate-200" 
            />
          </div>
          
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#006e2f] border border-emerald-100 font-semibold text-xs shadow-sm">
              <Lock size={12} className="stroke-[2.5]" />
              <span>{t('privateSecure')}</span>
            </span>
          </div>

          {/* Headings */}
          <div className="text-center mb-6">
            <h2 className="font-sans font-bold text-xl text-[#0b1c30] mb-1.5">{t('welcome')}</h2>
            <p className="text-xs text-[#5e6d5b] font-medium">{t('subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-semibold text-xs text-[#0b1c30] block pl-0.5" htmlFor="email">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5e6d5b] pointer-events-none">
                  <Mail size={16} />
                </span>
                <input 
                  className="w-full min-h-[48px] pl-9 pr-4 bg-[#f8f9fa] border border-[#bdcaba]/50 rounded-2xl text-xs text-[#0b1c30] placeholder:text-slate-400 focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f] transition-all outline-none"
                  id="email" 
                  name="email" 
                  placeholder="name@example.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-0.5">
                <label className="font-semibold text-xs text-[#0b1c30] block" htmlFor="password">
                  {t('passwordLabel')}
                </label>
                <a 
                  id="forgot-password-link" 
                  className="font-bold text-xs text-[#006e2f] hover:text-[#005321] transition-colors" 
                  href="#"
                  onClick={handleForgotPassword}
                >
                  {t('forgotPassword')}
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5e6d5b] pointer-events-none">
                  <Key size={16} />
                </span>
                <input 
                  className="w-full min-h-[48px] pl-9 pr-10 bg-[#f8f9fa] border border-[#bdcaba]/50 rounded-2xl text-xs text-[#0b1c30] placeholder:text-slate-400 focus:border-[#006e2f] focus:ring-1 focus:ring-[#006e2f] transition-all outline-none"
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  aria-label="Toggle password visibility" 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#5e6d5b] hover:text-[#0b1c30] transition-colors cursor-pointer" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

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

            {/* Sign In Button */}
            <button 
              className="w-full min-h-[48px] bg-[#006e2f] hover:bg-[#005321] text-white font-extrabold text-xs rounded-full shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              type="submit"
            >
              <span>{t('signIn')}</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-grow h-px bg-slate-200"></div>
            <span className="font-semibold text-xs text-[#5e6d5b]">{t('or')}</span>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>

          {/* Google Auth */}
          <button 
            id="google-btn" 
            className="w-full min-h-[48px] bg-white border border-[#bdcaba]/50 hover:border-slate-300 hover:bg-[#f8f9fa] text-[#0b1c30] font-extrabold text-xs rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
