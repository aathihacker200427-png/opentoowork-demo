"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  Candidate,
  Requisition,
  Client,
  Submission,
  Activity,
  Task,
  TeamMember,
  Notification,
  DropdownOptions,
  Toast,
  ConfirmDialog,
  ViewType,
} from "./types";
import { generateId } from "./utils";

// ─── Initial seed data ────────────────────────────────────────────────────────

const INITIAL_DROPDOWNS: DropdownOptions = {
  status: ["Sourced", "Verified", "Submitted", "Interview", "Placed"],
  visa: ["US Citizen", "Green Card", "H1B", "OPT", "TN", "L2"],
  workAuth: ["W2 Direct", "C2C Approved", "1099 Eligible"],
  roles: ["Admin", "Recruiter", "Viewer"],
};

const SEED_CANDIDATES: Candidate[] = [
  {
    id: "c1", name: "Priya Sharma", status: "Verified", jobTitle: "Senior Java Developer",
    city: "Austin", state: "TX", exp: 8, visa: "H1B", rating: 4, owner: "Alice Johnson",
    email: "priya.sharma@email.com", phone: "512-555-0101", linkedin: "linkedin.com/in/priyasharma",
    linkedinCreatedYear: "2015", employer: "TechSolutions Inc", employerContactName: "Bob Lee",
    employerContactEmail: "bob@techsolutions.com", employerContactPhone: "512-555-0200",
    workAuth: "C2C Approved", technicalResult: "Pass",
    docs: { resume: true, visaCopy: true, certs: false }, resumeName: "priya_resume.pdf", resumeSize: "245 KB",
  },
  {
    id: "c2", name: "James Williams", status: "Sourced", jobTitle: "React Frontend Engineer",
    city: "Chicago", state: "IL", exp: 5, visa: "US Citizen", rating: 3, owner: "Mark Davis",
    email: "james.w@email.com", phone: "312-555-0102", linkedin: "linkedin.com/in/jameswilliams",
    linkedinCreatedYear: "2018", employer: "Freelance", employerContactName: "",
    employerContactEmail: "", employerContactPhone: "",
    workAuth: "W2 Direct", technicalResult: "Pending",
    docs: { resume: true, visaCopy: false, certs: false }, resumeName: "james_cv.pdf", resumeSize: "189 KB",
  },
  {
    id: "c3", name: "Anita Patel", status: "Interview", jobTitle: "DevOps Engineer",
    city: "New York", state: "NY", exp: 6, visa: "Green Card", rating: 5, owner: "Alice Johnson",
    email: "anita.patel@email.com", phone: "212-555-0103", linkedin: "linkedin.com/in/anitapatel",
    linkedinCreatedYear: "2016", employer: "CloudOps LLC", employerContactName: "Sarah Kim",
    employerContactEmail: "sarah@cloudops.com", employerContactPhone: "212-555-0300",
    workAuth: "W2 Direct", technicalResult: "Pass",
    docs: { resume: true, visaCopy: true, certs: true }, resumeName: "anita_resume.pdf", resumeSize: "312 KB",
  },
  {
    id: "c4", name: "Carlos Rivera", status: "Submitted", jobTitle: "Data Scientist",
    city: "San Francisco", state: "CA", exp: 4, visa: "OPT", rating: 4, owner: "Mark Davis",
    email: "carlos.r@email.com", phone: "415-555-0104", linkedin: "linkedin.com/in/carlosrivera",
    linkedinCreatedYear: "2020", employer: "DataMinds Corp", employerContactName: "Tim Chen",
    employerContactEmail: "tim@dataminds.com", employerContactPhone: "415-555-0400",
    workAuth: "1099 Eligible", technicalResult: "Pass",
    docs: { resume: true, visaCopy: true, certs: false }, resumeName: "carlos_resume.pdf", resumeSize: "201 KB",
  },
  {
    id: "c5", name: "Emily Chen", status: "Placed", jobTitle: "Full Stack Developer",
    city: "Seattle", state: "WA", exp: 7, visa: "US Citizen", rating: 5, owner: "Alice Johnson",
    email: "emily.chen@email.com", phone: "206-555-0105", linkedin: "linkedin.com/in/emilychen",
    linkedinCreatedYear: "2014", employer: "WebWorks Inc", employerContactName: "David Brown",
    employerContactEmail: "david@webworks.com", employerContactPhone: "206-555-0500",
    workAuth: "W2 Direct", technicalResult: "Pass",
    docs: { resume: true, visaCopy: false, certs: true }, resumeName: "emily_resume.pdf", resumeSize: "278 KB",
  },
];

