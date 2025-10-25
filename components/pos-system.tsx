"use client"

import { useState, useEffect, useMemo } from "react"
import { ProductGrid } from "./product-grid"
import { ShoppingCart } from "./shopping-cart"
import { SaleSuccessModal } from "./sale-success-modal"
import { QuantityModal } from "./quantity-modal"
import { SalesHistoryModal } from "./sales-history-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Trash2, History, CarIcon as CartIcon } from "lucide-react"

export interface Product {
  id: number
  name: string
  sku: string
  price: number
  current_stock: number
  category_id: number
  category_name: string
  unit_abbr: string
}

export interface CartItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  total: number
  max_stock: number
}

export interface Customer {
  id: number
  name: string
}

export function POSSystem() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastSale, setLastSale] = useState<{ invoice: string; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    loadProducts()
    loadCustomers()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error loading customers:", error)
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setShowQuantityModal(true)
  }

  const handleQuantitySelect = (quantity: number) => {
    if (!selectedProduct) return

    const existingItem = cart.find((item) => item.id === selectedProduct.id)

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity <= selectedProduct.current_stock) {
        setCart(
          cart.map((item) =>
            item.id === selectedProduct.id ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
          ),
        )
      } else {
        alert("No hay suficiente stock disponible")
      }
    } else {
      if (quantity <= selectedProduct.current_stock) {
        setCart([
          ...cart,
          {
            id: selectedProduct.id,
            name: selectedProduct.name,
            sku: selectedProduct.sku,
            price: selectedProduct.price,
            quantity: quantity,
            total: selectedProduct.price * quantity,
            max_stock: selectedProduct.current_stock,
          },
        ])
      } else {
        alert("No hay suficiente stock disponible")
      }
    }

    setShowQuantityModal(false)
    setSelectedProduct(null)
  }

  const updateQuantity = (productId: number, change: number) => {
    const item = cart.find((item) => item.id === productId)
    if (!item) return

    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== productId))
      return
    }

    if (newQuantity > item.max_stock) {
      alert("No hay suficiente stock disponible")
      return
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
      ),
    )
  }

  const clearCart = () => {
    if (cart.length > 0 && confirm("¿Estás seguro de que deseas limpiar el carrito?")) {
      setCart([])
    }
  }

  const processSale = async (saleData: {
    customerId: string
    paymentMethod: string
    notes: string
    customerName?: string
  }) => {
    if (cart.length === 0) {
      alert("El carrito está vacío")
      return
    }

    const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.19 // 19% IVA
    const total = subtotal + tax

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: saleData.customerId || null,
          customer_name: saleData.customerName || "Cliente General",
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
          payment_method: saleData.paymentMethod,
          notes: saleData.notes,
          items: cart.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        if (typeof window !== "undefined") {
          const sales = JSON.parse(localStorage.getItem("sales_history") || "[]")
          sales.unshift(result.sale)
          if (sales.length > 100) sales.pop()
          localStorage.setItem("sales_history", JSON.stringify(sales))
        }

        setLastSale({
          invoice: result.sale.invoice_number,
          total: total,
        })
        setShowSuccessModal(true)
        setCart([])
        loadProducts() // update stock
      } else {
        alert("Error al procesar la venta: " + result.error)
      }
    } catch (error) {
      alert("Error al procesar la venta: " + error)
    }
  }

  // ===== Responsive goodies =====
  const itemCount = useMemo(() => cart.reduce((n, it) => n + it.quantity, 0), [cart])
  const totalCart = useMemo(() => cart.reduce((n, it) => n + it.total, 0), [cart])

  const categories = [
    { id: "all", name: "Todos" },
    { id: "1", name: "Detergentes" },
    { id: "2", name: "Desinfectantes" },
    { id: "3", name: "Limpiadores" },
    { id: "4", name: "Ambientadores" },
    { id: "5", name: "Cuidado Personal" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando sistema POS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 max-w-[1600px] min-h-screen flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Punto de Venta</h1>

        <div className="flex items-center gap-2">
          {/* Mobile-only clear button */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden shrink-0 bg-transparent"
            onClick={clearCart}
            aria-label="Limpiar carrito"
            disabled={cart.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Desktop history button */}
          <Button
            variant="secondary"
            size="sm"
            className="hidden lg:inline-flex shrink-0"
            onClick={() => setShowHistoryModal(true)}
          >
            <History className="w-4 h-4 mr-2" />
            Historial
          </Button>

          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="default" size="sm" className="lg:hidden shrink-0 relative">
                <CartIcon className="w-4 h-4 mr-1.5" />
                <span className="hidden xs:inline">Carrito</span>
                {itemCount > 0 && (
                  <Badge
                    className="ml-1.5 px-1.5 min-w-[20px] h-5 flex items-center justify-center"
                    variant="secondary"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
              <SheetHeader className="px-4 sm:px-6 py-4 shrink-0">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  <CartIcon className="w-5 h-5" />
                  Carrito
                  {itemCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {itemCount}
                    </Badge>
                  )}
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <ShoppingCart
                  cart={cart}
                  customers={customers}
                  onUpdateQuantity={updateQuantity}
                  onProcessSale={(data) => {
                    processSale(data)
                    setCartOpen(false)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <Input
          type="search"
          placeholder="Buscar productos por nombre o SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 sm:h-11"
        />
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="shrink-0 h-9"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-0 pb-20 lg:pb-0">
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col lg:col-span-2 min-h-[400px] lg:min-h-0">
          <div className="flex-1 overflow-y-auto -mx-4 px-4 sm:-mx-6 sm:px-6">
            <ProductGrid
              products={products}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onAddToCart={handleProductClick}
            />
          </div>
        </div>

        <div className="hidden lg:flex flex-col bg-card border border-border rounded-lg p-6 min-h-0 max-h-[calc(100vh-12rem)] sticky top-6">
          <div className="flex-1 overflow-y-auto -mx-6 px-6 mb-4">
            <ShoppingCart
              cart={cart}
              customers={customers}
              onUpdateQuantity={updateQuantity}
              onProcessSale={processSale}
            />
          </div>

          <div className="shrink-0 space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{itemCount} ítem(s)</span>
              <span className="font-semibold text-lg text-foreground">${totalCart.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setShowHistoryModal(true)}>
                <History className="w-4 h-4 mr-2" />
                Historial
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-50">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border-2 bg-card shadow-lg p-3 sm:p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">Total del carrito</div>
              <div className="text-xl sm:text-2xl font-bold truncate">${totalCart.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                disabled={cart.length === 0}
                className="hidden xs:flex bg-transparent"
              >
                <Trash2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Vaciar</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCartOpen(true)}
                disabled={cart.length === 0}
                className="min-w-[100px]"
              >
                <CartIcon className="w-4 h-4 mr-2" />
                Pagar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showQuantityModal && selectedProduct && (
        <QuantityModal
          product={selectedProduct}
          onSelect={handleQuantitySelect}
          onClose={() => {
            setShowQuantityModal(false)
            setSelectedProduct(null)
          }}
        />
      )}

      {showSuccessModal && lastSale && (
        <SaleSuccessModal
          invoice={lastSale.invoice}
          total={lastSale.total}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showHistoryModal && <SalesHistoryModal onClose={() => setShowHistoryModal(false)} />}
    </div>
  )
}
