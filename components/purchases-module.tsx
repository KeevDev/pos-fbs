"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ShoppingBag, Trash2, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RawMaterial {
  id: number
  name: string
  sku: string
  cost: number
  unit_abbr: string
}

interface Supplier {
  id: number
  name: string
  contact_name: string
  phone: string
}

interface PurchaseOrder {
  id: number
  order_number: string
  supplier_name: string
  subtotal: number
  tax: number
  total: number
  status: "pending" | "received" | "cancelled"
  order_date: string
  received_date: string | null
  items_count: number
}

interface CartItem {
  raw_material_id: number
  name: string
  sku: string
  quantity: number
  unit_price: number
  total: number
  unit_abbr: string
}

export function PurchasesModule() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [quantity, setQuantity] = useState("")

  useEffect(() => {
    loadOrders()
    loadRawMaterials()
    loadSuppliers()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/purchases")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error loading purchase orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRawMaterials = async () => {
    try {
      const response = await fetch("/api/raw-materials")
      const data = await response.json()
      setRawMaterials(data)
    } catch (error) {
      console.error("Error loading raw materials:", error)
    }
  }

  const loadSuppliers = async () => {
    try {
      const response = await fetch("/api/suppliers")
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Error loading suppliers:", error)
    }
  }

  const addToCart = () => {
    if (!selectedMaterial || !quantity) return

    const material = rawMaterials.find((m) => m.id.toString() === selectedMaterial)
    if (!material) return

    const qty = Number.parseFloat(quantity)
    const total = qty * material.cost

    const existingItem = cart.find((item) => item.raw_material_id === material.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.raw_material_id === material.id
            ? { ...item, quantity: item.quantity + qty, total: (item.quantity + qty) * item.unit_price }
            : item,
        ),
      )
    } else {
      setCart([
        ...cart,
        {
          raw_material_id: material.id,
          name: material.name,
          sku: material.sku,
          quantity: qty,
          unit_price: material.cost,
          total: total,
          unit_abbr: material.unit_abbr,
        },
      ])
    }

    setSelectedMaterial("")
    setQuantity("")
  }

  const removeFromCart = (materialId: number) => {
    setCart(cart.filter((item) => item.raw_material_id !== materialId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      alert("Debe agregar al menos un item a la orden")
      return
    }

    const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.19
    const total = subtotal + tax

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier_id: selectedSupplier,
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
          notes: notes,
          items: cart,
        }),
      })

      if (response.ok) {
        loadOrders()
        handleCloseModal()
      } else {
        const error = await response.json()
        alert("Error: " + error.error)
      }
    } catch (error) {
      alert("Error al crear la orden de compra")
    }
  }

  const markAsReceived = async (orderId: number) => {
    if (!confirm("¿Confirmar recepción de esta orden de compra?")) return

    try {
      const response = await fetch(`/api/purchases/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "received" }),
      })

      if (response.ok) {
        loadOrders()
      } else {
        alert("Error al actualizar el estado")
      }
    } catch (error) {
      alert("Error al actualizar el estado")
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCart([])
    setSelectedSupplier("")
    setNotes("")
    setSelectedMaterial("")
    setQuantity("")
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      received: { label: "Recibido", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const cartTax = cartSubtotal * 0.19
  const cartTotal = cartSubtotal + cartTax

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando órdenes de compra...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compras</h1>
          <p className="text-muted-foreground">Registra las compras de materias primas</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Compra
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por número de orden o proveedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="received">Recibido</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden #</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">IVA</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron órdenes de compra</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm font-semibold">{order.order_number}</TableCell>
                  <TableCell className="font-medium">{order.supplier_name}</TableCell>
                  <TableCell className="text-right">{order.items_count}</TableCell>
                  <TableCell className="text-right">${order.subtotal.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${order.tax.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">${order.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {order.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsReceived(order.id)}
                          title="Marcar como recibido"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Nueva Orden de Compra</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Supplier Selection */}
              <div>
                <Label htmlFor="supplier">Proveedor *</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name} - {supplier.contact_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Add Items */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Agregar Items</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <Label htmlFor="material">Materia Prima</Label>
                    <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <SelectTrigger id="material">
                        <SelectValue placeholder="Seleccionar materia prima" />
                      </SelectTrigger>
                      <SelectContent>
                        {rawMaterials.map((material) => (
                          <SelectItem key={material.id} value={material.id.toString()}>
                            {material.name} - ${material.cost.toLocaleString()} / {material.unit_abbr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Cantidad</Label>
                    <div className="flex gap-2">
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                      />
                      <Button type="button" onClick={addToCart}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Cart */}
                {cart.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Materia Prima</TableHead>
                          <TableHead className="text-right">Cantidad</TableHead>
                          <TableHead className="text-right">Precio Unit.</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map((item) => (
                          <TableRow key={item.raw_material_id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.sku}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantity} {item.unit_abbr}
                            </TableCell>
                            <TableCell className="text-right">${item.unit_price.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.raw_material_id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Totals */}
                    <div className="mt-4 space-y-2 border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${cartSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IVA (19%):</span>
                        <span>${cartTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${cartTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Observaciones adicionales..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={cart.length === 0 || !selectedSupplier}>
                  Crear Orden de Compra
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
