"use client";

import { useState } from "react";
import { useCRM } from "./store";
import { IconSearch, IconBell, IconPlus, IconCheck } from "./icons";

const VIEW_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  candidates: "Candidates",
  pipeline: "Pipeline",
  requisitions: "Requisitions",
  clients: "Clients & Vendors",
  submissions: "Submissions",
  reports: "Reports",
  settings: "Settings",
};

export function Header() {
  const {
    activeView,
    searchQuery, setSearchQuery,
    notifications, markAllNotificationsRead, markNotificationRead,
    setShowNewRecordModal, setNewRecordType,
  } = useCRM();

  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-background shrink-0">
      {/* Title */}
      <h1 className="text-base font-semibold text-foreground hidden sm:block mr-2 shrink-0">
        {VIEW_LABELS[activeView] ?? activeView}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search…"
          className="w-full h-8 pl-9 pr-3 rounded-md border border-input bg-muted/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Quick add */}
        <div className="relative group">
          <button
            onClick={() => {
              setNewRecordType("candidate");
              setShowNewRecordModal(true);
            }}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <IconPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <IconBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-80 bg-popover rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => { markAllNotificationsRead(); }}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <IconCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-4 py-6 text-center">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-accent/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                          <p className={`text-sm ${n.read ? "text-muted-foreground pl-4" : "text-foreground font-medium"}`}>{n.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
