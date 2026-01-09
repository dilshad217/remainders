# Contributing to Remainders

<img align="right" height="160" src="/public/logo.png" alt="Remainders-Logo">

**Welcome, contributor!** We're excited you're here. Remainders is built on the contributions of developers like you who believe in helping people live more intentionally.

This guide will help you get started with contributing to the project. Whether you're fixing a bug, adding a feature, or improving documentation, your contribution matters.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-remainders.vercel.app-black)](https://remainders.vercel.app/)
[![GitHub Issues](https://img.shields.io/badge/Issues-Welcome-green)](https://github.com/Ti-03/remainders/issues)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/remainders.git
   cd remainders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

   > **Note:** The app will run in demo mode without Firebase configuration. To enable authentication and database features, see the [Firebase Setup](#-firebase-setup-optional) section below.

4. **Test wallpaper generation**
   - Year View: `http://localhost:3000/api/wallpaper?viewMode=year&width=1170&height=2532`
   - Life View: `http://localhost:3000/api/wallpaper?viewMode=life&birthDate=1990-01-01&width=1170&height=2532`

---

## 🔥 Firebase Setup (Optional)

The app works perfectly without Firebase (demo mode), but to enable full functionality including user authentication, personalized configs, and the plugin system, you'll need to set up Firebase.

### Why Firebase?

Firebase provides:
- **Authentication**: Google sign-in for users
- **Firestore Database**: Store user configs, preferences, and plugin data
- **Real-time Updates**: Sync data across devices
- **Serverless**: No backend server needed

### Step-by-Step Firebase Configuration

#### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "remainders-dev")
4. (Optional) Enable Google Analytics
5. Click "Create project" and wait for setup to complete

#### 2. Enable Authentication

1. In your Firebase project, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Click on **Google** provider
5. Toggle "Enable"
6. Add a support email (your email)
7. Click "Save"

#### 3. Create Firestore Database

1. In your Firebase project, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2026, 3, 1);
       }
     }
   }
   ```
4. Select a Firestore location (choose closest to you)
5. Click "Enable"

#### 4. Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to "Your apps"
4. Click the **Web** icon `</>`
5. Register your app:
   - App nickname: "Remainders Dev" (or any name)
   - (Optional) Set up Firebase Hosting: No
6. Click "Register app"
7. Copy the `firebaseConfig` object

#### 5. Configure Environment Variables

1. In your local project root, create a `.env.local` file:
   ```bash
   touch .env.local
   ```

2. Add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

   > **Important:** Replace all values with your actual Firebase config values from step 4.

3. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

#### 6. Verify Firebase Connection

After restarting, you should see:
- ✅ No "Firebase not configured - running in demo mode" warning in console
- ✅ Google Sign-in button works
- ✅ User configs can be saved/loaded from Firestore

To test:
1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Complete authentication
4. Configure your wallpaper and save
5. Check Firestore Console to see your data

### Production Security Rules

Before deploying to production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can only read/write their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Username claims - prevent duplicates
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // User configs - public read, authenticated write
    match /configs/{username} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Plugins - public read, admin write only
    match /plugins/{pluginId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### Troubleshooting Firebase

**"Firebase not configured" warning still showing:**
- Check that `.env.local` exists in project root
- Verify all environment variables start with `NEXT_PUBLIC_`
- Restart the dev server after creating `.env.local`

**Authentication not working:**
- Ensure Google sign-in is enabled in Firebase Console
- Check that `authDomain` matches your Firebase project
- Verify your domain is authorized in Firebase Authentication settings

**Can't write to Firestore:**
- Check Firestore security rules
- Verify you're authenticated (signed in)
- Look for errors in browser console

**Need help?** Open an issue with the error message and steps you've tried.

## 📁 Project Structure

```
app/
├── api/wallpaper/         # Wallpaper generation API
│   ├── route.tsx          # Main API endpoint
│   ├── year-view.tsx      # Year view renderer
│   └── life-view.tsx      # Life view renderer
├── layout.tsx             # Root layout
└── page.tsx               # Home page
components/                # React components
├── BirthDateInput.tsx     # Birth date picker
├── DeviceSelector.tsx     # Device selection UI
├── ThemeColorPicker.tsx   # Color theme picker
├── ViewModeToggle.tsx     # Year/Life view toggle
└── SetupInstructions.tsx  # Setup guide
lib/
├── calcs.ts               # Date/time calculations
├── devices.ts             # Device presets
└── types.ts               # TypeScript types
```

## 💡 How to Contribute

### Reporting Bugs
- Check if the bug has already been reported in [Issues](https://github.com/Ti-03/remainders/issues)
- Create a new issue with:
  - Clear, descriptive title
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots (if applicable)
  - Device/browser information

### Suggesting Features
- Open an issue first to discuss the feature
- Explain the use case and why it's valuable
- Be open to feedback and alternative approaches

### Submitting Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   Use clear branch names:
   - `feature/add-month-view`
   - `fix/calendar-alignment`
   - `docs/update-readme`

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and patterns
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git commit -m "feat: add ISO 8601 week start option"
   ```
   Use conventional commit format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style/formatting
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a PR on GitHub with:
   - Clear description of what changed and why
   - Screenshots/videos for UI changes
   - Reference related issues (e.g., "Closes #123")

5. **Address review feedback**
   - Be responsive to comments
   - Make requested changes
   - Push updates to the same branch

## 🎨 Code Guidelines

### TypeScript
- Use TypeScript for type safety
- Define types in `lib/types.ts` when used across files
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks or utilities

### Styling
- Use Tailwind CSS utility classes
- Follow existing color scheme and spacing patterns
- Ensure responsive design for all screen sizes

### API Routes
- Edge runtime for performance (`export const runtime = 'edge'`)
- Validate query parameters
- Handle errors gracefully with appropriate status codes
- Document parameter requirements

## 🧪 Testing

Before submitting a PR:
- [ ] Test locally with `npm run dev`
- [ ] Test different device sizes (if UI changes)
- [ ] Test both Year and Life views (if applicable)
- [ ] Check for console errors/warnings
- [ ] Verify TypeScript compiles (`npm run build`)



## ❓ Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

---

**Thank you for contributing to Remainders!** Every contribution, no matter how small, helps make this project better for everyone. 🎉
