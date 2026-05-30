"use client";

import { useMemo, useState } from "react";
import { useCRM } from "../store";
import { getStatusStyles } from "../utils";

const COLUMNS = ["Sourced", "Verified", "Submitted", "Interview", "Placed"];

export function PipelineView() {
  const { candidates, updateCandidate, setSelectedCandidateId, dropdowns } = useCRM();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const byStatus = useMemo(() => {
    const map: Record<string, typeof candidates> = {};
    for (const col of COLUMNS) map[col] = [];
    for (const c of candidates) {
      if (map[c.status]) map[c.status].push(c);
    }
    return map;
  }, [candidates]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (dragId && dragId !== status) {
      updateCandidate(dragId, { status });
    }
    setDragId(null);
    setOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    setOverCol(col);
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-8rem)]">
        {COLUMNS.map(col => (
          <div
            key={col}
            onDragOver={e => handleDragOver(e, col)}
            onDragLeave={() => setOverCol(null)}
            onDrop={e => handleDrop(e, col)}
            className={`flex flex-col shrink-0 w-64 rounded-xl border transition-colors ${
              overCol === col ? "border-ring bg-accent/20" : "border-border bg-muted/30"
            }`}
          >
            {/* Column header */}
            <div className="px-3 py-2.5 border-b border-border">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusStyles(col)}`}>{col}</span>
                <span className="text-xs text-muted-foreground font-medium">{byStatus[col]?.length ?? 0}</span>
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px]">
              {(byStatus[col] ?? []).map(c => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={e => handleDragStart(e, c.id)}
                  onClick={() => setSelectedCandidateId(c.id)}
                  className={`bg-card rounded-lg border border-border p-3 cursor-grab active:cursor-grabbing hover:border-ring hover:shadow-sm transition-all ${dragId === c.id ? "opacity-50 scale-95" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{c.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-1.5">{c.jobTitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{c.visa}</span>
                    <span className="text-xs text-muted-foreground">{c.exp}y exp</span>
                  </div>
                </div>
              ))}
              {(byStatus[col]?.length ?? 0) === 0 && (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg">
                  <p className="text-xs text-muted-foreground">Drop here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
