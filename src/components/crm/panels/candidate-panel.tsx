"use client";

import { useState, useRef } from "react";
import { useCRM } from "../store";
import { getStatusStyles } from "../utils";
import { IconClose, IconPencil, IconTrash, IconStar, IconCheck, IconExternal, IconUpload } from "../icons";

export function CandidatePanel() {
  const {
    candidates, selectedCandidateId, setSelectedCandidateId,
    updateCandidate, deleteCandidate, showConfirm, dropdowns,
  } = useCRM();

  const candidate = candidates.find(c => c.id === selectedCandidateId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<typeof candidate | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!candidate) return null;

  const handleEdit = () => { setForm({ ...candidate }); setEditing(true); };
  const handleSave = () => {
    if (form) { updateCandidate(candidate.id, form); setEditing(false); setForm(null); }
  };
  const handleCancel = () => { setEditing(false); setForm(null); };
  const handleDelete = () => {
    showConfirm("Delete Candidate", `Delete ${candidate.name}? This cannot be undone.`, () => {
      deleteCandidate(candidate.id);
      setSelectedCandidateId(null);
    });
  };

  const current = editing && form ? form : candidate;
  const setField = <K extends keyof typeof candidate>(key: K, value: typeof candidate[K]) => {
    setForm(prev => prev ? { ...prev, [key]: value } : null);
  };

  const inputCls = "w-full h-8 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const staticCls = "text-sm text-foreground";
  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelectedCandidateId(null)} />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-background border-l border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{candidate.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground truncate">{candidate.name}</h2>
            <p className="text-xs text-muted-foreground truncate">{candidate.jobTitle}</p>
          </div>
          <div className="flex items-center gap-1">
            {!editing ? (
              <>
                <button onClick={handleEdit} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <IconPencil className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <IconTrash className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Save</button>
                <button onClick={handleCancel} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <IconClose className="w-4 h-4" />
                </button>
              </>
            )}
            <button onClick={() => setSelectedCandidateId(null)} className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ml-1">
              <IconClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status + Rating */}
          <div className="flex items-center gap-4">
            {editing ? (
              <select
                value={form?.status ?? candidate.status}
                onChange={e => setField("status", e.target.value)}
                className="h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {dropdowns.status.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyles(candidate.status)}`}>
                {candidate.status}
              </span>
            )}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => editing && setField("rating", star)}
                  className={editing ? "cursor-pointer" : "cursor-default"}
                >
                  <IconStar
                    className={`w-4 h-4 ${star <= (editing ? (form?.rating ?? 0) : candidate.rating) ? "text-amber-400" : "text-muted-foreground/30"}`}
                    filled={star <= (editing ? (form?.rating ?? 0) : candidate.rating)}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email</label>
                {editing ? <input className={inputCls} value={form?.email ?? ""} onChange={e => setField("email", e.target.value)} /> : <p className={staticCls}>{candidate.email}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                {editing ? <input className={inputCls} value={form?.phone ?? ""} onChange={e => setField("phone", e.target.value)} /> : <p className={staticCls}>{candidate.phone}</p>}
              </div>
              <div className="col-span-2">
                <label className={labelCls}>LinkedIn</label>
                {editing ? (
                  <input className={inputCls} value={form?.linkedin ?? ""} onChange={e => setField("linkedin", e.target.value)} />
                ) : (
                  <a href={`https://${candidate.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                    {candidate.linkedin} <IconExternal className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Profile */}
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Profile</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "City", key: "city" as const },
                { label: "State", key: "state" as const },
                { label: "Experience (yrs)", key: "exp" as const, type: "number" },
                { label: "LinkedIn Year", key: "linkedinCreatedYear" as const },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  {editing ? (
                    <input type={type ?? "text"} className={inputCls} value={(form?.[key] ?? "") as string} onChange={e => setField(key, (type === "number" ? Number(e.target.value) : e.target.value) as typeof candidate[typeof key])} />
                  ) : (
                    <p className={staticCls}>{candidate[key]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className={labelCls}>Visa Type</label>
                {editing ? (
                  <select className="w-full h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form?.visa ?? ""} onChange={e => setField("visa", e.target.value)}>
                    {dropdowns.visa.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                ) : <p className={staticCls}>{candidate.visa}</p>}
              </div>
              <div>
                <label className={labelCls}>Work Auth</label>
                {editing ? (
                  <select className="w-full h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form?.workAuth ?? ""} onChange={e => setField("workAuth", e.target.value)}>
                    {dropdowns.workAuth.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                ) : <p className={staticCls}>{candidate.workAuth}</p>}
              </div>
              <div>
                <label className={labelCls}>Owner</label>
                {editing ? <input className={inputCls} value={form?.owner ?? ""} onChange={e => setField("owner", e.target.value)} /> : <p className={staticCls}>{candidate.owner}</p>}
              </div>
              <div>
                <label className={labelCls}>Technical Result</label>
                {editing ? (
                  <select className="w-full h-8 px-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form?.technicalResult ?? ""} onChange={e => setField("technicalResult", e.target.value)}>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="Pending">Pending</option>
                  </select>
                ) : <p className={staticCls}>{candidate.technicalResult}</p>}
              </div>
            </div>
          </section>

          {/* Employer */}
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Current Employer</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Company", key: "employer" as const },
                { label: "Contact Name", key: "employerContactName" as const },
                { label: "Contact Email", key: "employerContactEmail" as const },
                { label: "Contact Phone", key: "employerContactPhone" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  {editing ? <input className={inputCls} value={(form?.[key] ?? "") as string} onChange={e => setField(key, e.target.value)} /> : <p className={staticCls}>{candidate[key] || "—"}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Documents</h4>
            <div className="space-y-2">
              {(["resume", "visaCopy", "certs"] as const).map(doc => {
                const labels = { resume: "Resume", visaCopy: "Visa Copy", certs: "Certifications" };
                const has = candidate.docs[doc];
                return (
                  <div key={doc} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${has ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}>
                        {has && <IconCheck className="w-3 h-3 text-green-600 dark:text-green-400" />}
                      </span>
                      <span className="text-sm text-foreground">{labels[doc]}</span>
                    </div>
                    {editing && (
                      <button
                        onClick={() => setField("docs", { ...candidate.docs, [doc]: !candidate.docs[doc] })}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        {has ? "Remove" : "Mark Present"}
                      </button>
                    )}
                  </div>
                );
              })}
              {candidate.resumeName && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">{candidate.resumeName}</span>
                  <span>{candidate.resumeSize}</span>
                </div>
              )}
              <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => {
                const f = e.target.files?.[0];
                if (f && editing) {
                  setField("resumeName", f.name);
                  setField("resumeSize", `${Math.round(f.size / 1024)} KB`);
                  setField("docs", { ...candidate.docs, resume: true });
                }
              }} />
              {editing && (
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <IconUpload className="w-4 h-4" /> Upload Resume
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
