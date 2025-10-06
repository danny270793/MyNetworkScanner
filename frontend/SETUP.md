# Frontend Setup Guide

## Prerequisites

1. Node.js installed (v18 or higher)
2. A Supabase account and project

## Supabase Setup

Before running the frontend, you need to set up authentication in your Supabase project:

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be provisioned

### 2. Get Your Credentials

1. Go to Project Settings > API
2. Copy your Project URL
3. Copy your anon/public key

### 3. Configure Email Authentication

1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates if desired

## Frontend Configuration

### 1. Create Environment File

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

### 2. Update Environment Variables

Edit the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `https://your-project.supabase.co` with your actual Supabase project URL
- `your-anon-key-here` with your actual anon/public key

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- **Login Page** (`/login`) - Sign in with email and password
- **Register Page** (`/register`) - Create a new account
- **Home Page** (`/`) - Protected route, requires authentication

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx    # Route protection component
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context & hooks
│   ├── lib/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── pages/
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── Home.tsx             # Home page (protected)
│   │   ├── Auth.css             # Shared auth styles
│   │   └── Home.css             # Home page styles
│   ├── App.tsx                  # Main app with routing
│   └── main.tsx                 # Entry point
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment variables template
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### "Missing Supabase environment variables" error

Make sure you've created the `.env` file with the correct Supabase credentials.

### Email confirmation required

By default, Supabase requires email confirmation. You can disable this in:
- Authentication > Settings > Enable email confirmations (toggle off)

Or check the email sent to your inbox for the confirmation link.

### CORS errors

Make sure your Supabase project allows requests from your frontend URL:
- Project Settings > API > Site URL
- Add `http://localhost:5173` for development

## Next Steps

- Customize the Home page with network scanning features
- Add more protected routes as needed
- Integrate with the backend network scanner
- Add user profile management
- Implement password reset functionality

