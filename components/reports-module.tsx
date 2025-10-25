"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SalesStats {
  total_sales: number
  total_revenue: number
  total_items_sold: number
  average_sale: number
}

interface TopProduct {
  product_name: string
  quantity_sold: number
  revenue: number
}

interface SalesByDate {
  date: string
  sales_count: number
  revenue: number
}

export function ReportsModule() {
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [salesByDate, setSalesByDate] = useState<SalesByDate[]>([])
  const [dateRange, setDateRange] = useState("7")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [dateRange])

  const loadReports = async () => {
    setLoading(true)
    try {
      const [statsRes, productsRes, salesRes] = await Promise.all([
        fetch(`/api/reports/sales-stats?days=${dateRange}`),
        fetch(`/api/reports/top-products?days=${dateRange}`),
        fetch(`/api/reports/sales-by-date?days=${dateRange}`),
      ])

      const stats = await statsRes.json()
      const products = await productsRes.json()
      const sales = await salesRes.json()

      setSalesStats(stats)
      setTopProducts(products)
      setSalesByDate(sales)
    } catch (error) {
      console.error("Error loading reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = async (reportType: string) => {
    try {
      const response = await fetch(`/api/reports/export?type=${reportType}&days=${dateRange}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `reporte_${reportType}_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert("Error al exportar el reporte")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">Estadísticas y reportes del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="dateRange" className="text-sm">
            Período:
          </Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger id="dateRange" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="statistics" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="exports">Exportar</TabsTrigger>
        </TabsList>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesStats?.total_sales || 0}</div>
                <p className="text-xs text-muted-foreground">Últimos {dateRange} días</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(salesStats?.total_revenue || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Últimos {dateRange} días</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(salesStats?.total_items_sold || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Últimos {dateRange} días</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Venta Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(salesStats?.average_sale || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Por transacción</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Top 10 productos por cantidad vendida</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad Vendida</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.product_name}</TableCell>
                      <TableCell className="text-right">{product.quantity_sold.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Fecha</CardTitle>
              <CardDescription>Resumen diario de ventas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Número de Ventas</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesByDate.map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{new Date(sale.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{sale.sales_count}</TableCell>
                      <TableCell className="text-right">${sale.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Inventario</CardTitle>
              <CardDescription>Estado actual del inventario de productos y materias primas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Reporte de inventario disponible próximamente</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exports Tab */}
        <TabsContent value="exports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Ventas</CardTitle>
                <CardDescription>Descarga un reporte detallado de todas las ventas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => exportToExcel("sales")} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Excel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportar Productos</CardTitle>
                <CardDescription>Descarga un reporte del catálogo de productos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => exportToExcel("products")} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Excel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportar Inventario</CardTitle>
                <CardDescription>Descarga un reporte del estado del inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => exportToExcel("inventory")} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Excel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exportar Compras</CardTitle>
                <CardDescription>Descarga un reporte de órdenes de compra</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => exportToExcel("purchases")} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
