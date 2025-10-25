import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    // TODO: Update purchase order status in database
    // If status is 'received', update raw materials stock

    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    return NextResponse.json({ error: "Error updating purchase order" }, { status: 500 })
  }
}
