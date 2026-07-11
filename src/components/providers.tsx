"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { getQueryClient } from "~/lib/query-client"
import { AuthProvider } from "./auth/auth-provider"
import { Toaster } from "./ui/sonner"
import { authClient } from "~/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        redirectTo="/settings/account"
        navigate={({ to, replace }) =>
          replace ? router.replace(to) : router.push(to)
        }
        plugins={[]}
        Link={Link}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}