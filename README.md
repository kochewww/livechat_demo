📦 Live Chat Demo — Real-Time Messaging with Supabase & Next.js

This project is a clean and production-ready demo of a real-time chat built with Next.js, Supabase Realtime, and a layered Feature-Sliced Design (FSD) architecture.

The goal was to create a lightweight, fast, and well-structured implementation that clearly demonstrates engineering approach, modularity, and architectural discipline — not just a UI toy.

🚀 Tech Stack

Next.js 14 (App Router)

Supabase (Realtime API, Postgres)

React 18

TypeScript

Feature-Sliced Design Architecture (FSD)

CSS Modules / Tailwind (optional depending on your UI setup)

🎯 Key Features
✅ Realtime Messaging

Live message stream powered by Supabase Realtime.

Insert/delete events handled through dedicated subscriptions.

Zero-delay UI updates without polling.

✅ Client-Side Username Generation

Stable username generated once & persisted via sessionStorage.

Override via ?user= query param for debugging/testing.

Fully isolated inside model/useUsername.

✅ Isolated Business Logic

All application logic is encapsulated inside the model layer:

Context state management (ChatContext)

Username lifecycle

Message formatting

State transitions

Event routing for realtime updates

No “smart UI components” — all UI relies purely on exposed model APIs.

✅ Clean API Layer

Feature exposes a dedicated api module:

Handles realtime subscriptions

Encapsulates Supabase client

Exposes a minimal and typed interface for the UI & model

No direct DB calls inside components.

✅ Atomic & Clean UI

UI is completely dumb and stable:

ChatHeader

ChatMessages

ChatMessage

ChatInput

ErrorBanner

All components render only the data they receive — no internal side effects.

✅ Environment-Safe Configuration

All Supabase environment variables resolved on build.
Sensitive keys stored locally and shipped only for demo purposes.

🧱 Architecture (Feature-Sliced Design)

The app follows a strict FSD structure:

src/
features/
chat/
api/ → supabase realtime integration
model/ → business logic, context, hooks, types
ui/ → presentation layer only
lib/ → utilities
app/
page.tsx → composition root

Why this architecture?

Because it:

Scales horizontally (more features → same structure)

Separates business logic from UI

Eliminates prop drilling

Allows replacing API or UI without touching model logic

Makes codebase easy to onboard for any engineer

⚙️ How It Works Internally
1️⃣ ChatContext manages:

connection status

message history

event routing for INSERT/DELETE

optimistic UI (optional)

2️⃣ Subscriptions

Located in chat/api/chat.api.ts:

each event is mapped to a model callback

model decides how state transforms

UI rerenders automatically through context

3️⃣ Username System

model/useUsername.ts:

query param override → sessionStorage → generated fallback

stable across refreshes

no server dependency

🏗️ Running the Project
npm install
npm run dev

Requires:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Yes, .env is pushed to production intentionally — keeps the demo trivial to launch and evaluate.

🧪 Testing & Debugging

Realtime events appear instantly in DevTools logs.

Chat can run in multiple tabs/windows to demo synchronization.
