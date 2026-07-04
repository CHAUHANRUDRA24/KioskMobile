import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const botUsername = process.env.VITE_TELEGRAM_BOT_USERNAME;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const apiKey = process.env.VITE_FIREBASE_API_KEY;

if (!token) {
  console.error("WARNING: TELEGRAM_BOT_TOKEN is not defined in the environment.");
}

// In-memory cache to keep track of active Telegram login sessions
const activeSessions = new Map();

// In-memory cache for OTP codes: normalizedPhone -> { otp, expiresAt, chatId, firstName, username }
const otpStore = new Map();

// Helper to normalize phone number to last 10 digits
function normalizePhoneNumber(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10);
}

// Helper to save user info to Firestore using REST API
async function saveUserToFirestore(sessionId, userDetails) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${sessionId}?key=${apiKey}`;
  
  const body = {
    fields: {
      telegramId: { stringValue: String(userDetails.id) },
      firstName: { stringValue: userDetails.first_name || '' },
      username: { stringValue: userDetails.username || '' },
      authMethod: { stringValue: 'telegram' },
      loggedInAt: { stringValue: userDetails.loggedInAt }
    }
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Firestore REST API Error (saveUserToFirestore): ${response.status} - ${errorText}`);
    } else {
      console.log(`Successfully stored Telegram user for session ${sessionId} in Firestore.`);
    }
  } catch (error) {
    console.error("Error writing to Firestore REST API:", error);
  }
}

// Helper to save phone mapping to Firestore
async function savePhoneMapping(phoneNumber, mappingDetails) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) return;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/phone_${normalized}?key=${apiKey}`;
  
  const body = {
    fields: {
      chatId: { stringValue: String(mappingDetails.chatId) },
      firstName: { stringValue: mappingDetails.firstName || '' },
      username: { stringValue: mappingDetails.username || '' },
      linkedAt: { stringValue: new Date().toISOString() }
    }
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Firestore REST API Error (savePhoneMapping): ${response.status} - ${errorText}`);
    } else {
      console.log(`Successfully mapped phone ${normalized} to chatId ${mappingDetails.chatId} in Firestore.`);
    }
  } catch (error) {
    console.error("Error writing to Firestore REST API (savePhoneMapping):", error);
  }
}

