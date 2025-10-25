"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsChecking(false)
      return
    }

    const authStatus = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(!!authStatus)

    // Si no está autenticado y no está en la página de login, redirigir
    if (!authStatus && pathname !== "/login") {
      router.push("/login")
    }

    setIsChecking(false)
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  // Si es la página de login, mostrar solo el contenido sin sidebar
  if (pathname === "/login") {
    return <>{children}</>
  }

  // Si está autenticado, mostrar el layout completo con sidebar
  if (isAuthenticated) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    )
  }

  // Fallback mientras redirige
  return null
}
