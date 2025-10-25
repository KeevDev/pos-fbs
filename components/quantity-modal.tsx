"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Product } from "./pos-system"

interface QuantityModalProps {
  product: Product
  onSelect: (quantity: number) => void
  onClose: () => void
}

interface QuantityOption {
  id: string
  label: string
  quantity: number
}

const quantityOptions: QuantityOption[] = [
  { id: "unit", label: "Unidad (1 und)", quantity: 1 },
  { id: "half-pallet", label: "Medio Pale (120 und)", quantity: 120 },
  { id: "pallet", label: "Pale (240 und)", quantity: 240 },
  { id: "ramp", label: "Rampa (24 pales - 5,760 und)", quantity: 5760 },
]

export function QuantityModal({ product, onSelect, onClose }: QuantityModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")

  const handleConfirm = () => {
    const option = quantityOptions.find((opt) => opt.id === selectedOption)
    if (option) {
      onSelect(option.quantity)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Seleccionar Cantidad</h2>
            <p className="text-sm text-muted-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Precio Unitario:</span>
            <span className="font-semibold text-foreground">${product.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Stock Disponible:</span>
            <span className="font-semibold text-foreground">
              {product.current_stock.toLocaleString()} {product.unit_abbr}
            </span>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="space-y-4 mb-6">
          <Label htmlFor="quantity-type" className="text-sm font-medium">
            Tipo de Cantidad
          </Label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger id="quantity-type">
              <SelectValue placeholder="Seleccione el tipo de cantidad" />
            </SelectTrigger>
            <SelectContent>
              {quantityOptions.map((option) => {
                const isAvailable = option.quantity <= product.current_stock
                return (
                  <SelectItem key={option.id} value={option.id} disabled={!isAvailable}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {!isAvailable && <span className="text-xs text-destructive">Stock insuficiente</span>}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          {/* Preview Total */}
          {selectedOption && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Total a agregar:</span>
                <span className="text-lg font-bold text-primary">
                  $
                  {(
                    product.price * (quantityOptions.find((opt) => opt.id === selectedOption)?.quantity || 0)
                  ).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {quantityOptions.find((opt) => opt.id === selectedOption)?.quantity.toLocaleString()} unidades × $
                {product.price.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedOption} className="flex-1">
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </div>
  )
}
