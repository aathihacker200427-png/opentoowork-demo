"use client";

import { useCRM } from "./store";
import { useTheme } from "@/components/theme-provider";
import type { ViewType } from "./types";
import {
  IconDashboard, IconCandidates, IconPipeline, IconRequisitions,
  IconClients, IconSubmissions, IconReports, IconSettings,
  IconMenu, IconClose, IconSun, IconMoon, IconSignOut,
} from "./icons";

const NAV_ITEMS: { id: ViewType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", Icon: IconDashboard },
  { id: "candidates", label: "Candidates", Icon: IconCandidates },
  { id: "pipeline", label: "Pipeline", Icon: IconPipeline },
  { id: "requisitions", label: "Requisitions", Icon: IconRequisitions },
  { id: "clients", label: "Clients & Vendors", Icon: IconClients },
  { id: "submissions", label: "Submissions", Icon: IconSubmissions },
  { id: "reports", label: "Reports", Icon: IconReports },
  { id: "settings", label: "Settings", Icon: IconSettings },
];

export function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed, currentUser, logout } = useCRM();
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0 ${
        sidebarCollapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center h-14 px-3 border-b border-sidebar-border gap-2 ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
              <IconCandidates className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-sidebar-foreground truncate">OpenToWork</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors shrink-0"
        >
          {sidebarCollapsed ? <IconMenu className="w-4 h-4" /> : <IconClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              title={sidebarCollapsed ? label : undefined}
              className={`w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2 space-y-0.5">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
          className={`w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors ${sidebarCollapsed ? "justify-center" : ""}`}
        >
          {theme === "dark" ? <IconSun className="w-4 h-4 shrink-0" /> : <IconMoon className="w-4 h-4 shrink-0" />}
          {!sidebarCollapsed && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
        </button>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">{currentUser.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{currentUser.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
              title="Sign out"
            >
              <IconSignOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {sidebarCollapsed && (
          <button
            onClick={logout}
            title="Sign out"
            className="w-full flex items-center justify-center rounded-md px-2 py-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <IconSignOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