// Helper to get phone mapping from Firestore
async function getPhoneMapping(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/phone_${normalized}?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Firestore REST API Error (getPhoneMapping): ${response.status} - ${errorText}`);
      return null;
    }
    const data = await response.json();
    return {
      chatId: data.fields?.chatId?.stringValue || null,
      firstName: data.fields?.firstName?.stringValue || '',
      username: data.fields?.username?.stringValue || ''
    };
  } catch (error) {
    console.error("Error reading Firestore REST API (getPhoneMapping):", error);
    return null;
  }
}

// Helper to send a message back to the Telegram user with optional reply markup
async function sendTelegramMessage(chatId, text, replyMarkup = null, parseMode = null) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  const body = {
    chat_id: chatId,
    text: text
  };
  
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }
  if (parseMode) {
    body.parse_mode = parseMode;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Telegram API Error (sendTelegramMessage): ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

// Polling Telegram Updates
let lastUpdateId = 0;

async function pollTelegramUpdates() {
  if (!token) {
    setTimeout(pollTelegramUpdates, 5000);
    return;
  }

  const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`;
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          lastUpdateId = update.update_id;
          
          if (update.message) {
            const chat = update.message.chat;
            console.log(`[BOT UPDATE] Msg from chat: ${chat.id} (${chat.first_name || ''}): text="${update.message.text || ''}" contact=${update.message.contact ? 'yes' : 'no'}`);
            
            // Check for shared contact
            if (update.message.contact) {
              const contact = update.message.contact;
              const phoneNumber = contact.phone_number;
              const mappingDetails = {
                chatId: chat.id,
                firstName: contact.first_name || chat.first_name || '',
                username: chat.username || ''
              };
              
              await savePhoneMapping(phoneNumber, mappingDetails);
              await sendTelegramMessage(
                chat.id,
                `✅ Thank you, your mobile number has been successfully linked to your Telegram account!\n\nYou can now log in at the Smart Kiosk using your mobile number.`,
                { remove_keyboard: true }
              );
              continue;
            }
            
            if (update.message.text) {
              const text = update.message.text.trim();
              const cleanDigits = text.replace(/\D/g, '');
              
              if (cleanDigits.length === 10 && /^\d+$/.test(cleanDigits)) {
                const mappingDetails = {
                  chatId: chat.id,
                  firstName: chat.first_name || chat.first_name || '',
                  username: chat.username || ''
                };
                await savePhoneMapping(cleanDigits, mappingDetails);
                await sendTelegramMessage(
                  chat.id,
                  `✅ Thank you, your mobile number ${cleanDigits} has been successfully linked to your Telegram account!\n\nYou can now log in at the Smart Kiosk using this number.`,
                  { remove_keyboard: true }
                );
                continue;
              }
              
              if (text.startsWith('/start ')) {
                const sessionId = text.split('/start ')[1].trim();
                if (sessionId) {
                  const userDetails = {
                    id: chat.id,
                    first_name: chat.first_name || '',
                    username: chat.username || '',
                    loggedInAt: new Date().toISOString()
                  };
                  
                  // Store in memory for the polling fallback API
                  activeSessions.set(sessionId, userDetails);
                  
                  // Write directly to Firestore in real-time
                  await saveUserToFirestore(sessionId, userDetails);
                  
                  // Acknowledge the user
                  await sendTelegramMessage(
                    chat.id,
                    `🎉 Login successful! You are now authenticated on the Smart Kiosk. You can return to the kiosk screen.`
                  );
                }
              } else if (text === '/start') {
                await sendTelegramMessage(
                  chat.id,
                  `👋 Welcome to Smart Kiosk Bot!\n\nPlease link your mobile number to enable OTP logins on the kiosk by clicking the button below, or scan a QR code to log in directly.`,
                  {
                    keyboard: [
                      [
                        {
                          text: "📱 Share Mobile Number",
                          request_contact: true
                        }
                      ]
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                  }
                );
              } else {
                await sendTelegramMessage(
                  chat.id,
                  `🤖 Use the button below to link your mobile number for secure kiosk logins.`,
                  {
                    keyboard: [
                      [
                        {
                          text: "📱 Share Mobile Number",
                          request_contact: true
                        }
                      ]
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                  }
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error polling Telegram updates:", error);
  }
  
  // Schedule next poll immediately (long polling timeout is 30s)
  setTimeout(pollTelegramUpdates, 1000);
}

// API endpoint for client to poll login status as a fallback 
app.get('/api/telegram-login-status', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }
  
  if (activeSessions.has(sessionId)) {
    const user = activeSessions.get(sessionId);
    return res.json({ loggedIn: true, user });
  }
  
  return res.json({ loggedIn: false });
});

app.post('/api/telegram-login-cleanup', (req, res) => {
  const sessionId = req.body?.sessionId || req.query?.sessionId;
  if (sessionId) {
    activeSessions.delete(sessionId);
    console.log(`Explicitly cleaned up session ${sessionId} from memory.`);
  }
  res.json({ success: true });
});

// API endpoint to send Telegram OTP
app.post('/api/send-telegram-otp', async (req, res) => {
  const { phoneNumber, sessionId } = req.body;
  if (!phoneNumber || !sessionId) {
    return res.status(400).json({ error: "phoneNumber and sessionId are required" });
  }

  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  console.log(`Checking mapping for phone: ${normalized}`);
  const mapping = await getPhoneMapping(normalized);
  if (!mapping || !mapping.chatId) {
    return res.status(404).json({ 
      error: "NOT_REGISTERED", 
      message: "This mobile number is not registered/linked with our Telegram Bot. Please scan the QR code to link your account first." 
    });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 120000; // 2 minutes

  console.log(`Generated OTP ${otp} for ${normalized} (chat ID: ${mapping.chatId})`);

  // Save to otpStore
  otpStore.set(normalized, {
    otp,
    expiresAt,
    chatId: mapping.chatId,
    firstName: mapping.firstName,
    username: mapping.username
  });

  // Send the OTP via Telegram
  const messageText = `🔑 *Smart Kiosk Security Verification*\n\nYour 6-digit Login Verification Code (OTP) is:\n\n*${otp}*\n\nThis code is valid for 2 minutes. Do not share it with anyone.`;
  
  try {
    await sendTelegramMessage(mapping.chatId, messageText, null, 'Markdown');
    return res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP via Telegram:", error);
    return res.status(500).json({ error: "SERVER_ERROR", message: "Failed to send OTP via Telegram." });
  }
});

// API endpoint to verify Telegram OTP
app.post('/api/verify-telegram-otp', async (req, res) => {
  const { phoneNumber, otp, sessionId } = req.body;
  if (!phoneNumber || !otp || !sessionId) {
    return res.status(400).json({ error: "phoneNumber, otp, and sessionId are required" });
  }

  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  const record = otpStore.get(normalized);
  if (!record) {
    return res.status(400).json({ error: "INVALID_OTP", message: "No active OTP request found for this phone number." });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return res.status(400).json({ error: "EXPIRED_OTP", message: "The OTP code has expired. Please request a new one." });
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ error: "INVALID_OTP", message: "The OTP entered is incorrect. Please try again." });
  }

  // OTP is valid! Log user in
  console.log(`OTP verified successfully for ${normalized}`);
  
  const userDetails = {
    id: record.chatId,
    first_name: record.firstName,
    username: record.username,
    loggedInAt: new Date().toISOString()
  };

  // Write directly to Firestore in real-time to trigger the kiosk UI login
  await saveUserToFirestore(sessionId, userDetails);

  // Clean up
  otpStore.delete(normalized);

  // Send confirmation message to Telegram
  await sendTelegramMessage(record.chatId, `🎉 Sign in successful on the Smart Kiosk! You are now logged in.`);

  return res.json({ success: true, message: "Login successful!", user: userDetails });
});

// Periodically prune activeSessions (e.g. sessions older than 5 minutes)
setInterval(() => {
  const now = new Date();
  let prunedCount = 0;
  for (const [sessionId, session] of activeSessions.entries()) {
    const loggedInTime = new Date(session.loggedInAt);
    if (now - loggedInTime > 5 * 60 * 1000) {
      activeSessions.delete(sessionId);
      prunedCount++;
    }
  }
  if (prunedCount > 0) {
    console.log(`Pruned ${prunedCount} stale/expired sessions from memory.`);
  }
}, 60000); // Check every minute

// Periodically prune expired OTPs from memory (every minute)
setInterval(() => {
  const now = Date.now();
  let prunedCount = 0;
  for (const [phone, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(phone);
      prunedCount++;
    }
  }
  if (prunedCount > 0) {
    console.log(`Pruned ${prunedCount} expired OTPs from memory.`);
  }
}, 60000);

app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", bot: botUsername });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
  console.log(`Telegram Bot Polling started...`);
  pollTelegramUpdates();
});
