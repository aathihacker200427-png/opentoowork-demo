"use client";

import { useState } from "react";
import { useCRM } from "../store";
import { IconClose } from "../icons";

export function NewRecordModal() {
  const {
    showNewRecordModal, setShowNewRecordModal, newRecordType, setNewRecordType,
    addCandidate, addRequisition, addClient, addSubmission,
    candidates, requisitions, clients, dropdowns,
    generateId,
  } = useCRM() as ReturnType<typeof useCRM> & { generateId?: never };

  const [form, setForm] = useState<Record<string, string | number | boolean>>({});

  if (!showNewRecordModal) return null;

  const setF = (key: string, value: string | number | boolean) => setForm(p => ({ ...p, [key]: value }));

  const close = () => {
    setShowNewRecordModal(false);
    setForm({});
  };

  const inputCls = "w-full h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newRecordType === "candidate") {
      addCandidate({
        name: String(form.name || ""),
        status: String(form.status || "Sourced"),
        jobTitle: String(form.jobTitle || ""),
        city: String(form.city || ""),
        state: String(form.state || ""),
        exp: Number(form.exp || 0),
        visa: String(form.visa || "US Citizen"),
        rating: 3,
        owner: String(form.owner || ""),
        email: String(form.email || ""),
        phone: String(form.phone || ""),
        linkedin: "",
        linkedinCreatedYear: "",
        employer: "",
        employerContactName: "",
        employerContactEmail: "",
        employerContactPhone: "",
        workAuth: String(form.workAuth || "W2 Direct"),
        technicalResult: "Pending",
        docs: { resume: false, visaCopy: false, certs: false },
        resumeName: "",
        resumeSize: "",
      });
    } else if (newRecordType === "requisition") {
      const count = requisitions.length + 1;
      addRequisition({
        refId: `REQ-${String(count).padStart(3, "0")}`,
        title: String(form.title || ""),
        client: String(form.client || ""),
        rateMin: Number(form.rateMin || 0),
        rateMax: Number(form.rateMax || 0),
        status: "Active",
        description: String(form.description || ""),
      });
    } else if (newRecordType === "client") {
      addClient({
        name: String(form.name || ""),
        type: (form.type as "Client" | "Vendor" | "Both") || "Client",
        contactName: String(form.contactName || ""),
        contactEmail: String(form.contactEmail || ""),
        contactPhone: String(form.contactPhone || ""),
        activeReqs: 0,
      });
    } else if (newRecordType === "submission") {
      addSubmission({
        candidateId: String(form.candidateId || ""),
        reqId: String(form.reqId || ""),
        rate: Number(form.rate || 0),
        type: String(form.type || "W2"),
        date: new Date().toISOString().slice(0, 10),
        status: "Pending",
      });
    }

    close();
  };

  const tabs = ["candidate", "requisition", "client", "submission"];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Add New Record</h2>
          <button onClick={close} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex gap-1 px-5 pt-4 pb-0">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => { setNewRecordType(t); setForm({}); }}
              className={`px-3 py-1.5 rounded-t-md text-xs font-medium capitalize transition-colors border-b-2 ${
                newRecordType === t
                  ? "text-foreground border-primary"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 pt-4 space-y-3">
          {newRecordType === "candidate" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Full Name *</label>
                  <input required className={inputCls} placeholder="Jane Smith" value={String(form.name ?? "")} onChange={e => setF("name", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Job Title</label>
                  <input className={inputCls} placeholder="Senior Developer" value={String(form.jobTitle ?? "")} onChange={e => setF("jobTitle", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={String(form.status ?? "Sourced")} onChange={e => setF("status", e.target.value)}>
                    {dropdowns.status.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" className={inputCls} placeholder="jane@email.com" value={String(form.email ?? "")} onChange={e => setF("email", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} placeholder="555-555-0100" value={String(form.phone ?? "")} onChange={e => setF("phone", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>City</label>
                  <input className={inputCls} placeholder="Austin" value={String(form.city ?? "")} onChange={e => setF("city", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input className={inputCls} placeholder="TX" value={String(form.state ?? "")} onChange={e => setF("state", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Experience (yrs)</label>
                  <input type="number" min={0} className={inputCls} value={String(form.exp ?? "")} onChange={e => setF("exp", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Visa</label>
                  <select className={inputCls} value={String(form.visa ?? "US Citizen")} onChange={e => setF("visa", e.target.value)}>
                    {dropdowns.visa.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Work Auth</label>
                  <select className={inputCls} value={String(form.workAuth ?? "W2 Direct")} onChange={e => setF("workAuth", e.target.value)}>
                    {dropdowns.workAuth.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Owner</label>
                  <input className={inputCls} placeholder="Alice Johnson" value={String(form.owner ?? "")} onChange={e => setF("owner", e.target.value)} />
                </div>
              </div>
            </>
          )}

          {newRecordType === "requisition" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Job Title *</label>
                <input required className={inputCls} placeholder="Senior Java Developer" value={String(form.title ?? "")} onChange={e => setF("title", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Client</label>
                <select className={inputCls} value={String(form.client ?? "")} onChange={e => setF("client", e.target.value)}>
                  <option value="">Select client…</option>
                  {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Min Rate ($/hr)</label>
                <input type="number" className={inputCls} placeholder="75" value={String(form.rateMin ?? "")} onChange={e => setF("rateMin", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Max Rate ($/hr)</label>
                <input type="number" className={inputCls} placeholder="100" value={String(form.rateMax ?? "")} onChange={e => setF("rateMax", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                <textarea className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={3} placeholder="Job description…" value={String(form.description ?? "")} onChange={e => setF("description", e.target.value)} />
              </div>
            </div>
          )}

          {newRecordType === "client" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Company Name *</label>
                <input required className={inputCls} placeholder="Acme Corp" value={String(form.name ?? "")} onChange={e => setF("name", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Type</label>
                <select className={inputCls} value={String(form.type ?? "Client")} onChange={e => setF("type", e.target.value)}>
                  <option value="Client">Client</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Contact Name</label>
                <input className={inputCls} placeholder="John Smith" value={String(form.contactName ?? "")} onChange={e => setF("contactName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Contact Email</label>
                <input type="email" className={inputCls} placeholder="john@acme.com" value={String(form.contactEmail ?? "")} onChange={e => setF("contactEmail", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Contact Phone</label>
                <input className={inputCls} placeholder="800-555-0001" value={String(form.contactPhone ?? "")} onChange={e => setF("contactPhone", e.target.value)} />
              </div>
            </div>
          )}

          {newRecordType === "submission" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Candidate *</label>
                <select required className={inputCls} value={String(form.candidateId ?? "")} onChange={e => setF("candidateId", e.target.value)}>
                  <option value="">Select candidate…</option>
                  {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Requisition *</label>
                <select required className={inputCls} value={String(form.reqId ?? "")} onChange={e => setF("reqId", e.target.value)}>
                  <option value="">Select requisition…</option>
                  {requisitions.filter(r => r.status === "Active").map(r => <option key={r.id} value={r.id}>{r.refId} — {r.title}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Bill Rate ($/hr)</label>
                <input type="number" className={inputCls} placeholder="90" value={String(form.rate ?? "")} onChange={e => setF("rate", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Type</label>
                <select className={inputCls} value={String(form.type ?? "W2")} onChange={e => setF("type", e.target.value)}>
                  <option value="W2">W2</option>
                  <option value="C2C">C2C</option>
                  <option value="1099">1099</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={close} className="flex-1 h-9 rounded-md border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
