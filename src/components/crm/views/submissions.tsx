"use client";

import { useMemo } from "react";
import { useCRM } from "../store";
import { getStatusStyles } from "../utils";
import { IconPlus, IconTrash, IconPencil } from "../icons";

export function SubmissionsView() {
  const {
    submissions, candidates, requisitions, searchQuery,
    setShowNewRecordModal, setNewRecordType,
    updateSubmission, deleteSubmission, showConfirm,
  } = useCRM();

  const enriched = useMemo(() => {
    return submissions.map(s => ({
      ...s,
      candidateName: candidates.find(c => c.id === s.candidateId)?.name ?? "Unknown",
      reqTitle: requisitions.find(r => r.id === s.reqId)?.title ?? "Unknown",
      reqRefId: requisitions.find(r => r.id === s.reqId)?.refId ?? "",
    }));
  }, [submissions, candidates, requisitions]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return enriched;
    return enriched.filter(s =>
      s.candidateName.toLowerCase().includes(q) ||
      s.reqTitle.toLowerCase().includes(q) ||
      s.reqRefId.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  }, [enriched, searchQuery]);

  const handleDelete = (id: string) => {
    showConfirm("Delete Submission", "Remove this submission? This cannot be undone.", () => deleteSubmission(id));
  };

  const STATUS_OPTIONS = ["Pending", "Accepted", "Rejected", "Withdrawn"];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(s => {
            const count = submissions.filter(sub => sub.status === s).length;
            return (
              <span key={s} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(s)}`}>
                {s} <span className="font-bold">{count}</span>
              </span>
            );
          })}
        </div>
        <div className="flex-1" />
        <button
          onClick={() => { setNewRecordType("submission"); setShowNewRecordModal(true); }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          New Submission
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Candidate</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Requisition</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Rate</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery ? "No submissions match your search" : "No submissions yet"}
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors group">
                    <td className="px-4 py-3 font-medium text-foreground">{s.candidateName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">{s.reqRefId}</p>
                        <p className="text-foreground truncate max-w-[180px]">{s.reqTitle}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-foreground font-medium">${s.rate}/hr</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{s.type}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{s.date}</td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={e => updateSubmission(s.id, { status: e.target.value })}
                        onClick={e => e.stopPropagation()}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${getStatusStyles(s.status)}`}
                      >
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1 rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">{filtered.length} of {submissions.length} submissions</p>
        </div>
      </div>
    </div>
  );
}
