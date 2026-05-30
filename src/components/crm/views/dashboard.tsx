"use client";

import { useMemo, useState } from "react";
import { useCRM } from "../store";
import { getStatusStyles, formatTimeAgo } from "../utils";
import { IconPlus, IconCheck, IconTrash } from "../icons";

export function DashboardView() {
  const { candidates, requisitions, submissions, activities, tasks, addTask, toggleTask, deleteTask, setActiveView } = useCRM();
  const [newTask, setNewTask] = useState("");

  const stats = useMemo(() => ({
    totalCandidates: candidates.length,
    activeReqs: requisitions.filter(r => r.status === "Active").length,
    pendingSubs: submissions.filter(s => s.status === "Pending").length,
    placed: candidates.filter(c => c.status === "Placed").length,
  }), [candidates, requisitions, submissions]);

  const pipelineData = useMemo(() => {
    const statusOrder = ["Sourced", "Verified", "Submitted", "Interview", "Placed"];
    return statusOrder.map(status => ({
      status,
      count: candidates.filter(c => c.status === status).length,
    }));
  }, [candidates]);

  const maxCount = Math.max(...pipelineData.map(d => d.count), 1);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask("");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Candidates", value: stats.totalCandidates, color: "text-foreground", onClick: () => setActiveView("candidates") },
          { label: "Active Requisitions", value: stats.activeReqs, color: "text-green-600 dark:text-green-400", onClick: () => setActiveView("requisitions") },
          { label: "Pending Submissions", value: stats.pendingSubs, color: "text-amber-600 dark:text-amber-400", onClick: () => setActiveView("submissions") },
          { label: "Placements", value: stats.placed, color: "text-blue-600 dark:text-blue-400", onClick: () => setActiveView("pipeline") },
        ].map(s => (
          <button
            key={s.label}
            onClick={s.onClick}
            className="text-left bg-card rounded-xl border border-border p-4 hover:border-ring transition-colors group"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Candidate Pipeline</h3>
          <div className="flex items-end gap-3 h-40">
            {pipelineData.map(d => (
              <div key={d.status} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-foreground">{d.count}</span>
                <div className="w-full rounded-t-md bg-primary/20 relative overflow-hidden" style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: 4 }}>
                  <div className="absolute inset-0 bg-primary" style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: 4 }} />
                </div>
                <span className="text-xs text-muted-foreground text-center truncate w-full">{d.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-card rounded-xl border border-border p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-3">Tasks</h3>
          <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Add a task…"
              className="flex-1 h-8 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <IconPlus className="w-4 h-4" />
            </button>
          </form>
          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-48">
            {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>}
            {tasks.map(task => (
              <div key={task.id} className="flex items-start gap-2 group">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${task.done ? "bg-primary border-primary" : "border-input hover:border-ring"}`}
                >
                  {task.done && <IconCheck className="w-3 h-3 text-primary-foreground" />}
                </button>
                <span className={`flex-1 text-xs ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</span>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 8).map(a => (
            <div key={a.id} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-accent-foreground">{a.actor.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{a.actor}</span>
                  {" "}{a.action}{" "}
                  <span className="font-medium">{a.targetName}</span>
                  {a.details && <span className="text-muted-foreground"> — {a.details}</span>}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(a.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
