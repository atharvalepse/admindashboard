import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/context/AdminContext";
import type { AdminSectionId } from "@/types";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart,
  MessageCircle,
  Settings,
  ChevronLeft,
  MessageSquare,
  Workflow,
  Sparkles,
} from "lucide-react";

interface NavItem {
  id: AdminSectionId;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export const AdminSidebar: React.FC = () => {
  const { activeSection, setActiveSection, chats } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  // Compute chats needing attention
  const attentionCount = chats.filter((c) => c.needs_attention).length;

  const navItems: NavItem[] = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "courses", name: "Courses", icon: BookOpen },
    { id: "flows", name: "Flow Canvas", icon: Workflow },
    {
      id: "chat",
      name: "Live Chat",
      icon: MessageCircle,
      badge: attentionCount > 0 ? attentionCount : undefined,
    },
    { id: "analytics", name: "Analytics", icon: BarChart },
    { id: "whatsapp", name: "WhatsApp Setup", icon: MessageSquare },
    { id: "telegram", name: "Telegram Bot", icon: MessageSquare },
    { id: "users", name: "Users & Roles", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0 select-none",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-sm">
            <Sparkles size={20} />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                MicroLearn
              </span>
              <span className="text-[11px] text-muted-foreground">Staff Admin</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={18}
            className={cn("transition-transform duration-300", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon size={19} className="shrink-0" />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.name}</span>
                  )}
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "text-[11px] font-bold px-1.5 py-0.5 rounded-full",
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : "bg-destructive text-destructive-foreground animate-pulse"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-border text-center">
        {!collapsed ? (
          <div className="text-[11px] text-muted-foreground">
            MicroLearn Admin UI Kit v1.0
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground font-mono">v1.0</div>
        )}
      </div>
    </aside>
  );
};
