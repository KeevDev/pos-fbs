"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CarIcon as CartIcon, Plus, Minus, CreditCard, Banknote, Building } from "lucide-react"
import type { CartItem, Customer } from "./pos-system"

interface ShoppingCartProps {
  cart: CartItem[]
  customers: Customer[]
  onUpdateQuantity: (productId: number, change: number) => void
  onProcessSale: (saleData: { customerId: string; paymentMethod: string; notes: string; customerName: string }) => void
}

export function ShoppingCart({ cart, customers, onUpdateQuantity, onProcessSale }: ShoppingCartProps) {
  const [selectedCustomer, setSelectedCustomer] = useState("general")
  const [paymentMethod, setPaymentMethod] = useState("efectivo")
  const [notes, setNotes] = useState("")

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.19 // 19% IVA
  const total = subtotal + tax

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleProcessSale = () => {
    const customerName =
      selectedCustomer === "general"
        ? "Cliente General"
        : customers.find((c) => c.id.toString() === selectedCustomer)?.name || "Cliente General"

    onProcessSale({
      customerId: selectedCustomer,
      paymentMethod,
      notes,
      customerName,
    } as any)

    // Reset form
    setSelectedCustomer("general")
    setNotes("")
    setPaymentMethod("efectivo")
  }

  const paymentMethods = [
    { id: "efectivo", name: "Efectivo", icon: Banknote },
    { id: "tarjeta", name: "Tarjeta", icon: CreditCard },
    { id: "transferencia", name: "Transferencia", icon: Building },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
        <h3 className="text-lg font-semibold text-foreground">Carrito de Compras</h3>
        <span className="text-sm text-muted-foreground">{cart.length} items</span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto mb-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <CartIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center">Agrega productos al carrito</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-foreground truncate">{item.name}</h5>
                  <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} c/u</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 bg-transparent"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 bg-transparent"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-right min-w-0">
                  <p className="font-semibold text-primary text-sm">{formatCurrency(item.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary and Checkout */}
      {cart.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>IVA (19%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary border-t border-border pt-2">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente (Opcional)</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Cliente General" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Cliente General</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Método de Pago</Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Button
                    key={method.id}
                    variant={paymentMethod === method.id ? "default" : "outline"}
                    size="sm"
                    className="flex flex-col gap-1 h-auto py-3"
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea
              id="notes"
              placeholder="Notas adicionales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Process Sale Button */}
          <Button className="w-full py-3 text-lg font-semibold" onClick={handleProcessSale}>
            <CreditCard className="w-5 h-5 mr-2" />
            Cobrar
          </Button>
        </div>
      )}
    </div>
  )
}
