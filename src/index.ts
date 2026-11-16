// Main Dashboard Component
export { AdminDashboard, type AdminDashboardProps } from "./components/admin/AdminDashboard";

// Shell Components
export { AdminLayout } from "./components/admin/shell/AdminLayout";
export { AdminSidebar } from "./components/admin/shell/AdminSidebar";
export { AdminHeader } from "./components/admin/shell/AdminHeader";

// View Components
export { OverviewView } from "./components/admin/overview/OverviewView";
export { CoursesView } from "./components/admin/courses/CoursesView";
export { CourseEditor } from "./components/admin/courses/CourseEditor";
export { LessonQuizEditor } from "./components/admin/courses/LessonQuizEditor";
export { CoursePacingSettings } from "./components/admin/courses/CoursePacingSettings";
export { WhatsAppPreview } from "./components/admin/courses/WhatsAppPreview";

export { FlowsView } from "./components/admin/flows/FlowsView";
export { FlowEditorView } from "./components/admin/flows/FlowEditorView";
export { FlowNodeCard } from "./components/admin/flows/FlowNodeCard";
export { NodeInspector } from "./components/admin/flows/NodeInspector";
export { FlowPreview } from "./components/admin/flows/FlowPreview";
export { FlowResponsesDialog } from "./components/admin/flows/FlowResponsesDialog";

export { ChatHistoryView } from "./components/admin/chat/ChatHistoryView";
export { AnalyticsView } from "./components/admin/analytics/AnalyticsView";
export { WhatsAppView } from "./components/admin/messaging/WhatsAppView";
export { TelegramView } from "./components/admin/messaging/TelegramView";
export { UsersView } from "./components/admin/users/UsersView";
export { SettingsView } from "./components/admin/settings/SettingsView";

// Context & State
export { AdminProvider, useAdmin, type AdminProviderProps } from "./context/AdminContext";

// Services & Mock Adapters
export {
  type IAdminService,
  MockAdminService,
  defaultAdminService,
} from "./services/adminService";

// Types
export * from "./types";

// Mock Data
export * from "./mock";

