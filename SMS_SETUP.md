# Live SMS Authentication Setup Guide

ConnectX supports sending **real SMS OTP verification codes** directly to user mobile phones using your preferred SMS gateway.

---

## 📱 Supported SMS Providers

You can configure any of the following providers in your `.env` file:

### ⚡ Option 1: Fast2SMS (Instant SMS for India)
1. Sign up for free at [Fast2SMS](https://www.fast2sms.com/).
2. Copy your **API Authorization Key** from the Dev API section.
3. Open `.env` and set:
   ```env
   FAST2SMS_API_KEY=your_fast2sms_api_key_here
   ```

---

### 🌐 Option 2: Twilio SMS (Global SMS Delivery)
1. Sign up at [Twilio](https://www.twilio.com/).
2. Copy your **Account SID**, **Auth Token**, and active **Twilio Phone Number** from the Console dashboard.
3. Open `.env` and set:
   ```env
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

---

### 🇮🇳 Option 3: 2Factor (India SMS Gateway)
1. Sign up at [2Factor.in](https://2factor.in/).
2. Get your API Key from the dashboard.
3. Open `.env` and set:
   ```env
   TWO_FACTOR_API_KEY=your_2factor_api_key_here
   ```

---

### ✉ Option 4: MSG91
1. Sign up at [MSG91](https://msg91.com/).
2. Copy your Auth Key and create an OTP Template ID.
3. Open `.env` and set:
   ```env
   MSG91_AUTH_KEY=your_msg91_auth_key
   MSG91_TEMPLATE_ID=your_template_id
   ```

---

### 🔥 Option 5: Firebase Phone Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/) and create/select a project.
2. Enable **Phone Authentication** under **Build > Authentication > Sign-in method**.
3. Under **Authentication > Settings > Authorized Domains**, add `localhost` and `127.0.0.1`.
4. Copy Web App credentials and set in `.env`:
   ```env
   FIREBASE_API_KEY=AIzaSy...
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project
   FIREBASE_APP_ID=1:123456789:web:...
   ```

---

## 🔒 Security & OTP Rules
- **6-Digit Dynamic OTP**: A new cryptographically random 6-digit OTP is generated per request.
- **5-Minute Expiry**: Codes expire after 300 seconds.
- **Brute-force Protection**: Maximum 5 attempts before the OTP is invalidated.
- **Resend Cooldown**: 30-second cooldown between resend requests.
- **Server Logging**: The dispatched OTP is logged to the server console for debugging.
