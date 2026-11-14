# UFUQ ’26 — Firebase Setup & Organizer Deployment Guide

**Event:** UFUQ ’26 (أُفُق) — A Transition & Leadership Camp  
**Organizer:** Alathurpadi Dars Students Association (ADSA)  
**Dates:** December 24–30, 2026  
**Venue:** Alathurpadi Dars Campus, Malappuram, Kerala, India  

---

## 1. Overview & Architecture

The UFUQ ’26 web application is built on **Next.js 15 (App Router)** and styled with **Tailwind CSS**, featuring custom typography (**Clash Display**, **DG Sahabah**, and **Arima**), full multilingual localization (**English**, **Malayalam**, and **Arabic RTL**), fine-pointer micro-interactions, an AI-powered event assistant, offline PWA caching, and a protected administration portal.

### Firebase Services Used:
- **Firebase Hosting**: High-speed global CDN delivery with custom domain mapping, security headers, and caching.
- **Firebase Authentication**: Secure administrator access control.
- **Cloud Firestore**: Database for real-time editable event info, 7-day schedule sessions, guest profiles, FAQs, and registration records.
- **Cloud Storage**: Secure media hosting for speaker portraits and camp materials.
- **GitHub Actions**: Automated continuous deployment on git push.

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

Populate the following variables with your Firebase project credentials from the [Firebase Console](https://console.firebase.google.com/):

```env
# Client-side configuration (Safe for public browser)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="ufuq-2026.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="ufuq-2026"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="ufuq-2026.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef"

# Server-side Admin credentials (NEVER expose to client)
FIREBASE_ADMIN_PROJECT_ID="ufuq-2026"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk@ufuq-2026.iam.gserviceaccount.com"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Optional: Gemini API Key for server-side AI event helper
GEMINI_API_KEY="AIzaSy..."
```

---

## 3. Firebase Console Setup Steps

### Step 3.1: Create Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name the project `ufuq-2026` (or your chosen project ID).
3. Enable Google Analytics if desired, or skip.

### Step 3.2: Enable Authentication
1. Navigate to **Build > Authentication > Sign-in method**.
2. Enable **Email/Password**.
3. Create an administrator account (e.g., `admin@alathurpadidars.in`).

### Step 3.3: Initialize Cloud Firestore
1. Navigate to **Build > Firestore Database > Create Database**.
2. Select **Production Mode** and choose regional location `asia-south1` (Mumbai) for lowest latency in Kerala.
3. Deploy the pre-configured least-privilege security rules:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

### Step 3.4: Initialize Cloud Storage
1. Navigate to **Build > Storage > Get Started**.
2. Deploy the pre-configured storage security rules:
   ```bash
   firebase deploy --only storage:rules
   ```

### Step 3.5: Set Up Hosting
1. Build the production application:
   ```bash
   npm run build
   ```
2. Deploy hosting:
   ```bash
   firebase deploy --only hosting
   ```

---

## 4. GitHub Actions CI/CD Setup

To enable automated zero-downtime deployment whenever code is pushed to your GitHub repository:

1. Open your GitHub repository settings: **Settings > Secrets and variables > Actions**.
2. Add the following repository secrets:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT_UFUQ_26`: (Generate a service account key in Firebase Console under *Project Settings > Service accounts*, and paste the JSON content).
   - `GEMINI_API_KEY`: (Optional API key from Google AI Studio).

The workflow file is ready at `.github/workflows/firebase-deploy.yml`.

---

## 5. Local Emulator Testing

Test authentication, Firestore, and storage locally without connecting to live servers:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Run all local emulators
firebase emulators:start
```
Emulator UI will be available at `http://localhost:4000`.

---

## 6. Organizer Content Checklist (What Still Needs Finalization)

All application features are fully functional. The following details are clearly labeled with sample badges and should be updated by the ADSA organizing committee via the **Admin Portal** (`/admin`):

- [ ] **Confirmed Guest Faculty**: Update the provisional guest profiles with finalized visiting lecturers, university professors, and career guides.
- [ ] **Daily Schedule Timings**: Customize session titles and timing breakdown across Days 1 through 7 as university admission cycles for 2026–2027 are confirmed.
- [ ] **Registration Cap & Deadlines**: The default deadline is set to December 10, 2026 with a 100-student cap. Organizers can toggle registration open/closed or adjust deadlines directly in the admin panel.
- [ ] **Official Support Phone / WhatsApp**: Add the specific volunteer coordinator contact numbers to the Contact section in the admin panel once allocated.
