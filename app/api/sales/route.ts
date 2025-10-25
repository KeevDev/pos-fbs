import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json([])
  } catch (error) {
    console.error("[v0] Error fetching sales:", error)
    return NextResponse.json({ error: "Error fetching sales" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate invoice number
    const invoiceNumber =
      "FAC-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0")

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const saleData = {
      id: Date.now().toString(),
      invoice_number: invoiceNumber,
      date: new Date().toISOString(),
      customer_id: body.customer_id,
      customer_name: body.customer_name || "Cliente General",
      subtotal: Number.parseFloat(body.subtotal),
      tax: Number.parseFloat(body.tax),
      total: Number.parseFloat(body.total),
      payment_method: body.payment_method,
      notes: body.notes || "",
      items: body.items,
    }

    return NextResponse.json({
      success: true,
      sale: saleData,
    })
  } catch (error) {
    console.error("[v0] Error processing sale:", error)
    return NextResponse.json({ error: "Error processing sale" }, { status: 500 })
  }
}
