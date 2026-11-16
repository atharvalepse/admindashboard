import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <AdminHeader darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/50">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

