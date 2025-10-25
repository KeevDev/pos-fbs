import { NextResponse } from "next/server"

// Mock categories data - replace with actual database queries
const categories = [
  { id: 1, name: "Detergentes" },
  { id: 2, name: "Desinfectantes" },
  { id: 3, name: "Limpiadores" },
  { id: 4, name: "Ambientadores" },
  { id: 5, name: "Cuidado Personal" },
]

export async function GET() {
  try {
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 })
  }
}
