import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    // TODO: Update raw material in database
    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    return NextResponse.json({ error: "Error updating raw material" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Delete raw material from database
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting raw material" }, { status: 500 })
  }
}
