import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { Sun, Moon, Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackendConnectionModal } from "./BackendConnectionModal";

interface AdminHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const SECTION_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "Overview",
    subtitle: "High-level learner activity, course completion, and message metrics",
  },
  courses: {
    title: "Course Management",
    subtitle: "Create, structure, and publish multi-day courses with automated quizzes",
  },
  certificates: {
    title: "Certificates & Credentials",
    subtitle: "Generate, verify, and send completion certificates directly to WhatsApp",
  },
  flows: {
    title: "WhatsApp Flow Canvas",
    subtitle: "Visually design interactive conversation bots, keyword triggers, and fallbacks",
  },
  chat: {
    title: "Live Chat History",
    subtitle: "Omnichannel learner inbox with Meta 24-hour reply window enforcement",
  },
  analytics: {
    title: "Analytics & Insights",
    subtitle: "Engagement trends, completion rates, and delivery statistics",
  },
  whatsapp: {
    title: "WhatsApp Integration",
    subtitle: "WABA connection, approved Meta utility templates, and auto-replies",
  },
  telegram: {
    title: "Telegram Bot Setup",
    subtitle: "Manage Telegram bot token, webhook endpoints, and delivery tester",
  },
  users: {
    title: "Users & Roles",
    subtitle: "Manage team permissions (Admin, Instructor) and learner enrollments",
  },
  settings: {
    title: "Platform Settings",
    subtitle: "Branding, credentials, notification preferences, and system parameters",
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
}) => {
  const { activeSection, refreshData, loading } = useAdmin();
  const info = SECTION_TITLES[activeSection] || {
    title: "Admin Dashboard",
    subtitle: "Enterprise Micro-learning operations",
  };

  return (
    <header className="h-16 px-6 border-b border-border bg-card flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          {info.title}
        </h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          {info.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <BackendConnectionModal />

        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshData()}
          disabled={loading}
          className="gap-2 h-9 text-xs"
          title="Refresh Data"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span className="hidden md:inline">Refresh</span>
        </Button>

        <button
          onClick={onToggleDarkMode}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
            AS
          </div>
          <div className="flex flex-col text-left hidden lg:block">
            <span className="text-xs font-semibold text-foreground leading-tight">
              Aarav Sharma
            </span>
            <span className="text-[10px] text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

