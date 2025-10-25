"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Calendar, DollarSign, CreditCard, Receipt, Eye } from "lucide-react"

interface SaleItem {
  product_id: number
  product_name: string
  quantity: number
  price: number
  total: number
}

interface Sale {
  id: string
  invoice_number: string
  date: string
  customer_name: string
  subtotal: number
  tax: number
  total: number
  payment_method: string
  notes: string
  items: SaleItem[]
}

interface SalesHistoryModalProps {
  onClose: () => void
}

export function SalesHistoryModal({ onClose }: SalesHistoryModalProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSales()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSales(sales)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredSales(
        sales.filter(
          (sale) =>
            sale.invoice_number.toLowerCase().includes(query) ||
            sale.customer_name.toLowerCase().includes(query) ||
            sale.payment_method.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, sales])

  const loadSales = async () => {
    try {
      if (typeof window !== "undefined") {
        const salesData = localStorage.getItem("sales_history")
        if (salesData) {
          const parsedSales = JSON.parse(salesData)
          setSales(parsedSales)
          setFilteredSales(parsedSales)
        }
      }
    } catch (error) {
      console.error("Error loading sales:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentMethodBadge = (method: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      efectivo: "default",
      tarjeta: "secondary",
      transferencia: "outline",
    }
    return variants[method] || "outline"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-6 h-6 text-primary" />
            Historial de Ventas
          </DialogTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por factura, cliente o método de pago..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 flex-1 overflow-hidden">
          {/* Sales List */}
          <div className="flex flex-col h-full overflow-hidden">
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Cargando ventas...</p>
                  </div>
                </div>
              ) : filteredSales.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center">
                    <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No se encontraron ventas</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pr-4">
                  {filteredSales.map((sale) => (
                    <div
                      key={sale.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedSale?.id === sale.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setSelectedSale(sale)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{sale.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">{sale.customer_name}</p>
                        </div>
                        <Badge variant={getPaymentMethodBadge(sale.payment_method)}>{sale.payment_method}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(sale.date)}
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-primary">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(sale.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Sale Details */}
          <div className="border-l pl-4 flex flex-col h-full overflow-hidden">
            {selectedSale ? (
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-bold mb-2">{selectedSale.invoice_number}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cliente</p>
                        <p className="font-medium">{selectedSale.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fecha</p>
                        <p className="font-medium">{formatDate(selectedSale.date)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Método de Pago</p>
                        <Badge variant={getPaymentMethodBadge(selectedSale.payment_method)} className="mt-1">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {selectedSale.payment_method}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedSale.notes && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Notas</p>
                      <p className="text-sm">{selectedSale.notes}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Productos ({selectedSale.items.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedSale.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-card border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} x {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold">{formatCurrency(item.total)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(selectedSale.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IVA (19%)</span>
                      <span className="font-medium">{formatCurrency(selectedSale.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(selectedSale.total)}</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Selecciona una venta para ver los detalles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
