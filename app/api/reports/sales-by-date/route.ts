import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") || "7"

    // TODO: Query database for sales by date
    // Mock data for demonstration
    const salesByDate = [
      { date: "2025-01-21", sales_count: 23, revenue: 1450000 },
      { date: "2025-01-20", sales_count: 19, revenue: 1180000 },
      { date: "2025-01-19", sales_count: 21, revenue: 1320000 },
      { date: "2025-01-18", sales_count: 18, revenue: 1090000 },
      { date: "2025-01-17", sales_count: 25, revenue: 1580000 },
      { date: "2025-01-16", sales_count: 20, revenue: 1240000 },
      { date: "2025-01-15", sales_count: 19, revenue: 1190000 },
    ]

    return NextResponse.json(salesByDate)
  } catch (error) {
    return NextResponse.json({ error: "Error loading sales by date" }, { status: 500 })
  }
}
