"use client";

import { useMemo } from "react";
import { useCRM } from "../store";
import { getStatusStyles } from "../utils";

export function ReportsView() {
  const { candidates, requisitions, submissions, clients, activities } = useCRM();

  const metrics = useMemo(() => {
    const placed = candidates.filter(c => c.status === "Placed").length;
    const totalCandidates = candidates.length;
    const activeReqs = requisitions.filter(r => r.status === "Active").length;
    const acceptedSubs = submissions.filter(s => s.status === "Accepted").length;
    const totalSubs = submissions.length;
    const placementRate = totalCandidates > 0 ? Math.round((placed / totalCandidates) * 100) : 0;
    const acceptanceRate = totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 100) : 0;

    const avgRate = submissions.length > 0
      ? Math.round(submissions.reduce((s, x) => s + x.rate, 0) / submissions.length)
      : 0;

    const byStatus = candidates.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byVisa = candidates.reduce((acc, c) => {
      acc[c.visa] = (acc[c.visa] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clientCounts = clients.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { placed, totalCandidates, activeReqs, acceptedSubs, totalSubs, placementRate, acceptanceRate, avgRate, byStatus, byVisa, clientCounts };
  }, [candidates, requisitions, submissions, clients]);

  const statCard = (label: string, value: string | number, sub?: string) => (
    <div className="bg-card rounded-xl border border-border p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCard("Total Candidates", metrics.totalCandidates)}
        {statCard("Placement Rate", `${metrics.placementRate}%`, `${metrics.placed} placed`)}
        {statCard("Submission Acceptance", `${metrics.acceptanceRate}%`, `${metrics.acceptedSubs}/${metrics.totalSubs} accepted`)}
        {statCard("Avg Bill Rate", `$${metrics.avgRate}/hr`)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Candidates by Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Candidates by Status</h3>
          <div className="space-y-2">
            {Object.entries(metrics.byStatus).map(([status, count]) => {
              const pct = metrics.totalCandidates > 0 ? (count / metrics.totalCandidates) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyles(status)}`}>{status}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visa Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Visa Distribution</h3>
          <div className="space-y-2">
            {Object.entries(metrics.byVisa).map(([visa, count]) => {
              const pct = metrics.totalCandidates > 0 ? (count / metrics.totalCandidates) * 100 : 0;
              return (
                <div key={visa}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground">{visa}</span>
                    <span className="text-xs text-muted-foreground">{count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-chart-2 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clients & Vendors */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Clients & Vendors</h3>
          <div className="space-y-3">
            {Object.entries(metrics.clientCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{type}s</span>
                <span className="text-xl font-bold text-foreground">{count}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Requisitions</span>
                <span className="text-xl font-bold text-foreground">{metrics.activeReqs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent placements */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity Log</h3>
        <div className="space-y-2">
          {activities.slice(0, 10).map(a => (
            <div key={a.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent-foreground">{a.actor.charAt(0)}</span>
              </div>
              <p className="flex-1 text-xs text-foreground">
                <span className="font-medium">{a.actor}</span>{" "}{a.action}{" "}
                <span className="font-medium">{a.targetName}</span>
                {a.details && <span className="text-muted-foreground"> — {a.details}</span>}
              </p>
              <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
