import { NextResponse } from "next/server"

// Mock data - In a real app, this would come from your database
const mockProducts = [
  {
    id: 1,
    name: "Detergente Ariel 1kg",
    sku: "DET-ARI-1KG",
    price: 12500,
    current_stock: 50,
    category_id: 1,
    category_name: "Detergentes",
    unit_abbr: "kg",
  },
  {
    id: 2,
    name: "Desinfectante Lysol 500ml",
    sku: "DES-LYS-500ML",
    price: 8900,
    current_stock: 75,
    category_id: 2,
    category_name: "Desinfectantes",
    unit_abbr: "ml",
  },
  {
    id: 3,
    name: "Limpiador Mr. Músculo 750ml",
    sku: "LIM-MRM-750ML",
    price: 7800,
    current_stock: 60,
    category_id: 3,
    category_name: "Limpiadores",
    unit_abbr: "ml",
  },
  {
    id: 4,
    name: "Ambientador Glade 300ml",
    sku: "AMB-GLA-300ML",
    price: 6500,
    current_stock: 100,
    category_id: 4,
    category_name: "Ambientadores",
    unit_abbr: "ml",
  },
  {
    id: 5,
    name: "Jabón Dove 90gr",
    sku: "JAB-DOV-90GR",
    price: 3200,
    current_stock: 120,
    category_id: 5,
    category_name: "Cuidado Personal",
    unit_abbr: "gr",
  },
  {
    id: 6,
    name: "Detergente Fab 2kg",
    sku: "DET-FAB-2KG",
    price: 18900,
    current_stock: 30,
    category_id: 1,
    category_name: "Detergentes",
    unit_abbr: "kg",
  },
  {
    id: 7,
    name: "Desinfectante Pinesol 1lt",
    sku: "DES-PIN-1LT",
    price: 11200,
    current_stock: 45,
    category_id: 2,
    category_name: "Desinfectantes",
    unit_abbr: "lt",
  },
  {
    id: 8,
    name: "Limpiador Ajax 500ml",
    sku: "LIM-AJX-500ML",
    price: 4900,
    current_stock: 80,
    category_id: 3,
    category_name: "Limpiadores",
    unit_abbr: "ml",
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockProducts)
  } catch (error) {
    return NextResponse.json({ error: "Error loading products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, sku, description, category_id, price, cost, min_stock } = body

    // TODO: Insert product into database
    // const result = await db.query(
    //   'INSERT INTO products (name, sku, description, category_id, unit_id, price, cost, min_stock) VALUES ($1, $2, $3, $4, 1, $5, $6, $7) RETURNING id',
    //   [name, sku, description, category_id, price, cost || 0, min_stock || 0]
    // )

    return NextResponse.json({ success: true, id: Math.floor(Math.random() * 10000) })
  } catch (error) {
    return NextResponse.json({ error: "Error creating product" }, { status: 500 })
  }
}