const SEED_REQUISITIONS: Requisition[] = [
  { id: "r1", refId: "REQ-001", title: "Senior Java Developer", client: "Acme Corp", rateMin: 85, rateMax: 110, status: "Active", description: "Looking for an experienced Java developer with Spring Boot expertise." },
  { id: "r2", refId: "REQ-002", title: "React Frontend Engineer", client: "GlobalTech", rateMin: 75, rateMax: 95, status: "Active", description: "React developer with TypeScript and modern CSS skills needed." },
  { id: "r3", refId: "REQ-003", title: "DevOps Engineer", client: "StartupXYZ", rateMin: 90, rateMax: 120, status: "Active", description: "AWS/Kubernetes experience required. CI/CD pipeline expertise." },
  { id: "r4", refId: "REQ-004", title: "Data Scientist", client: "DataCo", rateMin: 80, rateMax: 105, status: "On Hold", description: "Machine learning background with Python and TensorFlow." },
  { id: "r5", refId: "REQ-005", title: "Project Manager", client: "Acme Corp", rateMin: 70, rateMax: 90, status: "Closed", description: "PMP certified PM for enterprise software projects." },
];

const SEED_CLIENTS: Client[] = [
  { id: "cl1", name: "Acme Corp", type: "Client", contactName: "John Smith", contactEmail: "john.smith@acme.com", contactPhone: "800-555-0001", activeReqs: 2 },
  { id: "cl2", name: "GlobalTech", type: "Client", contactName: "Sarah Lee", contactEmail: "sarah.lee@globaltech.com", contactPhone: "800-555-0002", activeReqs: 1 },
  { id: "cl3", name: "StartupXYZ", type: "Client", contactName: "Mike Johnson", contactEmail: "mike@startupxyz.com", contactPhone: "800-555-0003", activeReqs: 1 },
  { id: "cl4", name: "TechVendors LLC", type: "Vendor", contactName: "Lisa Wang", contactEmail: "lisa@techvendors.com", contactPhone: "800-555-0004", activeReqs: 0 },
  { id: "cl5", name: "DataCo", type: "Both", contactName: "Robert Kim", contactEmail: "robert@dataco.com", contactPhone: "800-555-0005", activeReqs: 1 },
];

const SEED_SUBMISSIONS: Submission[] = [
  { id: "s1", candidateId: "c1", reqId: "r1", rate: 95, type: "C2C", date: "2025-01-15", status: "Pending" },
  { id: "s2", candidateId: "c3", reqId: "r3", rate: 105, type: "W2", date: "2025-01-16", status: "Accepted" },
  { id: "s3", candidateId: "c4", reqId: "r4", rate: 88, type: "1099", date: "2025-01-17", status: "Pending" },
  { id: "s4", candidateId: "c2", reqId: "r2", rate: 82, type: "W2", date: "2025-01-18", status: "Rejected" },
  { id: "s5", candidateId: "c5", reqId: "r1", rate: 100, type: "C2C", date: "2025-01-19", status: "Accepted" },
];

const SEED_TASKS: Task[] = [
  { id: "t1", title: "Follow up with Acme Corp about REQ-001", done: false, date: "2025-01-20" },
  { id: "t2", title: "Schedule technical interview for Anita Patel", done: false, date: "2025-01-21" },
  { id: "t3", title: "Send offer letter to Emily Chen", done: true, date: "2025-01-15" },
  { id: "t4", title: "Review new submissions for REQ-003", done: false, date: "2025-01-22" },
];

const SEED_TEAM: TeamMember[] = [
  { id: "tm1", name: "Alice Johnson", email: "alice@openttowork.com", role: "Admin" },
  { id: "tm2", name: "Mark Davis", email: "mark@openttowork.com", role: "Recruiter" },
  { id: "tm3", name: "Sarah Wilson", email: "sarah@openttowork.com", role: "Recruiter" },
];

const SEED_ACTIVITIES: Activity[] = [
  { id: "a1", actor: "Alice Johnson", action: "added candidate", targetId: "c1", targetName: "Priya Sharma", details: "Status: Verified", time: "2h ago", timestamp: Date.now() - 7200000 },
  { id: "a2", actor: "Mark Davis", action: "submitted", targetId: "c4", targetName: "Carlos Rivera", details: "to REQ-004 at $88/hr", time: "4h ago", timestamp: Date.now() - 14400000 },
  { id: "a3", actor: "Alice Johnson", action: "created requisition", targetId: "r3", targetName: "REQ-003 DevOps Engineer", details: "Client: StartupXYZ", time: "1d ago", timestamp: Date.now() - 86400000 },
  { id: "a4", actor: "Sarah Wilson", action: "placed candidate", targetId: "c5", targetName: "Emily Chen", details: "at WebWorks Inc", time: "2d ago", timestamp: Date.now() - 172800000 },
];

