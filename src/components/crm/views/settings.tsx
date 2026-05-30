"use client";

import { useState } from "react";
import { useCRM } from "../store";
import { IconPlus, IconTrash, IconPencil, IconCheck, IconClose } from "../icons";
import type { TeamMember } from "../types";

export function SettingsView() {
  const {
    team, addTeamMember, updateTeamMember, deleteTeamMember,
    dropdowns, addDropdownOption, removeDropdownOption,
    showConfirm,
  } = useCRM();

  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Recruiter" });
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember>>({});
  const [activeTab, setActiveTab] = useState<"team" | "dropdowns">("team");
  const [newOption, setNewOption] = useState<Record<string, string>>({});

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.email) {
      addTeamMember(newMember);
      setNewMember({ name: "", email: "", role: "Recruiter" });
    }
  };

  const handleSaveEdit = (id: string) => {
    updateTeamMember(id, editingMember);
    setEditingMemberId(null);
    setEditingMember({});
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["team", "dropdowns"] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${activeTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "team" ? "Team Members" : "Dropdown Options"}
          </button>
        ))}
      </div>

      {activeTab === "team" && (
        <div className="space-y-4">
          {/* Add form */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Add Team Member</h3>
            <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={newMember.name}
                onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                placeholder="Full name"
                required
                className="h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="email"
                value={newMember.email}
                onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))}
                placeholder="Email"
                required
                className="h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                <select
                  value={newMember.role}
                  onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))}
                  className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {dropdowns.roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="submit" className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Add
                </button>
              </div>
            </form>
          </div>

          {/* Team table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {team.map(m => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      {editingMemberId === m.id ? (
                        <input
                          value={editingMember.name ?? m.name}
                          onChange={e => setEditingMember(p => ({ ...p, name: e.target.value }))}
                          className="h-8 px-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{m.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-foreground">{m.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {editingMemberId === m.id ? (
                        <input
                          value={editingMember.email ?? m.email}
                          onChange={e => setEditingMember(p => ({ ...p, email: e.target.value }))}
                          className="h-8 px-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full"
                        />
                      ) : m.email}
                    </td>
                    <td className="px-4 py-3">
                      {editingMemberId === m.id ? (
                        <select
                          value={editingMember.role ?? m.role}
                          onChange={e => setEditingMember(p => ({ ...p, role: e.target.value }))}
                          className="h-8 px-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {dropdowns.roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{m.role}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {editingMemberId === m.id ? (
                          <>
                            <button onClick={() => handleSaveEdit(m.id)} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                              <IconCheck className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingMemberId(null)} className="p-1 text-muted-foreground hover:text-foreground rounded">
                              <IconClose className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingMemberId(m.id); setEditingMember(m); }} className="p-1 text-muted-foreground hover:text-foreground rounded">
                              <IconPencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => showConfirm("Remove Member", `Remove ${m.name}?`, () => deleteTeamMember(m.id))} className="p-1 text-muted-foreground hover:text-destructive rounded">
                              <IconTrash className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "dropdowns" && (
        <div className="space-y-4">
          {(Object.keys(dropdowns) as Array<keyof typeof dropdowns>).map(key => (
            <div key={key} className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 capitalize">{key} Options</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {dropdowns[key].map(opt => (
                  <span key={opt} className="inline-flex items-center gap-1.5 bg-muted text-foreground px-3 py-1 rounded-full text-xs font-medium group">
                    {opt}
                    <button
                      onClick={() => showConfirm("Remove Option", `Remove "${opt}" from ${key}?`, () => removeDropdownOption(key, opt))}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const val = newOption[key]?.trim();
                  if (val && !dropdowns[key].includes(val)) {
                    addDropdownOption(key, val);
                    setNewOption(p => ({ ...p, [key]: "" }));
                  }
                }}
                className="flex gap-2"
              >
                <input
                  value={newOption[key] ?? ""}
                  onChange={e => setNewOption(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={`Add ${key} option…`}
                  className="flex-1 h-8 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="submit" className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                  Add
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
