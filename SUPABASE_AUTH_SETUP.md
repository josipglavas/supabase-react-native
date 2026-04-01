# Supabase Auth Migration - Setup Guide

This document outlines the required Supabase configuration steps to complete the email/password and OAuth authentication setup.

## Prerequisites

- Supabase project created and EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY in `.env`
- User table in Postgres with schema matching [prisma/schema.prisma](prisma/schema.prisma)

## 1. Email/Password Authentication

### Enable Password Auth in Supabase Dashboard

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Set **Email Confirmation**:
   - Choose either **Confirm email** (recommended for production) or **No confirmation** (for development)
4. Save changes

### Configure Email Templates (Optional)

1. Go to **Authentication > Email Templates**
2. Customize the confirmation and password reset emails as desired
3. Default templates are sufficient for testing

---

## 2. Google OAuth Setup

### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
5. Choose **Android** or **Web** depending on your needs

#### For Android:

- Get your app's SHA-1 fingerprint:
  ```bash
  cd android && ./gradlew signingReport
  ```
- Add SHA-1 fingerprint to Google Cloud Console
- Generate client ID and copy it

#### For Web:

- Create a Web application credential
- Set authorized redirect URIs (see section 3 below)
- Save the Client ID and Secret

#### For iOS:

- You may not need iOS-specific credentials for Google OAuth with Supabase

### B. Configure in Supabase Dashboard

1. Go to **Authentication > Providers > Google**
2. Enable the provider
3. Paste **Client ID**
4. Paste **Client Secret** (if you have it)
5. Save changes

---

## 3. Apple OAuth Setup

### A. Create Apple Sign-In Credentials

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. **Certificates, Identifiers & Profiles > Identifiers**
3. Create a new **App ID** with Sign in with Apple capability
4. Create a **Services ID** linked to your App ID
5. Register a **Domain** for your service
6. Generate and download the private key for the Services ID

### B. Configure in Supabase Dashboard

1. Go to **Authentication > Providers > Apple**
2. Enable the provider
3. Fill in:
   - **Team ID** (from Apple Developer Account)
   - **Client ID** (Services ID)
   - **Key ID** (from downloaded key)
   - **Certificate** (private key content)
4. Save changes

---

## 4. Configure OAuth Redirect URLs

### A. For Web Platform

In Supabase Dashboard, go to **Authentication > URL Configuration**:

- Add your app's production URL (e.g., `https://yourapp.com`)
- Redirect URL for OAuth: `https://yourapp.com/auth/callback`

### B. For Native (iOS/Android)

iOS and Android apps use deep linking. Supabase handles this via the scheme:

- **Redirect URL**: `starterkitexpo://auth/callback`

The app is already configured to handle this in [lib/auth/supabaseAuth.ts](lib/auth/supabaseAuth.ts).

---

## 5. Database Migration

Run Prisma migration to add the `email` column to User table:

```bash
npx prisma migrate dev --name add_email_to_user
```

This creates a migration and applies it to your development database.

---

## 6. Environment Variables

Ensure your `.env` file has:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

No additional OAuth environment variables are needed—Supabase handles provider configuration via the dashboard.

---

## 7. Testing the Auth Flow

### Email/Password (Local Testing)

1. Start the app: `npm start` or `npm run ios` / `npm run android`
2. On **Login screen**:
   - Enter email: `test@example.com`
   - Enter password: `Test123!@`
   - Tap **Log In**
3. If email confirmation is required, check your email and confirm
4. On first login with new email:
   - You'll be directed to **Choose username** screen
   - Enter a username and tap **Continue**
   - You should be redirected to the **Home** (tabs) screen
5. On subsequent logins:
   - Existing username skips the username screen and goes directly to **Home**

### Register (Local Testing)

1. Tap **"New here? Create an account"**
2. Enter email and password
3. Tap **Create Account**
4. Follow same flow as above starting at username creation

### OAuth (iOS Simulator / Android Emulator)

#### Google Sign-In

1. Tap **Google** button on Login or Register screen
2. A browser window opens with Google login
3. Sign in with your Google account
4. Browser redirects back to app
5. App creates profile + shows username screen
6. Enter username and continue to **Home**

#### Apple Sign-In

1. Tap **Apple** button (iOS only; Android shows "Apple (iOS)" disabled)
2. A sheet appears with Apple login
3. Complete Face ID / passcode verification
4. App creates profile + shows username screen
5. Enter username and continue to **Home**

---

## 8. Production Checklist

- [ ] Email confirmation enabled in Supabase
- [ ] Google OAuth credentials created and added to Supabase
- [ ] Apple OAuth credentials created and added to Supabase (if supporting iOS)
- [ ] Redirect URLs configured in Supabase for your production domain
- [ ] Database migration run: `npx prisma migrate deploy`
- [ ] `.env` variables set for production Supabase project
- [ ] Test all three auth flows (email + Google + Apple) on real device or production simulator
- [ ] SSL certificate valid for OAuth redirect domain

---

## Troubleshooting

### OAuth Flow Opens Browser but Doesn't Close

- Ensure `starterkitexpo://auth/callback` is registered in Supabase redirect URLs
- On native platforms, deep linking may require app. scheme configuration in `app.json`

### Email Confirmation Not Arriving

- Check spam folder
- Ensure SMTP settings are configured in Supabase **Email Templates** section
- For development, you can disable confirmation in Supabase dashboard

### User Stuck on Username Screen

- Manually run: `UPDATE "User" SET username = 'myusername' WHERE id = 'user-id'` in Supabase
- Then restart app

### OAuth Shows Invalid Client ID

- Verify Client ID and Secret are correctly copied to Supabase provider config
- Check that OAuth credentials are enabled in respective provider dashboards (Google Cloud, Apple Developer)

---

## References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Apple OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
