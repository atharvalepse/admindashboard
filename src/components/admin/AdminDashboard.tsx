import React, { useState, useEffect } from "react";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { AdminLayout } from "./shell/AdminLayout";
import { OverviewView } from "./overview/OverviewView";
import { CoursesView } from "./courses/CoursesView";
import { FlowsView } from "./flows/FlowsView";
import { ChatHistoryView } from "./chat/ChatHistoryView";
import { AnalyticsView } from "./analytics/AnalyticsView";
import { WhatsAppView } from "./messaging/WhatsAppView";
import { TelegramView } from "./messaging/TelegramView";
import { UsersView } from "./users/UsersView";
import { SettingsView } from "./settings/SettingsView";
import type { IAdminService } from "@/services/adminService";
import type { AdminSectionId } from "@/types";

export interface AdminDashboardProps {
  service?: IAdminService;
  initialSection?: AdminSectionId;
  defaultDarkMode?: boolean;
}

const DashboardContent: React.FC<{ darkMode: boolean; onToggleDarkMode: () => void }> = ({
  darkMode,
  onToggleDarkMode,
}) => {
  const { activeSection, loading } = useAdmin();

  return (
    <AdminLayout darkMode={darkMode} onToggleDarkMode={onToggleDarkMode}>
      {loading ? (
        <div className="flex items-center justify-center p-20 text-muted-foreground text-sm">
          Loading platform data...
        </div>
      ) : (
        <>
          {activeSection === "overview" && <OverviewView />}
          {activeSection === "courses" && <CoursesView />}
          {activeSection === "flows" && <FlowsView />}
          {activeSection === "chat" && <ChatHistoryView />}
          {activeSection === "analytics" && <AnalyticsView />}
          {activeSection === "whatsapp" && <WhatsAppView />}
          {activeSection === "telegram" && <TelegramView />}
          {activeSection === "users" && <UsersView />}
          {activeSection === "settings" && <SettingsView />}
        </>
      )}
    </AdminLayout>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  service,
  initialSection = "overview",
  defaultDarkMode = false,
}) => {
  const [darkMode, setDarkMode] = useState(defaultDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <AdminProvider service={service} initialSection={initialSection}>
      <DashboardContent
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    </AdminProvider>
  );
};

