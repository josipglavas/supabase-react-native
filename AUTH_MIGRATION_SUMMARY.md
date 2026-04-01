## Auth Migration Summary

This document summarizes the changes from phone OTP to email/password + OAuth authentication for quick reference.

### What Changed

#### Removed

- Phone OTP sign-in flow (`signInWithOtp` / `verifyOtp`)
- Country picker component on login
- `/verify` screen for OTP confirmation

#### Added

- Email/password login and registration
- Google OAuth sign-in
- Apple OAuth sign-in (iOS only)
- Username completion screen (conditionally shown)
- OAuth callback handler route

#### Modified

- **AuthProvider**: Now handles email/password/OAuth methods with startup routing gating
- **User model**: Made `username` and other fields optional; added `email`
- **App routing**: Initial route determined by session + profile state at startup

### Authentication Flow

#### Cold Start (No Session)

```
App Start
  ↓
AuthProvider checks AsyncStorage for session
  ↓
If no session → Show Login screen
If session + username → Show Home (tabs)
If session + no username → Show Choose Username screen
```

#### Login with Email

```
User enters email + password
  ↓
Supabase validates credentials
  ↓
Session created + stored in AsyncStorage
  ↓
Profile lookup/create and check username
  ↓
If username exists → Navigate to Home
If username missing → Navigate to Choose Username
```

#### Register with Email

```
User enters email + password
  ↓
Supabase creates auth user + may send confirmation email
  ↓
If confirmation required:
  → User confirms in email
  → Manual login after confirmation
Else:
  → Session auto-created
  → Redirect to Choose Username
```

#### OAuth (Google / Apple)

```
User taps Google / Apple button
  ↓
Opens browser / system auth UI
  ↓
User completes provider authentication
  ↓
Browser/UI redirects to app with auth code
  ↓
App exchanges code for Supabase session
  ↓
Profile created with OAuth provider's email
  ↓
Check username:
  ↓
If username exists → Navigate to Home
If username missing → Navigate to Choose Username
```

#### Logout

```
User taps Sign Out (Profile screen)
  ↓
Supabase signs out + clears session
  ↓
LocalStorage and AsyncStorage cleared
  ↓
Redirect to Login screen
```

---

### Key Files

#### Services (Separation of Concerns)

- **[lib/auth/supabaseAuth.ts](lib/auth/supabaseAuth.ts)**: Email/Password + OAuth Supabase methods
- **[lib/auth/profile.ts](lib/auth/profile.ts)**: User profile query/create/update helpers
- **[provider/AuthProvider.tsx](provider/AuthProvider.tsx)**: App-level auth state machine and startup routing

#### UI Components

- **[components/auth/EmailPasswordFields.tsx](components/auth/EmailPasswordFields.tsx)**: Reusable email/password input component
- **[components/auth/OAuthButtons.tsx](components/auth/OAuthButtons.tsx)**: Reusable Google/Apple button component

#### Screens

- **[screens/auth/index.tsx](screens/auth/index.tsx)**: Login screen (email + OAuth)
- **[screens/auth/register.tsx](screens/auth/register.tsx)**: Register screen (email + OAuth)
- **[screens/auth/username.tsx](screens/auth/username.tsx)**: Username completion screen
- **[screens/auth/\_layout.tsx](screens/auth/_layout.tsx)**: Auth route stack

#### Routes

- **[app/(auth)/index.tsx](<app/(auth)/index.tsx>)**: Wrapper for login screen
- **[app/(auth)/register.tsx](<app/(auth)/register.tsx>)**: Wrapper for register screen
- **[app/(auth)/username.tsx](<app/(auth)/username.tsx>)**: Wrapper for username screen
- **[app/auth/callback.tsx](app/auth/callback.tsx)**: OAuth redirect callback handler

#### Data

- **[models/User.ts](models/User.ts)**: User type now with optional username/email/avatar
- **[prisma/schema.prisma](prisma/schema.prisma)**: User model includes `email` column

---

### Context API

The `useAuth()` hook now exposes:

```typescript
{
  user: User | null;                    // Current user profile (null if no auth)
  session: Session | null;              // Raw Supabase session
  isInitializing: boolean;              // True while checking initial session
  authError: string | null;             // Latest auth error message
  loginEmail: (email, password) => Promise<void>;     // Log in with email/password
  registerEmail: (email, password) => Promise<void>;  // Register with email/password
  loginGoogle: () => Promise<void>;     // Sign in with Google
  loginApple: () => Promise<void>;      // Sign in with Apple (iOS only)
  completeUsername: (username) => Promise<void>;      // Set username in profile
  logOut: () => Promise<void>;          // Sign out and clear session
  clearAuthError: () => void;           // Clear error message
}
```

---

### Routing Rules

#### Automatic Route Selection (AuthProvider Effect)

```typescript
if (isInitializing) {
  // App is loading session
  return;
}

if (!session) {
  // No auth → force Login screen
  if (not on auth screen) → router.replace("/(auth)");
  return;
}

if (usernameMissing) {
  // Session exists but username not set → force Username screen
  if (not on username screen) → router.replace("/(auth)/username");
  return;
}

// Session + username complete → force Home/Tabs
if (on auth screen) → router.replace("/(tabs)");
```

This ensures users cannot manually navigate to Home/Tabs while missing username, and cannot access auth screens after completing profile.

---

### Supabase Configuration Required

See [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) for complete setup instructions, including:

1. Enable Email provider in Supabase dashboard
2. Create Google OAuth app + add to Supabase providers
3. Create Apple OAuth app (iOS only) + add to Supabase providers
4. Configure redirect URLs for native deep links and web domains
5. Run Prisma migration: `npx prisma migrate dev`

---

### Next Steps

1. **Create/update Supabase project** with email provider and OAuth apps
2. **Run Prisma migration** to add `email` column to User table
3. **Test authentication** on iOS simulator, Android emulator, and web (if applicable)
4. **(Optional) Implement password reset** using Supabase recovery link
5. **(Optional) Add profile picture upload** on username completion screen

---

### Notes

- **Phone OTP removed**: Old Expo router entries and screens (`verify.tsx`) have been deleted
- **Session persistence**: AsyncStorage handles native persistence; web uses browser storage
- **OAuth platform support**: Apple Sign-In only available on iOS; Android/web see it as disabled
- **Username is required for profile completion**: Can be set during registration or after OAuth
- **Email optional at registration**: Comes from OAuth provider if using social login
- **Error handling**: Authorization errors display in red text on auth screens via `authError` state
