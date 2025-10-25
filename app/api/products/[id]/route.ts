import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, sku, description, category_id, price, cost, min_stock } = body

    // TODO: Update product in database
    // const result = await db.query(
    //   'UPDATE products SET name=$1, sku=$2, description=$3, category_id=$4, price=$5, cost=$6, min_stock=$7, updated_at=NOW() WHERE id=$8',
    //   [name, sku, description, category_id, price, cost, min_stock, params.id]
    // )

    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    return NextResponse.json({ error: "Error updating product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Delete product from database (or mark as inactive)
    // const result = await db.query('UPDATE products SET active=false WHERE id=$1', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 })
  }
}