const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", text: "Anita Patel interview scheduled for tomorrow at 2pm", read: false },
  { id: "n2", text: "REQ-001 has 3 new candidates in review", read: false },
  { id: "n3", text: "Emily Chen placement confirmed by Acme Corp", read: true },
];

// ─── Context definition ────────────────────────────────────────────────────────

interface CRMContextValue {
  // Auth
  isAuthenticated: boolean;
  currentUser: TeamMember;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Navigation
  activeView: ViewType;
  setActiveView: (v: ViewType) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;

  // Data
  candidates: Candidate[];
  requisitions: Requisition[];
  clients: Client[];
  submissions: Submission[];
  activities: Activity[];
  tasks: Task[];
  team: TeamMember[];
  notifications: Notification[];
  dropdowns: DropdownOptions;

  // CRUD – Candidates
  addCandidate: (c: Omit<Candidate, "id">) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;

  // CRUD – Requisitions
  addRequisition: (r: Omit<Requisition, "id">) => void;
  updateRequisition: (id: string, updates: Partial<Requisition>) => void;
  deleteRequisition: (id: string) => void;

  // CRUD – Clients
  addClient: (c: Omit<Client, "id">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // CRUD – Submissions
  addSubmission: (s: Omit<Submission, "id">) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
  deleteSubmission: (id: string) => void;

  // Tasks
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Team
  addTeamMember: (m: Omit<TeamMember, "id">) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Dropdowns
  addDropdownOption: (key: keyof DropdownOptions, value: string) => void;
  removeDropdownOption: (key: keyof DropdownOptions, value: string) => void;

  // Notifications
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  // Activity
  logActivity: (actor: string, action: string, targetId: string, targetName: string, details: string) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;

  // Confirm dialog
  confirmDialog: ConfirmDialog;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;

  // UI state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCandidateId: string | null;
  setSelectedCandidateId: (id: string | null) => void;
  selectedRequisitionId: string | null;
  setSelectedRequisitionId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  showNewRecordModal: boolean;
  setShowNewRecordModal: (v: boolean) => void;
  newRecordType: string;
  setNewRecordType: (v: string) => void;
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function useCRM(): CRMContextValue {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<TeamMember>(SEED_TEAM[0]);
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [candidates, setCandidates] = useState<Candidate[]>(SEED_CANDIDATES);
  const [requisitions, setRequisitions] = useState<Requisition[]>(SEED_REQUISITIONS);
  const [clients, setClients] = useState<Client[]>(SEED_CLIENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS);
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [team, setTeam] = useState<TeamMember[]>(SEED_TEAM);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [dropdowns, setDropdowns] = useState<DropdownOptions>(INITIAL_DROPDOWNS);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({ open: false, title: "", message: "", onConfirm: () => {} });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [newRecordType, setNewRecordType] = useState("candidate");

  // Auth
  const login = useCallback((email: string, password: string): boolean => {
    if (email === "admin@openttowork.com" && password === "admin123") {
      setIsAuthenticated(true);
      setCurrentUser(SEED_TEAM[0]);
      return true;
    }
    if (email === "recruiter@openttowork.com" && password === "recruiter123") {
      setIsAuthenticated(true);
      setCurrentUser(SEED_TEAM[1]);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setActiveView("dashboard");
  }, []);

  // Toast
  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Confirm
  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  }, []);

  // Activity
  const logActivity = useCallback((actor: string, action: string, targetId: string, targetName: string, details: string) => {
    const now = Date.now();
    const activity: Activity = {
      id: generateId(),
      actor, action, targetId, targetName, details,
      time: "just now",
      timestamp: now,
    };
    setActivities(prev => [activity, ...prev].slice(0, 50));
  }, []);

  // Candidates
  const addCandidate = useCallback((c: Omit<Candidate, "id">) => {
    const candidate = { ...c, id: generateId() };
    setCandidates(prev => [candidate, ...prev]);
    logActivity(currentUser.name, "added candidate", candidate.id, candidate.name, `Status: ${candidate.status}`);
    addToast(`Candidate ${candidate.name} added`);
  }, [currentUser.name, logActivity, addToast]);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (updates.status) {
      const c = candidates.find(x => x.id === id);
      if (c) logActivity(currentUser.name, "updated status", id, c.name, `→ ${updates.status}`);
    }
    addToast("Candidate updated");
  }, [candidates, currentUser.name, logActivity, addToast]);

  const deleteCandidate = useCallback((id: string) => {
    const c = candidates.find(x => x.id === id);
    setCandidates(prev => prev.filter(x => x.id !== id));
    if (c) {
      logActivity(currentUser.name, "deleted candidate", id, c.name, "");
      addToast(`Candidate ${c.name} deleted`, "info");
    }
  }, [candidates, currentUser.name, logActivity, addToast]);

  // Requisitions
  const addRequisition = useCallback((r: Omit<Requisition, "id">) => {
    const req = { ...r, id: generateId() };
    setRequisitions(prev => [req, ...prev]);
    logActivity(currentUser.name, "created requisition", req.id, `${req.refId} ${req.title}`, `Client: ${req.client}`);
    addToast(`Requisition ${req.refId} created`);
  }, [currentUser.name, logActivity, addToast]);

  const updateRequisition = useCallback((id: string, updates: Partial<Requisition>) => {
    setRequisitions(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    addToast("Requisition updated");
  }, [addToast]);

  const deleteRequisition = useCallback((id: string) => {
    const r = requisitions.find(x => x.id === id);
    setRequisitions(prev => prev.filter(x => x.id !== id));
    if (r) addToast(`Requisition ${r.refId} deleted`, "info");
  }, [requisitions, addToast]);

  // Clients
  const addClient = useCallback((c: Omit<Client, "id">) => {
    const client = { ...c, id: generateId() };
    setClients(prev => [client, ...prev]);
    logActivity(currentUser.name, "added client/vendor", client.id, client.name, `Type: ${client.type}`);
    addToast(`${client.type} ${client.name} added`);
  }, [currentUser.name, logActivity, addToast]);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addToast("Client updated");
  }, [addToast]);

  const deleteClient = useCallback((id: string) => {
    const c = clients.find(x => x.id === id);
    setClients(prev => prev.filter(x => x.id !== id));
    if (c) addToast(`${c.name} deleted`, "info");
  }, [clients, addToast]);

  // Submissions
  const addSubmission = useCallback((s: Omit<Submission, "id">) => {
    const sub = { ...s, id: generateId() };
    setSubmissions(prev => [sub, ...prev]);
    const cand = candidates.find(c => c.id === s.candidateId);
    const req = requisitions.find(r => r.id === s.reqId);
    if (cand && req) {
      logActivity(currentUser.name, "submitted", cand.id, cand.name, `to ${req.refId} at $${s.rate}/hr`);
    }
    addToast("Submission created");
  }, [candidates, requisitions, currentUser.name, logActivity, addToast]);

  const updateSubmission = useCallback((id: string, updates: Partial<Submission>) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addToast("Submission updated");
  }, [addToast]);

  const deleteSubmission = useCallback((id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    addToast("Submission deleted", "info");
  }, [addToast]);

  // Tasks
  const addTask = useCallback((title: string) => {
    setTasks(prev => [{ id: generateId(), title, done: false, date: new Date().toISOString().slice(0, 10) }, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // Team
  const addTeamMember = useCallback((m: Omit<TeamMember, "id">) => {
    setTeam(prev => [...prev, { ...m, id: generateId() }]);
    addToast(`Team member ${m.name} added`);
  }, [addToast]);

  const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addToast("Team member updated");
  }, [addToast]);

  const deleteTeamMember = useCallback((id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    addToast("Team member removed", "info");
  }, [addToast]);

  // Dropdowns
  const addDropdownOption = useCallback((key: keyof DropdownOptions, value: string) => {
    setDropdowns(prev => ({ ...prev, [key]: [...prev[key], value] }));
  }, []);

  const removeDropdownOption = useCallback((key: keyof DropdownOptions, value: string) => {
    setDropdowns(prev => ({ ...prev, [key]: prev[key].filter(v => v !== value) }));
  }, []);

  // Notifications
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const value: CRMContextValue = {
    isAuthenticated, currentUser, login, logout,
    activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed,
    candidates, requisitions, clients, submissions, activities, tasks, team, notifications, dropdowns,
    addCandidate, updateCandidate, deleteCandidate,
    addRequisition, updateRequisition, deleteRequisition,
    addClient, updateClient, deleteClient,
    addSubmission, updateSubmission, deleteSubmission,
    addTask, toggleTask, deleteTask,
    addTeamMember, updateTeamMember, deleteTeamMember,
    addDropdownOption, removeDropdownOption,
    markAllNotificationsRead, markNotificationRead,
    logActivity,
    toasts, addToast, removeToast,
    confirmDialog, showConfirm, closeConfirm,
    searchQuery, setSearchQuery,
    selectedCandidateId, setSelectedCandidateId,
    selectedRequisitionId, setSelectedRequisitionId,
    selectedClientId, setSelectedClientId,
    showNewRecordModal, setShowNewRecordModal,
    newRecordType, setNewRecordType,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}
