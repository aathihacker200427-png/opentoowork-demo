"use client";

import { useMemo } from "react";
import { useCRM } from "../store";
import { getStatusStyles } from "../utils";
import { IconPlus, IconFilter, IconStar } from "../icons";

export function CandidatesView() {
  const {
    candidates, searchQuery,
    setSelectedCandidateId,
    setShowNewRecordModal, setNewRecordType,
    dropdowns,
  } = useCRM();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return candidates;
    return candidates.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.jobTitle.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q) ||
      c.visa.toLowerCase().includes(q)
    );
  }, [candidates, searchQuery]);

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1" />
        <button
          onClick={() => { setNewRecordType("candidate"); setShowNewRecordModal(true); }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Stats pills */}
      <div className="flex gap-2 flex-wrap">
        {dropdowns.status.map(s => {
          const count = candidates.filter(c => c.status === s).length;
          return (
            <span key={s} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(s)}`}>
              {s} <span className="font-bold">{count}</span>
            </span>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Visa</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden xl:table-cell">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery ? "No candidates match your search" : "No candidates yet"}
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCandidateId(c.id)}
                    className="border-b border-border last:border-0 hover:bg-accent/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{c.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[160px]">{c.jobTitle}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{c.city}, {c.state}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{c.visa}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">{c.owner}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <IconStar key={star} className={`w-3.5 h-3.5 ${star <= c.rating ? "text-amber-400" : "text-muted-foreground/30"}`} filled={star <= c.rating} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">{filtered.length} of {candidates.length} candidates</p>
        </div>
      </div>
    </div>
  );
}
