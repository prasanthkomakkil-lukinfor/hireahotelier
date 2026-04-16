# HireAHotelier.com — Complete Frontend

Direct hiring platform for hospitality professionals across GCC, Malaysia, Singapore & Australia.
No agents. No fees. No scams.

## Stack
React 18 + Vite · Firebase (Auth/Firestore/Storage/Functions) · LinkedIn OAuth · OpenAI · SendGrid · PWA

## Quick Start
```bash
npm install && cp .env.example .env   # Fill in Firebase config
npm run dev                           # http://localhost:3000
```

## Make a User Admin
Firebase Firestore → users/{uid} → set role: "admin" → visit /admin

## Deploy
```bash
npm run build && firebase deploy
```

See full documentation in the zip.
