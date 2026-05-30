"use client";

import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="crm-theme">
      {children}
    </ThemeProvider>
  );
}
