export type ViewType =
  | "dashboard"
  | "candidates"
  | "pipeline"
  | "requisitions"
  | "clients"
  | "submissions"
  | "reports"
  | "settings";

export interface Candidate {
  id: string;
  name: string;
  status: string;
  jobTitle: string;
  city: string;
  state: string;
  exp: number;
  visa: string;
  rating: number;
  owner: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedinCreatedYear: string;
  employer: string;
  employerContactName: string;
  employerContactEmail: string;
  employerContactPhone: string;
  workAuth: string;
  technicalResult: string;
  docs: {
    resume: boolean;
    visaCopy: boolean;
    certs: boolean;
  };
  resumeName: string;
  resumeSize: string;
}

export interface Requisition {
  id: string;
  refId: string;
  title: string;
  client: string;
  rateMin: number;
  rateMax: number;
  status: string;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  type: "Client" | "Vendor" | "Both";
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  activeReqs: number;
}

export interface Submission {
  id: string;
  candidateId: string;
  reqId: string;
  rate: number;
  type: string;
  date: string;
  status: string;
}

export interface Activity {
  id: string;
  actor: string;
  action: string;
  targetId: string;
  targetName: string;
  details: string;
  time: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Notification {
  id: string;
  text: string;
  read: boolean;
}

export interface DropdownOptions {
  status: string[];
  visa: string[];
  workAuth: string[];
  roles: string[];
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export interface ConfirmDialog {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}
