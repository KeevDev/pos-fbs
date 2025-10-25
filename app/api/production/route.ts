import { NextResponse } from "next/server"

// Mock production orders data
const mockOrders = [
  {
    id: 1,
    order_number: "PROD-2025-001",
    product_name: "Detergente Ariel 1kg",
    product_sku: "DET-ARI-1KG",
    quantity_to_produce: 500,
    quantity_produced: 500,
    status: "completed",
    start_date: "2025-01-15T08:00:00",
    completion_date: "2025-01-16T17:00:00",
    notes: "Producción completada sin inconvenientes",
    created_at: "2025-01-15T07:30:00",
  },
  {
    id: 2,
    order_number: "PROD-2025-002",
    product_name: "Desinfectante Lysol 500ml",
    product_sku: "DES-LYS-500ML",
    quantity_to_produce: 300,
    quantity_produced: 150,
    status: "in_progress",
    start_date: "2025-01-20T09:00:00",
    completion_date: null,
    notes: "En proceso de fabricación",
    created_at: "2025-01-20T08:00:00",
  },
  {
    id: 3,
    order_number: "PROD-2025-003",
    product_name: "Limpiador Mr. Músculo 750ml",
    product_sku: "LIM-MRM-750ML",
    quantity_to_produce: 400,
    quantity_produced: 0,
    status: "pending",
    start_date: null,
    completion_date: null,
    notes: "Pendiente de iniciar",
    created_at: "2025-01-21T10:00:00",
  },
]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return NextResponse.json(mockOrders)
  } catch (error) {
    return NextResponse.json({ error: "Error loading production orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product_id, quantity_to_produce, notes } = body

    // TODO: Insert production order into database
    // Generate order number, check raw materials availability, etc.

    return NextResponse.json({
      success: true,
      id: Math.floor(Math.random() * 10000),
      order_number: `PROD-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error creating production order" }, { status: 500 })
  }
}
