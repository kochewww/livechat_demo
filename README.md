# 📦 Live Chat Demo — Real-Time Messaging with Supabase & Next.js

A clean, production-ready demo of a **real-time chat** built with **Next.js**, **Supabase Realtime**, and a layered **Feature-Sliced Design (FSD)** architecture.

The goal is to provide a lightweight, fast, and well-structured example that demonstrates engineering approach, modularity, and architectural discipline.

---

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Realtime API, Postgres)
- **React 18**
- **TypeScript**
- **Feature-Sliced Design Architecture (FSD)**
- **CSS Modules / Tailwind** (depending on UI setup)

---

## 🎯 Key Features

### ✅ Realtime Messaging

- Live message stream powered by **Supabase Realtime**
- INSERT / DELETE events via dedicated subscriptions
- Zero-delay UI updates
- No polling or refresh needed

### ✅ Client-Side Username Generation

- Stable username stored via `sessionStorage`
- Fully isolated in `model/useUsername`

### ✅ Isolated Business Logic (Model Layer)

All logic is encapsulated inside the `model` layer:

- Chat context (state management)
- Username lifecycle
- Message formatting
- State transitions
- Event routing for realtime updates

No “smart UI components” — UI is 100% declarative.

### ✅ Clean API Layer

Feature exposes a dedicated API module:

- Manages realtime subscriptions
- Encapsulates Supabase client
- Exposes a small typed interface
- **No direct DB calls in components**

### ✅ Atomic & Clean UI

UI components have zero side effects:

- `ChatHeader`
- `ChatMessages`
- `ChatMessage`
- `ChatInput`
- `ErrorBanner`

Each component renders data only — logic lives elsewhere.

### ✅ Environment-Safe Configuration

- All Supabase env variables resolved on build
- Sensitive keys intentionally shipped for demo simplicity
- No server dependency required

---

## 🧱 Architecture (Feature-Sliced Design)

src/
features/
chat/
api/ # supabase realtime integration
model/ # context, hooks, business logic
ui/ # pure UI components
lib/ # utilities
app/
page.tsx # composition root

yaml
Copy code

### Why FSD?

Because it:

- Scales horizontally (add more features — same structure)
- Separates business logic from UI
- Eliminates prop drilling
- Allows swapping API or UI without touching model logic
- Makes onboarding extremely fast

---

## ⚙️ Internal Mechanics

### 1️⃣ Chat Context

Manages:

- Connection status
- Message history
- Realtime event routing
- Optional optimistic UI

### 2️⃣ Subscriptions

Located in:

features/chat/api/chat.api.ts

Each Supabase event → mapped to model callback → transforms state → UI updates via context.

## 🏗️ Running the Project

```bash
npm install
npm run dev
Requires environment variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Yes — .env is pushed to production intentionally to keep the demo trivial to launch and evaluate.

🧪 Testing & Debugging

Realtime events appear immediately in the console

Open multiple tabs/windows to simulate multiple users





```
