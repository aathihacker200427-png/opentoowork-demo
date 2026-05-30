"use client";

import { useMemo } from "react";
import { useCRM } from "../store";
import { IconPlus, IconPencil, IconTrash } from "../icons";

export function ClientsView() {
  const {
    clients, searchQuery,
    setSelectedClientId,
    setShowNewRecordModal, setNewRecordType,
    deleteClient, showConfirm,
  } = useCRM();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return clients;
    return clients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.contactName.toLowerCase().includes(q) ||
      c.contactEmail.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  const handleDelete = (id: string, name: string) => {
    showConfirm("Remove Client/Vendor", `Remove ${name}? This cannot be undone.`, () => deleteClient(id));
  };

  const typeBadge = (type: string) =>
    type === "Client" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
    type === "Vendor" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {["Client", "Vendor", "Both"].map(t => {
            const count = clients.filter(c => c.type === t).length;
            return (
              <span key={t} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge(t)}`}>
                {t} <span className="font-bold">{count}</span>
              </span>
            );
          })}
        </div>
        <div className="flex-1" />
        <button
          onClick={() => { setNewRecordType("client"); setShowNewRecordModal(true); }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          Add Client/Vendor
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Active Reqs</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery ? "No clients match your search" : "No clients yet"}
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-accent-foreground">{c.name.charAt(0)}</span>
                        </div>
                        <span
                          className="font-medium text-foreground cursor-pointer hover:text-primary"
                          onClick={() => setSelectedClientId(c.id)}
                        >
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(c.type)}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.contactName}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{c.contactEmail}</td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-sm font-semibold text-foreground">{c.activeReqs}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button onClick={() => setSelectedClientId(c.id)} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                          <IconPencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(c.id, c.name)} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">{filtered.length} of {clients.length} entries</p>
        </div>
      </div>
    </div>
  );
}
