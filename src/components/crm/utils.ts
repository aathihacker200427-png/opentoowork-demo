export function getStatusStyles(status: string): string {
  const map: Record<string, string> = {
    Sourced: "bg-muted text-muted-foreground",
    Verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Submitted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Interview: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Placed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Closed: "bg-muted text-muted-foreground",
    "On Hold": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Draft: "bg-muted text-muted-foreground",
    Accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Withdrawn: "bg-muted text-muted-foreground",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
