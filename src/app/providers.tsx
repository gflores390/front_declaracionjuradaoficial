"use client";

import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {children}
      <Toaster richColors position="top-center" />
    </SidebarProvider>
  );
}
