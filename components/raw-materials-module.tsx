"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Boxes, AlertTriangle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RawMaterial {
  id: number
  name: string
  sku: string
  description: string
  unit_abbr: string
  cost: number
  current_stock: number
  min_stock: number
  active: boolean
}

interface Recipe {
  id: number
  product_id: number
  product_name: string
  raw_material_id: number
  raw_material_name: string
  quantity_needed: number
  unit_abbr: string
}

export function RawMaterialsModule() {
  const [materials, setMaterials] = useState<RawMaterial[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [showRecipeModal, setShowRecipeModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null)
  const [loading, setLoading] = useState(true)

  const [materialForm, setMaterialForm] = useState({
    name: "",
    sku: "",
    description: "",
    cost: "",
    min_stock: "",
  })

  const [recipeForm, setRecipeForm] = useState({
    product_id: "",
    raw_material_id: "",
    quantity_needed: "",
  })

  useEffect(() => {
    loadMaterials()
    loadRecipes()
    loadProducts()
  }, [])

  const loadMaterials = async () => {
    try {
      const response = await fetch("/api/raw-materials")
      const data = await response.json()
      setMaterials(data)
    } catch (error) {
      console.error("Error loading raw materials:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecipes = async () => {
    try {
      const response = await fetch("/api/recipes")
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error("Error loading recipes:", error)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingMaterial ? `/api/raw-materials/${editingMaterial.id}` : "/api/raw-materials"
    const method = editingMaterial ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialForm),
      })

      if (response.ok) {
        loadMaterials()
        handleCloseMaterialModal()
      } else {
        const error = await response.json()
        alert("Error: " + error.error)
      }
    } catch (error) {
      alert("Error al guardar la materia prima")
    }
  }

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeForm),
      })

      if (response.ok) {
        loadRecipes()
        handleCloseRecipeModal()
      } else {
        const error = await response.json()
        alert("Error: " + error.error)
      }
    } catch (error) {
      alert("Error al guardar la receta")
    }
  }

  const handleEdit = (material: RawMaterial) => {
    setEditingMaterial(material)
    setMaterialForm({
      name: material.name,
      sku: material.sku,
      description: material.description || "",
      cost: material.cost?.toString() || "",
      min_stock: material.min_stock.toString(),
    })
    setShowMaterialModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta materia prima?")) return

    try {
      const response = await fetch(`/api/raw-materials/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadMaterials()
      } else {
        alert("Error al eliminar la materia prima")
      }
    } catch (error) {
      alert("Error al eliminar la materia prima")
    }
  }

  const handleDeleteRecipe = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta receta?")) return

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadRecipes()
      } else {
        alert("Error al eliminar la receta")
      }
    } catch (error) {
      alert("Error al eliminar la receta")
    }
  }

  const handleCloseMaterialModal = () => {
    setShowMaterialModal(false)
    setEditingMaterial(null)
    setMaterialForm({
      name: "",
      sku: "",
      description: "",
      cost: "",
      min_stock: "",
    })
  }

  const handleCloseRecipeModal = () => {
    setShowRecipeModal(false)
    setRecipeForm({
      product_id: "",
      raw_material_id: "",
      quantity_needed: "",
    })
  }

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando materias primas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Materias Prima</h1>
          <p className="text-muted-foreground">Gestiona las materias primas y recetas de productos</p>
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="materials">Materias Prima</TabsTrigger>
          <TabsTrigger value="recipes">Recetas de Productos</TabsTrigger>
        </TabsList>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar materias primas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowMaterialModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Materia Prima
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                  <TableHead className="text-right">Stock Actual</TableHead>
                  <TableHead className="text-right">Stock Mín.</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Boxes className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron materias primas</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-mono text-sm">{material.sku}</TableCell>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell className="text-right">
                        {material.cost ? `$${material.cost.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            material.current_stock <= material.min_stock
                              ? "text-destructive font-semibold flex items-center justify-end gap-1"
                              : ""
                          }
                        >
                          {material.current_stock <= material.min_stock && <AlertTriangle className="w-4 h-4" />}
                          {material.current_stock} {material.unit_abbr}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {material.min_stock} {material.unit_abbr}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(material)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(material.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Recipes Tab */}
        <TabsContent value="recipes">
          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowRecipeModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Receta
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Materia Prima</TableHead>
                  <TableHead className="text-right">Cantidad Necesaria</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <Boxes className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron recetas</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  recipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell className="font-medium">{recipe.product_name}</TableCell>
                      <TableCell>{recipe.raw_material_name}</TableCell>
                      <TableCell className="text-right">
                        {recipe.quantity_needed} {recipe.unit_abbr}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRecipe(recipe.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingMaterial ? "Editar Materia Prima" : "Nueva Materia Prima"}
            </h2>

            <form onSubmit={handleMaterialSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={materialForm.name}
                    onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={materialForm.sku}
                    onChange={(e) => setMaterialForm({ ...materialForm, sku: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost">Costo</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={materialForm.cost}
                    onChange={(e) => setMaterialForm({ ...materialForm, cost: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="min_stock">Stock Mínimo *</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    value={materialForm.min_stock}
                    onChange={(e) => setMaterialForm({ ...materialForm, min_stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseMaterialModal}
                  className="flex-1 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingMaterial ? "Actualizar" : "Crear"} Materia Prima
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Nueva Receta</h2>

            <form onSubmit={handleRecipeSubmit} className="space-y-4">
              <div>
                <Label htmlFor="product">Producto *</Label>
                <select
                  id="product"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={recipeForm.product_id}
                  onChange={(e) => setRecipeForm({ ...recipeForm, product_id: e.target.value })}
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="raw_material">Materia Prima *</Label>
                <select
                  id="raw_material"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={recipeForm.raw_material_id}
                  onChange={(e) => setRecipeForm({ ...recipeForm, raw_material_id: e.target.value })}
                  required
                >
                  <option value="">Seleccionar materia prima</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="quantity">Cantidad Necesaria *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={recipeForm.quantity_needed}
                  onChange={(e) => setRecipeForm({ ...recipeForm, quantity_needed: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseRecipeModal}
                  className="flex-1 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Crear Receta
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
