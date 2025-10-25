"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lock, User, Droplets, Waves } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Credenciales quemadas
    if (username === "berna" && password === "berna") {
      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("username", username)
      }
      router.push("/")
    } else {
      setError("Usuario o contraseña incorrectos")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-cyan-900 to-blue-800 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Floating bubbles effect */}
        <Droplets
          className="absolute top-1/4 left-1/4 w-8 h-8 text-cyan-300/20 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <Droplets
          className="absolute top-3/4 right-1/4 w-6 h-6 text-blue-300/20 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <Droplets
          className="absolute top-1/2 right-1/3 w-10 h-10 text-teal-300/20 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
        <Waves className="absolute bottom-1/4 left-1/3 w-12 h-12 text-cyan-400/20 animate-pulse" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-cyan-700/50 bg-white/95 backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
            <Sparkles className="w-10 h-10 text-white relative z-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-800 bg-clip-text text-transparent">
              FBS System
            </CardTitle>
            <p className="text-sm font-medium text-cyan-700">Fábrica de Detergentes</p>
          </div>
          <CardDescription className="text-base text-slate-600">
            Sistema de gestión integral para producción y ventas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                Usuario
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600 transition-colors group-focus-within:text-cyan-700" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-11 h-12 border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all rounded-xl"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Contraseña
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600 transition-colors group-focus-within:text-cyan-700" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 border-2 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 text-sm p-3 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 hover:from-cyan-700 hover:via-blue-700 hover:to-blue-800 text-white font-semibold shadow-xl shadow-cyan-500/40 transition-all hover:shadow-2xl hover:shadow-cyan-500/50 rounded-xl text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Iniciar Sesión
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
