import { NextResponse } from "next/server"

// Mock data - In a real app, this would come from your database
const mockCustomers = [
  {
    id: 2,
    name: "María González",
  },
  {
    id: 3,
    name: "Juan Pérez",
  },
  {
    id: 4,
    name: "Empresa ABC S.A.S.",
  },
]

export async function GET() {
  try {
    return NextResponse.json(mockCustomers)
  } catch (error) {
    return NextResponse.json({ error: "Error loading customers" }, { status: 500 })
  }
}
