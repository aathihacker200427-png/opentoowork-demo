"use client";

import { useState } from "react";
import { useCRM } from "../store";
import { getStatusStyles } from "../utils";
import { IconClose, IconPencil, IconTrash } from "../icons";

export function RequisitionPanel() {
  const {
    requisitions, selectedRequisitionId, setSelectedRequisitionId,
    updateRequisition, deleteRequisition, showConfirm, clients,
  } = useCRM();

  const req = requisitions.find(r => r.id === selectedRequisitionId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<typeof req | null>(null);

  if (!req) return null;

  const handleSave = () => { if (form) { updateRequisition(req.id, form); setEditing(false); setForm(null); } };
  const current = editing && form ? form : req;
  const setField = <K extends keyof typeof req>(key: K, value: typeof req[K]) => {
    setForm(prev => prev ? { ...prev, [key]: value } : null);
  };

  const inputCls = "w-full h-8 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelectedRequisitionId(null)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-mono">{req.refId}</p>
            <h2 className="text-base font-semibold text-foreground truncate">{req.title}</h2>
          </div>
          <div className="flex items-center gap-1">
            {!editing ? (
              <>
                <button onClick={() => { setForm({ ...req }); setEditing(true); }} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <IconPencil className="w-4 h-4" />
                </button>
                <button onClick={() => showConfirm("Delete Requisition", `Delete ${req.refId}?`, () => { deleteRequisition(req.id); setSelectedRequisitionId(null); })} className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <IconTrash className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Save</button>
                <button onClick={() => { setEditing(false); setForm(null); }} className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors">
                  <IconClose className="w-4 h-4" />
                </button>
              </>
            )}
            <button onClick={() => setSelectedRequisitionId(null)} className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors ml-1">
              <IconClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyles(req.status)}`}>
            {req.status}
          </span>

          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Title</label>
                {editing ? <input className={inputCls} value={form?.title ?? ""} onChange={e => setField("title", e.target.value)} /> : <p className="text-sm text-foreground">{req.title}</p>}
              </div>
              <div>
                <label className={labelCls}>Status</label>
                {editing ? (
                  <select className="w-full h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form?.status ?? ""} onChange={e => setField("status", e.target.value)}>
                    {["Active", "On Hold", "Closed", "Draft"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : <p className="text-sm text-foreground">{req.status}</p>}
              </div>
              <div>
                <label className={labelCls}>Client</label>
                {editing ? (
                  <select className="w-full h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form?.client ?? ""} onChange={e => setField("client", e.target.value)}>
                    {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                ) : <p className="text-sm text-foreground">{req.client}</p>}
              </div>
              <div>
                <label className={labelCls}>Rate Range ($/hr)</label>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input type="number" className={inputCls} placeholder="Min" value={form?.rateMin ?? ""} onChange={e => setField("rateMin", Number(e.target.value))} />
                    <span className="text-muted-foreground">–</span>
                    <input type="number" className={inputCls} placeholder="Max" value={form?.rateMax ?? ""} onChange={e => setField("rateMax", Number(e.target.value))} />
                  </div>
                ) : <p className="text-sm text-foreground">${req.rateMin}–${req.rateMax}/hr</p>}
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                {editing ? (
                  <textarea className="w-full px-2.5 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={4} value={form?.description ?? ""} onChange={e => setField("description", e.target.value)} />
                ) : <p className="text-sm text-foreground whitespace-pre-wrap">{req.description || "—"}</p>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function ClientPanel() {
  const {
    clients, selectedClientId, setSelectedClientId,
    updateClient, deleteClient, showConfirm,
  } = useCRM();

  const client = clients.find(c => c.id === selectedClientId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<typeof client | null>(null);

  if (!client) return null;

  const handleSave = () => { if (form) { updateClient(client.id, form); setEditing(false); setForm(null); } };
  const setField = <K extends keyof typeof client>(key: K, value: typeof client[K]) => {
    setForm(prev => prev ? { ...prev, [key]: value } : null);
  };

  const inputCls = "w-full h-8 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelectedClientId(null)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-accent-foreground">{client.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground truncate">{client.name}</h2>
            <p className="text-xs text-muted-foreground">{client.type}</p>
          </div>
          <div className="flex items-center gap-1">
            {!editing ? (
              <>
                <button onClick={() => { setForm({ ...client }); setEditing(true); }} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <IconPencil className="w-4 h-4" />
                </button>
                <button onClick={() => showConfirm("Remove Client", `Remove ${client.name}?`, () => { deleteClient(client.id); setSelectedClientId(null); })} className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <IconTrash className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Save</button>
                <button onClick={() => { setEditing(false); setForm(null); }} className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors">
                  <IconClose className="w-4 h-4" />
                </button>
              </>
            )}
            <button onClick={() => setSelectedClientId(null)} className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors ml-1">
              <IconClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Name</label>
                {editing ? <input className={inputCls} value={form?.name ?? ""} onChange={e => setField("name", e.target.value)} /> : <p className="text-sm text-foreground">{client.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Type</label>
                {editing ? (
                  <select className="w-full h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form?.type ?? "Client"} onChange={e => setField("type", e.target.value as "Client" | "Vendor" | "Both")}>
                    <option value="Client">Client</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Both">Both</option>
                  </select>
                ) : <p className="text-sm text-foreground">{client.type}</p>}
              </div>
              <div>
                <label className={labelCls}>Contact Name</label>
                {editing ? <input className={inputCls} value={form?.contactName ?? ""} onChange={e => setField("contactName", e.target.value)} /> : <p className="text-sm text-foreground">{client.contactName || "—"}</p>}
              </div>
              <div>
                <label className={labelCls}>Contact Phone</label>
                {editing ? <input className={inputCls} value={form?.contactPhone ?? ""} onChange={e => setField("contactPhone", e.target.value)} /> : <p className="text-sm text-foreground">{client.contactPhone || "—"}</p>}
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Contact Email</label>
                {editing ? <input type="email" className={inputCls} value={form?.contactEmail ?? ""} onChange={e => setField("contactEmail", e.target.value)} /> : <p className="text-sm text-foreground">{client.contactEmail || "—"}</p>}
              </div>
              <div>
                <label className={labelCls}>Active Requisitions</label>
                {editing ? <input type="number" className={inputCls} value={form?.activeReqs ?? 0} onChange={e => setField("activeReqs", Number(e.target.value))} /> : <p className="text-sm font-semibold text-foreground">{client.activeReqs}</p>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
