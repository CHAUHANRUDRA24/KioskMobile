import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, deleteDoc, query, collection, where, limit, orderBy } from 'firebase/firestore';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── The canonical Kiosk API — ALL Telegram ops route through this ──
const KIOSK_API = 'https://kiosk12.netlify.app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Ensure Firebase anonymous sign-in
app.use(async (req, res, next) => {
  try {
    if (!auth.currentUser) await signInAnonymously(auth);
  } catch (e) {
    console.warn('Firebase anon sign-in failed:', e);
  }
  next();
});

function normalizePhone(phone: string): string {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').slice(-10);
}

// ─────────────────────────────────────────────────────
//  SESSION MANAGEMENT  (delegates to Kiosk API)
// ─────────────────────────────────────────────────────

// Create a new QR session — proxy to Kiosk API so sessions are shared
app.post('/api/auth/session/create', async (_req, res) => {
  try {
    const r = await fetch(`${KIOSK_API}/api/auth/session/create`, { method: 'POST' });
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Poll session status — proxy to Kiosk API
app.get('/api/auth/session/:sessionId', async (req, res) => {
  try {
    const r = await fetch(`${KIOSK_API}/api/auth/session/${req.params.sessionId}`);
    if (r.status === 404) return res.status(404).json({ error: 'Session not found' });
    res.json(await r.json());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Legacy endpoint used by old LoginScreen.tsx — maps to new session polling
app.get('/api/telegram-login-status', async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  try {
    const r = await fetch(`${KIOSK_API}/api/auth/session/${sessionId}`);
    if (r.status === 404) return res.json({ loggedIn: false });
    const data = await r.json();
    if (data.status === 'authenticated') {
      return res.json({
        loggedIn: true,
        user: {
          id: data.chatId,
          first_name: data.name,
          phoneNumber: data.phone,
          loggedInAt: new Date().toISOString()
        }
      });
    }
    return res.json({ loggedIn: false });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Clean up session
app.post('/api/telegram-login-cleanup', async (req, res) => {
  const sessionId = req.body?.sessionId || req.query?.sessionId;
  if (sessionId) {
    await deleteDoc(doc(db, 'kiosk_sessions', String(sessionId)));
  }
  res.json({ success: true });
});

// ─────────────────────────────────────────────────────
//  OTP (delegates to Kiosk API)
// ─────────────────────────────────────────────────────

// Send OTP — proxy to Kiosk API
app.post('/api/send-telegram-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'phoneNumber required' });
  try {
    const r = await fetch(`${KIOSK_API}/api/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber })
    });
    const data = await r.json();
    if (r.ok) return res.json({ success: true, message: 'OTP sent successfully!' });
    // Map error codes
    if (data.error === 'not_registered') {
      return res.status(404).json({ error: 'NOT_REGISTERED', message: data.message });
    }
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Verify OTP — proxy to Kiosk API
app.post('/api/verify-telegram-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) return res.status(400).json({ error: 'phoneNumber and otp required' });
  try {
    const r = await fetch(`${KIOSK_API}/api/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber, otp })
    });
    const data = await r.json();
    if (r.ok && data.verified) {
      return res.json({
        success: true,
        message: 'Login successful!',
        user: {
          id: data.chatId,
          first_name: data.name,
          phoneNumber: data.phone,
          loggedInAt: new Date().toISOString()
        }
      });
    }
    res.status(400).json({ error: 'INVALID_OTP', message: data.error || 'Incorrect OTP' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────
//  NOTIFY — delegates to Kiosk API
// ─────────────────────────────────────────────────────

app.post('/api/notify-telegram', async (req, res) => {
  try {
    const r = await fetch(`${KIOSK_API}/api/notify-telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.json(await r.json());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────
//  ORDER HISTORY  (reads from shared Firestore)
// ─────────────────────────────────────────────────────

app.get('/api/orders/:phone', async (req, res) => {
  try {
    const phone = normalizePhone(req.params.phone);
    if (!phone) return res.status(400).json({ error: 'Invalid phone' });

    const q = query(
      collection(db, 'orders'),
      where('phone', '==', phone),
      orderBy('date', 'desc'),
      limit(20)
    );
    const snap = await getDocs(q);
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ orders });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────
//  EMERGENCY DEBT CHECK  (reads from shared Firestore)
// ─────────────────────────────────────────────────────

app.get('/api/debt/:phone', async (req, res) => {
  try {
    const phone = normalizePhone(req.params.phone);
    if (!phone) return res.status(400).json({ error: 'Invalid phone' });

    const snap = await getDoc(doc(db, 'emergencyDebts', phone));
    if (!snap.exists()) return res.json({ hasDebt: false });

    const data = snap.data();
    const isPaid = data.paid === true || data.paid === 'true';
    res.json({
      hasDebt: !isPaid,
      amount: data.totalAmount || 0,
      date: data.date,
      items: data.items || [],
      paid: isPaid
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────
//  RAZORPAY (proxies to Kiosk API for security)
// ─────────────────────────────────────────────────────

app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const r = await fetch(`${KIOSK_API}/api/razorpay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.json(await r.json());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────
//  SAVE ORDER (after payment on mobile)
// ─────────────────────────────────────────────────────

app.post('/api/orders/save', async (req, res) => {
  try {
    const { phone, name, items, totalAmount, paymentMethod, paymentId } = req.body;
    if (!phone || !items || !totalAmount) {
      return res.status(400).json({ error: 'phone, items, totalAmount required' });
    }

    const normPhone = normalizePhone(phone);
    const orderId = `order_mobile_${Date.now()}`;

    await setDoc(doc(db, 'orders', orderId), {
      phone: normPhone,
      name: name || 'Mobile User',
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'razorpay',
      paymentId: paymentId || null,
      date: new Date().toISOString(),
      type: 'mobile',
      status: 'paid',
      source: 'mobile_app'
    });

    // Send Telegram receipt if user has chatId
    const userDoc = await getDoc(doc(db, 'users', normPhone));
    if (userDoc.exists() && userDoc.data().telegramChatId) {
      const chatId = userDoc.data().telegramChatId;
      const itemsList = items.map((i: any) =>
        `📦 <code>${i.quantity}x</code> <b>${i.product?.title || i.name || 'Item'}</b> — ₹${(i.product?.price || i.price || 0) * i.quantity}`
      ).join('\n');

      fetch(`${KIOSK_API}/api/notify-telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          message: `🛒 <b>CREATO4 Mobile Order Receipt</b>\n\n🎉 <b>Payment Successful!</b>\n\n👤 <b>Customer:</b> ${name || 'Guest'}\n📱 <b>Phone:</b> ${normPhone}\n\n🛒 <b>Items:</b>\n${itemsList}\n\n💰 <b>Total Paid:</b> <code>₹${totalAmount}</code>\n📅 <b>Date:</b> <i>${new Date().toLocaleString('en-IN')}</i>\n\n🙏 <b>Thank you for your purchase!</b>`
        })
      }).catch(() => {});
    }

    res.json({ success: true, orderId });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', app: 'mobile', kioskApi: KIOSK_API });
});

export const handler = serverless(app);
