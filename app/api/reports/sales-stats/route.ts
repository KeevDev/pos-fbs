import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") || "7"

    // TODO: Query database for actual sales statistics
    // Mock data for demonstration
    const stats = {
      total_sales: 145,
      total_revenue: 8750000,
      total_items_sold: 3420,
      average_sale: 60344,
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Error loading sales stats" }, { status: 500 })
  }
}
