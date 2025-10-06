# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Set Up Environment Variables

Create a `.env` file:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 2. Install & Run

```bash
npm install
npm run dev
```

### 3. Open Browser

Visit: http://localhost:5173

## 📝 Test the App

1. **Register** - Create a new account at `/register`
2. **Check Email** - Verify your account (if email confirmation is enabled)
3. **Login** - Sign in at `/login`
4. **Home** - View your protected dashboard at `/`

## 🔑 Routes

- `/login` - Login page (public)
- `/register` - Registration page (public)  
- `/` - Home dashboard (protected)

Protected routes automatically redirect to `/login` if not authenticated.

## ⚡ Features

✅ Email/Password Authentication  
✅ Protected Routes  
✅ Auto-redirect on login/logout  
✅ Loading states  
✅ Error handling  
✅ Beautiful UI with gradients  
✅ Responsive design  

## 🎨 Tech Stack

- React 19
- TypeScript
- React Router v7
- Supabase Auth
- Vite
- CSS3

## 📚 More Details

See [SETUP.md](./SETUP.md) for detailed configuration and troubleshooting.

