import { NextResponse } from "next/server"

// Mock recipes data
const mockRecipes = [
  {
    id: 1,
    product_id: 1,
    product_name: "Detergente Ariel 1kg",
    raw_material_id: 1,
    raw_material_name: "Ácido Sulfónico",
    quantity_needed: 0.35,
    unit_abbr: "kg",
  },
  {
    id: 2,
    product_id: 1,
    product_name: "Detergente Ariel 1kg",
    raw_material_id: 2,
    raw_material_name: "Soda Cáustica",
    quantity_needed: 0.15,
    unit_abbr: "kg",
  },
  {
    id: 3,
    product_id: 1,
    product_name: "Detergente Ariel 1kg",
    raw_material_id: 3,
    raw_material_name: "Fragancia Lavanda",
    quantity_needed: 0.02,
    unit_abbr: "lt",
  },
]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return NextResponse.json(mockRecipes)
  } catch (error) {
    return NextResponse.json({ error: "Error loading recipes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product_id, raw_material_id, quantity_needed } = body

    // TODO: Insert recipe into database

    return NextResponse.json({ success: true, id: Math.floor(Math.random() * 10000) })
  } catch (error) {
    return NextResponse.json({ error: "Error creating recipe" }, { status: 500 })
  }
}
