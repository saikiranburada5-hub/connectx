# Firebase Phone Authentication & Development Setup

ConnectX supports both **Instant Development Mode** (zero setup required) and **Live Firebase SMS Authentication**.

---

## ⚡ Option 1: Instant Development Mode (No Setup Needed)

When Firebase credentials are not provided in `.env`, ConnectX automatically runs in **Development Mode**:
- You can enter any valid 10-digit mobile number on the login page.
- Click **Send OTP**.
- Enter the development OTP: `123456`.
- The system will verify the number immediately and log you in or create your account.

---

## 🔒 Option 2: Live Firebase SMS Authentication Setup

Follow these steps to enable real SMS delivery via Firebase Phone Auth:

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or select an existing one).
3. Under **Project Settings > General > Your apps**, click the **Web icon (</>)** to register a web app.

### 2. Enable Phone Sign-in
1. In the left sidebar, navigate to **Build > Authentication**.
2. Under the **Sign-in method** tab, enable **Phone**.
3. Under **Authentication > Settings > Authorized domains**, ensure `localhost` and `127.0.0.1` are present.

### 3. Generate Service Account Key (for backend token verification)
1. In Firebase Console, go to **Project settings ⚙ > Service accounts**.
2. Click **Generate new private key** and download the JSON file.
3. Save this file in a secure location on your machine (e.g., `C:\secure\firebase-service-account.json`).

### 4. Configure `.env` File
Open the `.env` file in the project root and fill in your Firebase values:

```env
# Firebase Web App Configuration
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_APP_ID=1:123456789:web:...

# Firebase Admin SDK Service Account JSON
FIREBASE_SERVICE_ACCOUNT_JSON=C:\secure\firebase-service-account.json

# Optional: Set to true if you want to force Dev OTP mode (123456) even if keys are present
DEV_OTP_MODE=false
```

### 5. Run the Application
```powershell
python app.py
```
The login page will automatically detect your Firebase configuration and display `🟢 Live SMS Auth Active`.
