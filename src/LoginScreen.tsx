import React, { useState, useEffect } from 'react';
import { Pointer, Lock, Shield, CheckCircle2, Phone, ChevronRight, KeyRound, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  lang: 'en' | 'hi' | 'gu';
  setLang: (lang: 'en' | 'hi' | 'gu') => void;
  onLoginSuccess: (user?: any) => void;
}

const API_URL = '';

export const LoginScreen: React.FC<LoginScreenProps> = ({ lang, onLoginSuccess }) => {
  const [mode, setMode] = useState<'qr' | 'otp'>('qr');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');

  // OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'creato4_kiosk_bot';

  // ─── QR SESSION POLLING ───
  useEffect(() => {
    if (mode !== 'qr') return;

    let active = true;
    let interval: NodeJS.Timeout;
    let success = false;

    // Create session
    fetch(`${API_URL}/api/auth/session/create`, { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (!active) return;
        setSessionId(data.sessionId);

        // Poll at 800ms
        interval = setInterval(async () => {
          try {
            const res = await fetch(`${API_URL}/api/auth/session/${data.sessionId}`, {
              cache: 'no-store'
            });
            if (!active) { clearInterval(interval); return; }
            if (res.status === 404) { clearInterval(interval); return; }
            const session = await res.json();

            if (session.status === 'authenticated') {
              success = true;
              clearInterval(interval);
              setSuccessName(session.name || 'Guest');
              setIsSuccess(true);
              setTimeout(() => {
                if (active) onLoginSuccess({
                  id: session.chatId,
                  first_name: session.name,
                  phoneNumber: session.phone,
                  loggedInAt: new Date().toISOString()
                });
              }, 1000);
            }
          } catch (err) {
            // keep polling silently
          }
        }, 800);
      })
      .catch(err => console.error('Session create error:', err));

    return () => {
      active = false;
      clearInterval(interval);
      if (!success && sessionId) {
        fetch(`${API_URL}/api/telegram-login-cleanup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          keepalive: true
        }).catch(() => {});
      }
    };
  }, [mode]);

  // ─── OTP HANDLERS ───
  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit number');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/send-telegram-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
      } else if (data.error === 'NOT_REGISTERED') {
        setError('This number is not linked to Telegram yet. Please use the QR method to log in first, then try OTP next time.');
      } else {
        setError(data.message || 'Failed to send OTP. Please try the QR method.');
      }
    } catch (e) {
      setError('Could not reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.replace(/\D/g, '').length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/verify-telegram-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessName(data.user?.first_name || 'Guest');
        setIsSuccess(true);
        setTimeout(() => onLoginSuccess(data.user), 1000);
      } else {
        setError(data.message || 'Incorrect OTP. Please try again.');
        setOtp('');
      }
    } catch (e) {
      setError('Could not reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#f7faf7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-[#006e2f]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Welcome, {successName}!</h2>
          <p className="text-gray-500 font-medium text-center">Login successful. Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-[#f7faf7] overflow-y-auto">
      <div className="w-full max-w-sm flex-1 flex flex-col items-center pt-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006e2f] to-[#004d21] shadow-lg shadow-[#006e2f]/20 flex items-center justify-center p-3 mb-4">
            <Shield className="w-full h-full text-white" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#006e2f] bg-[#006e2f]/10 px-3 py-1 rounded-full">
            <Lock size={12} className="stroke-[3]" />
            Private & Secure
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl overflow-hidden border border-[#006e2f]/20 mb-6 w-full max-w-xs">
          <button
            onClick={() => { setMode('qr'); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-bold transition-all ${mode === 'qr' ? 'bg-[#006e2f] text-white' : 'text-gray-500 bg-white hover:bg-gray-50'}`}
          >
            📱 QR Login
          </button>
          <button
            onClick={() => { setMode('otp'); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-bold transition-all ${mode === 'otp' ? 'bg-[#006e2f] text-white' : 'text-gray-500 bg-white hover:bg-gray-50'}`}
          >
            🔑 Phone OTP
          </button>
        </div>

        {/* Content Card */}
        <div className="w-full bg-white rounded-[2rem] p-7 shadow-xl shadow-black/[0.03] border border-[#006e2f]/5">

          {mode === 'qr' ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1">One-Tap Login</h2>
              <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-6 text-center">
                Tap the button below to open Telegram and press <strong>Start</strong>.
              </p>

              {sessionId ? (
                <a
                  href={`https://t.me/${botUsername}?start=${sessionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 rounded-2xl bg-[#2AABEE] text-white font-black text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-6"
                >
                  <Pointer size={20} className="stroke-[2.5]" />
                  Open Telegram to Login
                </a>
              ) : (
                <div className="w-full h-14 rounded-2xl bg-[#2AABEE]/40 flex items-center justify-center mb-6">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-[#006e2f] font-bold text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006e2f] opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#006e2f]"></span>
                </span>
                Awaiting authentication...
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Phone OTP</h2>
              <p className="text-[13px] font-medium text-gray-500 -mt-2">
                Enter your phone number to receive a 6-digit OTP on Telegram.
              </p>

              {!otpSent ? (
                <>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-400 font-bold text-sm">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setError(null);
                      }}
                      placeholder="10-digit mobile number"
                      className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-800 placeholder:text-gray-300"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs font-bold px-1">{error}</p>
                  )}

                  <button
                    onClick={handleSendOtp}
                    disabled={loading || phone.length < 10}
                    className="w-full h-12 rounded-xl bg-[#006e2f] text-white font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Send OTP via Telegram <ChevronRight size={16} /></>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => { setOtpSent(false); setOtp(''); setError(null); }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <p className="text-xs font-bold text-gray-500">OTP sent to Telegram for <span className="text-gray-800">+91 {phone}</span></p>
                  </div>

                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                    <KeyRound size={16} className="text-gray-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={e => {
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setError(null);
                      }}
                      placeholder="6-digit OTP"
                      className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-800 placeholder:text-gray-300 tracking-widest"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs font-bold px-1">{error}</p>
                  )}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length < 6}
                    className="w-full h-12 rounded-xl bg-[#006e2f] text-white font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Verify OTP & Login <CheckCircle2 size={16} /></>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-sm mt-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-[#006e2f]" />
          <span className="text-xs font-black tracking-widest text-[#006e2f] uppercase">Private & Secure</span>
        </div>
        <p className="text-center text-[10px] font-bold text-gray-400 px-4 leading-relaxed max-w-[280px]">
          Your data is strictly confidential and protected by end-to-end encryption.
        </p>
      </div>
    </div>
  );
};
