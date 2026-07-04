import React, { useState, useEffect } from 'react';
import { Pointer, Lock, Shield, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  lang: 'en' | 'hi' | 'gu';
  setLang: (lang: 'en' | 'hi' | 'gu') => void;
  onLoginSuccess: (user?: any) => void;
}

const LOGIN_TRANSLATIONS = {
  en: {
    privateSecure: "Private & Secure",
    title: "One-Tap Login",
    subtitle: "Login securely with Telegram to continue with your checkout.",
    instruction: "Tap the button below to open Telegram and press Start.",
    buttonText: "One-Tap Login with Telegram",
    trust: "Your data is strictly confidential and protected by end-to-end encryption.",
    privacy: "Privacy Policy",
    terms: "Terms",
    security: "Security",
    copyright: "© 2024 Smart Kiosk Secure Access",
    awaiting: "Awaiting authentication..."
  },
  hi: {
    privateSecure: "निजी और सुरक्षित",
    title: "वन-टैप लॉगिन",
    subtitle: "चेकआउट के साथ आगे बढ़ने के लिए टेलीग्राम के साथ सुरक्षित रूप से लॉगिन करें।",
    instruction: "टेलीग्राम खोलने के लिए नीचे दिए गए बटन पर टैप करें और स्टार्ट दबाएं।",
    buttonText: "टेलीग्राम के साथ वन-टैप लॉगिन",
    trust: "आपका डेटा पूरी तरह से गोपनीय है और एंड-टू-एंड एन्क्रिप्शन द्वारा सुरक्षित है।",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",
    security: "सुरक्षा श्वेतपत्र",
    copyright: "© २०२४ स्मार्ट कियोस्क सुरक्षित पहुंच",
    awaiting: "प्रमाणीकरण की प्रतीक्षा..."
  },
  gu: {
    privateSecure: "ખાનગી અને સુરક્ષિત",
    title: "વન-ટેપ લોગિન",
    subtitle: "તમારું ચેકઆઉટ ચાલુ રાખવા માટે ટેલિગ્રામ સાથે સુરક્ષિત રીતે લોગિન કરો.",
    instruction: "ટેલિગ્રામ ખોલવા માટે નીચેના બટનને ટેપ કરો અને સ્ટાર્ટ દબાવો.",
    buttonText: "ટેલિગ્રામ સાથે વન-ટેપ લોગિન",
    trust: "તમારો ડેટા સંપૂર્ણપણે ગુપ્ત છે અને એન્ડ-તૃ-એન્ડ એન્ક્રિપ્શન દ્વારા સુરક્ષિત છે.",
    privacy: "ગોપનીયતા નીતિ",
    terms: "સેવાની શરતો",
    security: "સુરક્ષા શ્વેતપત્ર",
    copyright: "© ૨૦૨૪ સ્માર્ટ કિઓસ્ક સુરક્ષિત ઍક્સેસ",
    awaiting: "પ્રમાણીકરણની રાહ જોઈ રહ્યા છીએ..."
  }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ lang, onLoginSuccess }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'creato4_kiosk_bot';
  const t = LOGIN_TRANSLATIONS[lang];

  useEffect(() => {
    const randId = 'tg_' + Math.random().toString(36).substring(2, 10);
    setSessionId(randId);
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/telegram-login-status?sessionId=${randId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.loggedIn && data.user) {
            clearInterval(interval);
            setIsSuccess(true);
            setTimeout(() => {
              onLoginSuccess(data.user);
            }, 1000);
          }
        }
      } catch (err) {
        // Silently handle polling errors
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      // Clean up session if they leave without authenticating
      if (!isSuccess) {
        fetch(`/api/telegram-login-cleanup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: randId }),
          keepalive: true
        }).catch(() => {});
      }
    };
  }, [isSuccess, onLoginSuccess]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-[#f7faf7] overflow-y-auto">
      <div className="w-full max-w-sm flex-1 flex flex-col items-center pt-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006e2f] to-[#004d21] shadow-lg shadow-[#006e2f]/20 flex items-center justify-center p-3 mb-4">
            <Shield className="w-full h-full text-white" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#006e2f] bg-[#006e2f]/10 px-3 py-1 rounded-full">
            <Lock size={12} className="stroke-[3]" />
            {t.privateSecure}
          </div>
        </div>

        {/* Content Box */}
        <div className="w-full bg-white rounded-[2rem] p-8 shadow-xl shadow-black/[0.03] border border-[#006e2f]/5 flex flex-col items-center text-center">
          
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            {t.title}
          </h2>
          <p className="text-[15px] font-medium text-gray-500 leading-relaxed mb-6">
            {t.subtitle}
          </p>

          {!isSuccess ? (
            <div className="w-full flex flex-col items-center">
              <p className="text-sm font-bold text-gray-600 mb-6 bg-gray-50 p-4 rounded-2xl w-full border border-gray-100">
                {t.instruction}
              </p>
              
              <a 
                href={`https://t.me/${botUsername}?start=${sessionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 rounded-2xl bg-[#2AABEE] text-white font-sans font-black text-base shadow-lg hover:bg-[#2298d6] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-4"
              >
                <Pointer size={20} className="stroke-[2.5]" />
                {t.buttonText}
              </a>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-[#006e2f] font-bold text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006e2f] opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#006e2f]"></span>
                </span>
                {t.awaiting}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-6">
              <CheckCircle2 size={64} className="text-[#006e2f] mb-4 animate-bounce" />
              <p className="text-xl font-bold text-[#006e2f]">Success!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-sm mt-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={16} className="text-[#006e2f]" />
          <span className="text-xs font-black tracking-widest text-[#006e2f] uppercase">
            {t.privateSecure}
          </span>
        </div>
        <p className="text-center text-[10px] font-bold text-gray-400 mb-4 px-4 leading-relaxed max-w-[280px]">
          {t.trust}
        </p>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">{t.privacy}</a>
          <a href="#" className="hover:text-gray-600 transition-colors">{t.terms}</a>
          <a href="#" className="hover:text-gray-600 transition-colors">{t.security}</a>
        </div>
        <div className="mt-4 text-[9px] font-bold text-gray-300">
          {t.copyright}
        </div>
      </div>
    </div>
  );
};
