"use client";

import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
