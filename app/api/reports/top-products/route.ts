import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") || "7"

    // TODO: Query database for top selling products
    // Mock data for demonstration
    const topProducts = [
      { product_name: "Detergente Ariel 1kg", quantity_sold: 450, revenue: 5625000 },
      { product_name: "Desinfectante Lysol 500ml", quantity_sold: 380, revenue: 3382000 },
      { product_name: "Limpiador Mr. Músculo 750ml", quantity_sold: 320, revenue: 2496000 },
      { product_name: "Ambientador Glade 300ml", quantity_sold: 290, revenue: 1885000 },
      { product_name: "Jabón Dove 90gr", quantity_sold: 520, revenue: 1664000 },
    ]

    return NextResponse.json(topProducts)
  } catch (error) {
    return NextResponse.json({ error: "Error loading top products" }, { status: 500 })
  }
}
