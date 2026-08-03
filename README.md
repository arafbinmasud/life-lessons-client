[file-tag: code-generated-file-1-1779120681972117234]

```markdown
# 🌟 Digital Life Lesson — Client Side

An elegant, minimalist full-stack platform designed for sharing and discovering profound life lessons and personal philosophies. It brings people together through inspiring thoughts, professional content, and robust platform moderation.

## 🔗 **Live Site URL:** [https://digital-life-lesson-176c8.web.app/](https://digital-life-lesson-176c8.web.app/)

## ✨ Core Features

- **Premium Membership & Stripe Integration:** Users can instantly upgrade to a "Premium ⭐" account using a secure payment gateway, unlocking advanced platform badges and exclusive recognition.

- **Robust React Hook Form with Real-Time Profile Sync:** Seamless client-side profile customizer allowing users to dynamically modify their Display Name and Avatar Photo URLs with proactive `async/await` Firebase authentication state flushing.
- **Optimized Queries with TanStack Query (React Query):** Implements dynamic query keys to manage cache states across public, private, and flagged routes, providing automated background refetching without disruptive page refreshes.

---

## 🧪 Testing

Unit tests run on [Vitest](https://vitest.dev/) with React Testing Library and a jsdom environment (Node 22.12+ required).

```bash
npm test              # run the suite once
npm run test:watch    # watch mode
npm run test:coverage # text + html coverage report in coverage/
```

Tests live next to the code they cover as `*.test.jsx`; shared render helpers are in `src/test/utils.jsx`.

---

## 🛠️ Tech Stack Used

- **Core Framework:** React.js (Vite)
- **State & Data Fetching:** TanStack Query (React Query)
- **Form Management:** React Hook Form
- **Styling & UI:** Tailwind CSS + DaisyUI
- **Icons & Alerts:** React Icons, SweetAlert2
- **Data Visualization:** Recharts
- **Routing:** React Router DOM
- **Authentication & Hosting:** Firebase Auth & Firebase Hosting

---
```
