import { NextResponse } from "next/server"

// Mock raw materials data
const mockRawMaterials = [
  {
    id: 1,
    name: "Ácido Sulfónico",
    sku: "RM-ACID-SUL",
    description: "Agente activo para detergentes",
    unit_abbr: "kg",
    cost: 8500,
    current_stock: 250,
    min_stock: 100,
    active: true,
  },
  {
    id: 2,
    name: "Soda Cáustica",
    sku: "RM-SODA-CAU",
    description: "Base para productos de limpieza",
    unit_abbr: "kg",
    cost: 3200,
    current_stock: 180,
    min_stock: 150,
    active: true,
  },
  {
    id: 3,
    name: "Fragancia Lavanda",
    sku: "RM-FRAG-LAV",
    description: "Esencia aromática",
    unit_abbr: "lt",
    cost: 45000,
    current_stock: 25,
    min_stock: 20,
    active: true,
  },
  {
    id: 4,
    name: "Colorante Azul",
    sku: "RM-COL-AZU",
    description: "Colorante para productos",
    unit_abbr: "kg",
    cost: 12000,
    current_stock: 15,
    min_stock: 30,
    active: true,
  },
]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return NextResponse.json(mockRawMaterials)
  } catch (error) {
    return NextResponse.json({ error: "Error loading raw materials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, sku, description, cost, min_stock } = body

    // TODO: Insert raw material into database

    return NextResponse.json({ success: true, id: Math.floor(Math.random() * 10000) })
  } catch (error) {
    return NextResponse.json({ error: "Error creating raw material" }, { status: 500 })
  }
}
