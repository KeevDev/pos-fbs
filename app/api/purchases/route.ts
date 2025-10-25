import { NextResponse } from "next/server"

// Mock purchase orders data
const mockPurchases = [
  {
    id: 1,
    order_number: "PO-2025-001",
    supplier_name: "Químicos del Sur S.A.",
    subtotal: 850000,
    tax: 161500,
    total: 1011500,
    status: "received",
    order_date: "2025-01-10T10:00:00",
    received_date: "2025-01-12T14:30:00",
    items_count: 3,
  },
  {
    id: 2,
    order_number: "PO-2025-002",
    supplier_name: "Fragancias Premium Ltda.",
    subtotal: 450000,
    tax: 85500,
    total: 535500,
    status: "pending",
    order_date: "2025-01-18T09:00:00",
    received_date: null,
    items_count: 2,
  },
]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return NextResponse.json(mockPurchases)
  } catch (error) {
    return NextResponse.json({ error: "Error loading purchase orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supplier_id, subtotal, tax, total, notes, items } = body

    // TODO: Insert purchase order into database
    // Update raw materials stock

    return NextResponse.json({
      success: true,
      id: Math.floor(Math.random() * 10000),
      order_number: `PO-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error creating purchase order" }, { status: 500 })
  }
}
