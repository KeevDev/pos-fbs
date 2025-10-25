import { NextResponse } from "next/server"

// Mock suppliers data
const mockSuppliers = [
  {
    id: 1,
    name: "Químicos del Sur S.A.",
    contact_name: "Carlos Rodríguez",
    phone: "+57 300 123 4567",
  },
  {
    id: 2,
    name: "Fragancias Premium Ltda.",
    contact_name: "María González",
    phone: "+57 310 987 6543",
  },
  {
    id: 3,
    name: "Distribuidora Industrial",
    contact_name: "Juan Pérez",
    phone: "+57 320 456 7890",
  },
]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return NextResponse.json(mockSuppliers)
  } catch (error) {
    return NextResponse.json({ error: "Error loading suppliers" }, { status: 500 })
  }
}
