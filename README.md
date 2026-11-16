# MicroLearn Admin Dashboard UI Kit

A standalone, framework-agnostic **Admin Dashboard & Studio UI Kit** extracted from [MicroLearn](https://github.com/iabheejit/microlearn).

Designed for modern React (18/19), **Tailwind CSS v4**, **Radix UI / Shadcn**, **@xyflow/react** (React Flow 12), and **Recharts**. Fully decoupled from backend dependencies with ready-to-use mock data and pluggable service adapters.

---

## 🌟 Included Admin Modules

1. **Dashboard Overview** (`/overview`):
   - Executive KPI cards (Learners, Published Courses, Completion Rate, Message Delivery).
   - Real-time 14-day & 30-day activity trend charts (`Recharts`).
   - Platform channel distribution (WhatsApp, Telegram, Web).
   - Quick action shortcuts and recent courses table.

2. **Course Management & Lesson Quiz Editor** (`/courses`):
   - Multi-day course authoring with rich text paragraphs.
   - **Lesson Quiz Editor**: 2–4 answer choices, correct option validation, and feedback explanations.
   - **Course Pacing Settings**: Self-paced (immediate), daily fixed-time (e.g. 09:00 AM in timezone), or completion cooldown.
   - **Live WhatsApp Simulator**: Real-time phone simulator showing how lesson text, buttons, and quizzes appear to a student on WhatsApp.

3. **WhatsApp Flow Canvas** (`/flows`):
   - Visual flow designer built on **@xyflow/react** (React Flow).
   - Custom node types: `Trigger`, `Message` (with interactive buttons), `Ask Question` (with format validators), `Condition`, `Action`, `Delay`, and `Meta Template`.
   - Slide-over `NodeInspector` to edit properties of any selected node.
   - Built-in **Flow Test Simulator** to walk through the conversation flow before publishing.
   - **Flow Responses Modal** with CSV export for captured learner answers.

4. **Omnichannel Live Chat History** (`/chat`):
   - Unified inbox for WhatsApp and Telegram.
   - Search, platform filters, and "Needs Attention" overdue flags.
   - **Meta 24-Hour Reply Window Guard**: Visual countdown and banner distinguishing between free-form messaging (window open) and required Meta utility templates (window closed).
   - Interactive message composer with **Meta Template Picker**.

5. **Analytics & Velocity** (`/analytics`):
   - Learner engagement & completion curves.
   - Message velocity (outbound lessons vs inbound answers).
   - Channel breakdown and completion ratios.

6. **Channel Settings & Templates** (`/whatsapp` & `/telegram`):
   - WhatsApp Business Account (WABA) connection status.
   - Approved Meta message templates catalog with categories (Utility, Marketing).
   - Meta template submission dialog.
   - Auto-reply fallback and cooldown configuration.
   - Telegram bot token tester and webhook status.

7. **Users & Permissions** (`/users`):
   - User roster with search and role filters (Admin, Instructor, Learner).
   - Instant role updates and user suspension toggles.
   - User invitation modal.

8. **Platform Settings** (`/settings`):
   - Organization profile, staff credentials, notification toggles, and webhook URLs.

---

## 🚀 Quick Start (Running Standalone)

```bash
# Navigate to the directory
cd microlearn-admin-ui

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
```

Visit `http://localhost:3000` to interact with the full dashboard out-of-the-box.

---

## 📦 How to Use in Your Next GitHub Repo

### Option 1: Drop-in as a Ready-Made Template
Clone or copy this folder as the root of your new repository. It comes with Vite, Tailwind CSS v4, TypeScript, and a working demo app.

### Option 2: Copy into an Existing Next.js / Vite / Remix Project
Copy the following folders into your existing project:
```
src/
├── components/
│   ├── admin/       # Complete dashboard views and shell
│   └── ui/          # Shadcn / Radix UI primitives
├── context/         # AdminContext and useAdmin hook
├── services/        # Service interfaces (IAdminService)
├── types/           # Domain TypeScript definitions
└── mock/            # Realistic fallback mock datasets
```

Render the dashboard anywhere in your page or layout:
```tsx
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return <AdminDashboard defaultDarkMode={false} />;
}
```

### Option 3: Connect to a Real Backend (Supabase / REST / GraphQL)
All data operations are decoupled through the `IAdminService` interface in `src/services/adminService.ts`.

To connect to your own backend, create a class implementing `IAdminService`:
```tsx
import type { IAdminService, Course, Flow, ChatConversation, ... } from "@/types";

export class MyCustomBackendService implements IAdminService {
  async getOverview() {
    const res = await fetch("/api/admin/overview");
    return res.json();
  }

  async listCourses(): Promise<Course[]> {
    const res = await fetch("/api/admin/courses");
    return res.json();
  }

  async saveCourse(course: Course): Promise<Course> {
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify(course),
    });
    return res.json();
  }

  // Implement remaining methods...
}
```

Then supply your custom service to `<AdminDashboard>`:
```tsx
const customService = new MyCustomBackendService();

<AdminDashboard service={customService} />
```

---

## 🎨 Theme & Dark Mode

The UI supports instant Light and Dark modes using Tailwind CSS variables configured in `src/styles.css`.
Click the sun/moon toggle in the top bar to switch themes, or pass `defaultDarkMode={true}` to `AdminDashboard`.

