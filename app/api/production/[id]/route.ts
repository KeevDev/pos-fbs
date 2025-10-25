import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    // TODO: Update production order status in database
    // If status is 'completed', update product stock
    // If status is 'in_progress', set start_date
    // If status is 'completed', set completion_date

    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    return NextResponse.json({ error: "Error updating production order" }, { status: 500 })
  }
}
