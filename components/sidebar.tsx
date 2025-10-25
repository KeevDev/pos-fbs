"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Package,
  Factory,
  Boxes,
  ShoppingBag,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  name: string
  icon: React.ReactNode
  href: string
}

const menuItems: MenuItem[] = [
  {
    id: "sales",
    name: "Ventas",
    icon: <ShoppingCart className="w-5 h-5" />,
    href: "/",
  },
  {
    id: "products",
    name: "Productos",
    icon: <Package className="w-5 h-5" />,
    href: "/productos",
  },
  {
    id: "production",
    name: "Producción",
    icon: <Factory className="w-5 h-5" />,
    href: "/produccion",
  },
  {
    id: "raw-materials",
    name: "Materias Prima",
    icon: <Boxes className="w-5 h-5" />,
    href: "/materias-prima",
  },
  {
    id: "purchases",
    name: "Compras",
    icon: <ShoppingBag className="w-5 h-5" />,
    href: "/compras",
  },
  {
    id: "reports",
    name: "Reportes",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/reportes",
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300 shadow-xl",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-lg text-sidebar-foreground">FBS</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("ml-auto text-sidebar-foreground hover:bg-sidebar-accent", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 transition-all",
                  isCollapsed && "justify-center px-2",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-blue-500/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground hover:bg-red-500/10 hover:text-red-400",
            isCollapsed && "justify-center px-2",
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </Button>

        {!isCollapsed ? (
          <div className="text-xs text-sidebar-foreground/60 text-center pt-2">
            <p className="font-semibold">Sistema POS v1.0</p>
            <p>© 2025 Todos los derechos reservados</p>
          </div>
        ) : (
          <div className="text-xs text-sidebar-foreground/60 text-center">
            <p className="font-semibold">v1.0</p>
          </div>
        )}
      </div>
    </aside>
  )
}
