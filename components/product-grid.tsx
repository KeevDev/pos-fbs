"use client"

import { Package } from "lucide-react"
import type { Product } from "./pos-system"

interface ProductGridProps {
  products: Product[]
  searchQuery: string
  selectedCategory: string
  onAddToCart: (product: Product) => void
}

export function ProductGrid({ products, searchQuery, selectedCategory, onAddToCart }: ProductGridProps) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category_id.toString() === selectedCategory
    return matchesSearch && matchesCategory && product.current_stock > 0
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-background border border-border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md hover:-translate-y-1"
            onClick={() => onAddToCart(product)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>

              <h4 className="font-medium text-sm mb-1 line-clamp-2 text-foreground">{product.name}</h4>

              <p className="text-xs text-muted-foreground mb-2 font-mono">{product.sku}</p>

              <div className="flex justify-between items-center w-full">
                <span className="font-semibold text-primary text-sm">{formatCurrency(product.price)}</span>
                <span className="text-xs text-muted-foreground">
                  {product.current_stock} {product.unit_abbr}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Package className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg mb-2">No se encontraron productos</p>
          <p className="text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  )
}
