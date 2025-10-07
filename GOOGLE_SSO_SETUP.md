# Google SSO Setup Guide

This guide will walk you through setting up Google Single Sign-On (SSO) for your Next.js application using Supabase Auth.

## Step-by-Step Configuration

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: `Your App Name SSO`
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" user type
     - Fill in required fields:
       - App name: `Your App Name`
       - User support email: your email
       - Developer contact: your email
     - Add scopes: `email`, `profile`, `openid`
     - Add test users (your email) if in testing mode

5. **Configure OAuth Client**
   - Application type: "Web application"
   - Name: `Your App Name Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)
     - `https://your-project-id.supabase.co/auth/v1/callback` (Supabase callback)

6. **Get Your Credentials**
   - After creating, you'll see a popup with:
     - Client ID: `your-google-client-id.googleusercontent.com`
     - Client Secret: `your-google-client-secret`
   - Save these values securely

### 2. Supabase Dashboard Configuration

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Navigate to Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Providers" tab

3. **Configure Google Provider**
   - Find "Google" in the list and click the toggle to enable it
   - Enter your Google OAuth credentials:
     - **Client ID**: `your-google-client-id.googleusercontent.com`
     - **Client Secret**: `your-google-client-secret`
   - Click "Save"

4. **Configure Site URL**
   - In Authentication > Settings
   - Set Site URL to: `http://localhost:3000` (development) or `https://yourdomain.com` (production)
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`

### 3. Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Supabase Configuration (already exists)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Note: Google OAuth credentials are configured directly in Supabase dashboard
# No additional environment variables needed for Google OAuth
```

### 4. Database Schema Update

The existing schema already supports user authentication with the `user_id` field in the `api_keys` table. No additional changes are needed.

### 5. Testing the Implementation

1. **Start your development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Test the login flow**
   - Go to `http://localhost:3000`
   - Click the "Sign in with Google" button
   - You should be redirected to Google's OAuth consent screen
   - After authorization, you'll be redirected back to `/dashboards`

3. **Verify user data**
   - Check that user information appears in the dashboard
   - Verify that the user can sign out and sign back in

### 6. Production Deployment

1. **Update Google OAuth Settings**
   - Add your production domain to authorized origins and redirect URIs
   - Update OAuth consent screen if needed

2. **Update Supabase Settings**
   - Change Site URL to your production domain
   - Update redirect URLs

3. **Update Environment Variables**
   - Set production values in your deployment platform (Vercel, Netlify, etc.)

## Features Implemented

✅ **Google OAuth Integration**: Complete SSO flow with Supabase Auth
✅ **Authentication Context**: React context for managing auth state
✅ **Login Button**: Styled Google sign-in button with loading states
✅ **Protected Routes**: Automatic redirect for unauthenticated users
✅ **User Profile**: Display user information and avatar
✅ **Session Management**: Automatic token refresh and session persistence
✅ **Error Handling**: Comprehensive error handling and user feedback

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context and provider
├── components/
│   └── auth/
│       ├── LoginButton.tsx      # Google sign-in button component
│       └── ProtectedRoute.tsx   # Route protection wrapper
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts         # OAuth callback handler
│   ├── dashboards/
│   │   └── page.tsx            # Protected dashboard with user info
│   ├── layout.tsx              # Root layout with AuthProvider
│   └── page.tsx                # Home page with login button
```

## Security Considerations

- ✅ OAuth 2.0 with PKCE for secure authentication
- ✅ HTTPS required in production
- ✅ Row Level Security (RLS) enabled in Supabase
- ✅ Environment variables for sensitive data
- ✅ Automatic session management and token refresh
- ✅ Protected routes prevent unauthorized access

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure redirect URIs match exactly in Google Console and Supabase
   - Check for trailing slashes and protocol (http vs https)

2. **"Client ID not found" error**
   - Verify Google Client ID is correct in Supabase dashboard
   - Check environment variables are properly set

3. **User not redirected after login**
   - Check Supabase Site URL configuration
   - Verify callback route is working

4. **Session not persisting**
   - Ensure Supabase client is properly configured
   - Check browser console for authentication errors

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test Supabase connection in dashboard
4. Check Google OAuth consent screen configuration
5. Verify redirect URIs match exactly

## Next Steps

After successful setup, you can:

1. **Customize the UI**: Modify the login button styling and user profile display
2. **Add more providers**: Implement other OAuth providers (GitHub, Discord, etc.)
3. **User management**: Add user settings, profile editing, account deletion
4. **Role-based access**: Implement different user roles and permissions
5. **Analytics**: Track user authentication events and usage patterns
