# Authentication Implementation - Next Steps

## 1. Supabase Dashboard Configuration

### Email Provider

1. Navigate to **Authentication > Providers > Email**
2. Enable **Email** provider
3. Choose **Email Confirmation**:
   - **Development**: Disable email confirmation for faster testing
   - **Production**: Enable and configure SMTP for actual email delivery
4. Save

### Google OAuth

1. Create Google OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. In Supabase: **Authentication > Providers > Google**
3. Enable and paste **Client ID**
4. Save

### Apple OAuth (iOS)

1. Create Apple app + Services ID in [Apple Developer Console](https://developer.apple.com/account/)
2. In Supabase: **Authentication > Providers > Apple**
3. Enable and fill: **Team ID**, **Client ID**, **Key ID**, **Certificate**
4. Save

### Redirect URLs

In Supabase: **Authentication > URL Configuration**

- Add: `http://localhost:3000` (for web testing)
- Add: `starterkitexpo://auth/callback` (for native deep linking)
- Add production domain when ready

See [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) for detailed step-by-step instructions.

---

## 2. Database Migration

Run the Prisma migration to add `email` column to the User table:

```bash
npx prisma migrate dev --name add_email_to_user
```

This will:

1. Create a migration file
2. Apply it to your development database
3. Update `lib/generated/prisma` types

---

## 3. Environment Setup

Confirm your `.env` file has:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 4. Run the App

Start development server:

```bash
npm start
```

Then choose:

- **i** for iOS simulator
- **a** for Android emulator
- **w** for web (http://localhost:8081)

---

## 5. Test All Auth Flows

### Test 1: Email Registration

1. Tap **"New here? Create an account"** link on login screen
2. Enter email: `newuser@example.com`
3. Enter password: `Test123!@`
4. Tap **Create Account**
5. **If email confirmation enabled**:
   - Go to Supabase **Authentication > Users**, find your test user
   - Manually set `email_confirmed_at` to current time, or
   - Check email for confirmation link (if SMTP configured)
6. Enter username: `testuser`
7. Tap **Continue**
8. ✅ Should see **Home** screen with your username in avatar

### Test 2: Email Login

1. Restart app or tap **Sign Out** from Profile
2. On login screen, enter same email/password
3. Tap **Log In**
4. ✅ Should skip username screen and go directly to **Home** (username already exists)

### Test 3: Google OAuth

1. On login or register screen, tap **Google** button
2. A browser window opens with Google sign-in
3. Sign in with a Google account
4. App redirects back
5. Enter username you choose
6. Tap **Continue**
7. ✅ Should see **Home** screen

### Test 4: Apple OAuth (iOS only)

1. On login or register screen (iOS only), tap **Apple** button
2. Face ID / passcode prompt
3. Review Apple sign-in permissions sheet
4. Tap **Continue**
5. App redirects back
6. Enter username you choose
7. Tap **Continue**
8. ✅ Should see **Home** screen

### Test 5: Session Persistence

1. After logging in successfully
2. Kill and relaunch the app (or use simulator menu: **Device > Lock**)
3. ✅ App should restore session and show **Home** screen immediately (no login required)

### Test 6: Logout

1. While on **Home** screen, tap **Profile** tab
2. Tap **Sign Out**
3. ✅ Should return to **Login** screen with clean state

---

## 6. Troubleshooting

### "Invalid Client" or OAuth Button Does Nothing

- Verify Client ID and Secret are correctly copied to Supabase provider config
- Check Supabase dashboard shows provider as "Enabled"

### Stuck on Username Screen After OAuth

- Check browser console for errors
- Manually create user profile via Supabase Studio or direct update

### Email Confirmation Not Sending

- For development: disable confirmation in Supabase provider settings
- For production: ensure SMTP is configured in Supabase

### Cannot Navigate Back from Register to Login

- Use the **"Already have an account? Log in"** link at bottom of register screen

### DeepLink Not Intercepting OAuth Callback

- On iOS: restart simulator via **Device > Erase All Content and Settings**
- On Android: ensure `starterkitexpo` deep link scheme is registered

---

## 7. Optional Enhancements

Once core auth flows work:

### Add Password Reset

In Supabase auth: **Email Templates** > customize password reset email
Then implement in app:

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

### Add Profile Avatar Upload

After username completion, show image picker to user profile

### Add Account Email Update

On Profile screen, allow user to update their email

---

## 8. Production Readiness

Before deploying to production:

- [ ] Email confirmation **enabled** in Supabase
- [ ] SMTP configured for production email delivery
- [ ] Google OAuth credentials created with production domain
- [ ] Apple OAuth credentials with production domain and team ID
- [ ] Redirect URLs configured for production domain in Supabase
- [ ] Database migration: `npx prisma migrate deploy`
- [ ] Test all flows on real iOS and Android devices
- [ ] Test OAuth flows with production credentials
- [ ] Set up monitoring/alerts for auth failures

---

## 9. Key Files Reference

| File                                                                                 | Purpose                                 |
| ------------------------------------------------------------------------------------ | --------------------------------------- |
| [lib/auth/supabaseAuth.ts](./lib/auth/supabaseAuth.ts)                               | Email/Password + OAuth Supabase methods |
| [lib/auth/profile.ts](./lib/auth/profile.ts)                                         | User profile query/create/update        |
| [provider/AuthProvider.tsx](./provider/AuthProvider.tsx)                             | App-level auth state machine + routing  |
| [screens/auth/index.tsx](./screens/auth/index.tsx)                                   | Login screen                            |
| [screens/auth/register.tsx](./screens/auth/register.tsx)                             | Register screen                         |
| [screens/auth/username.tsx](./screens/auth/username.tsx)                             | Username setup screen                   |
| [components/auth/EmailPasswordFields.tsx](./components/auth/EmailPasswordFields.tsx) | Reusable email/password form            |
| [components/auth/OAuthButtons.tsx](./components/auth/OAuthButtons.tsx)               | Google + Apple OAuth buttons            |
| [AUTH_MIGRATION_SUMMARY.md](./AUTH_MIGRATION_SUMMARY.md)                             | Technical migration details             |
| [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md)                                   | Detailed Supabase configuration guide   |

---

## Questions?

Refer to:

1. [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) for Supabase dashboard configuration
2. [AUTH_MIGRATION_SUMMARY.md](./AUTH_MIGRATION_SUMMARY.md) for technical architecture details
3. [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
