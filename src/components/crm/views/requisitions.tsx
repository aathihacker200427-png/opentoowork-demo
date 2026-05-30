"use client";

import { useMemo } from "react";
import { useCRM } from "../store";
import { getStatusStyles } from "../utils";
import { IconPlus, IconPencil, IconTrash } from "../icons";

export function RequisitionsView() {
  const {
    requisitions, searchQuery, clients,
    setSelectedRequisitionId,
    setShowNewRecordModal, setNewRecordType,
    deleteRequisition, showConfirm,
  } = useCRM();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return requisitions;
    return requisitions.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.client.toLowerCase().includes(q) ||
      r.refId.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }, [requisitions, searchQuery]);

  const handleDelete = (id: string, refId: string) => {
    showConfirm("Delete Requisition", `Delete ${refId}? This cannot be undone.`, () => deleteRequisition(id));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {["Active", "On Hold", "Closed"].map(s => {
            const count = requisitions.filter(r => r.status === s).length;
            return (
              <span key={s} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(s)}`}>
                {s} <span className="font-bold">{count}</span>
              </span>
            );
          })}
        </div>
        <div className="flex-1" />
        <button
          onClick={() => { setNewRecordType("requisition"); setShowNewRecordModal(true); }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          New Requisition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground text-sm">
            {searchQuery ? "No requisitions match your search" : "No requisitions yet"}
          </div>
        ) : (
          filtered.map(r => (
            <div
              key={r.id}
              className="bg-card rounded-xl border border-border p-4 hover:border-ring hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-mono mb-0.5">{r.refId}</p>
                  <h3
                    className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary truncate"
                    onClick={() => setSelectedRequisitionId(r.id)}
                  >
                    {r.title}
                  </h3>
                </div>
                <span className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(r.status)}`}>
                  {r.status}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Client</span>
                  <span className="text-foreground font-medium">{r.client}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Rate Range</span>
                  <span className="text-foreground font-medium">${r.rateMin}–${r.rateMax}/hr</span>
                </div>
              </div>
              {r.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{r.description}</p>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setSelectedRequisitionId(r.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <IconPencil className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => handleDelete(r.id, r.refId)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
                >
                  <IconTrash className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
