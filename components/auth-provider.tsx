"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsChecking(false)
      return
    }

    const isAuthenticated = localStorage.getItem("isAuthenticated")

    // Si no está autenticado y no está en la página de login, redirigir
    if (!isAuthenticated && pathname !== "/login") {
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

  return <>{children}</>
}
