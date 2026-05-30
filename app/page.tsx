"use client";

import dynamic from "next/dynamic";

const CRMApp = dynamic(() => import("@/components/crm/crm-app").then(m => m.CRMApp), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="animate-pulse text-sm text-muted-foreground">Loading…</div>
    </div>
  ),
});

export default function Home() {
  return <CRMApp />;
}
