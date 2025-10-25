import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "sales"
    const days = searchParams.get("days") || "7"

    // TODO: Generate actual Excel file using a library like xlsx
    // For now, return a simple CSV format

    let csvContent = ""
    let filename = ""

    switch (type) {
      case "sales":
        csvContent = "Fecha,Factura,Cliente,Total\n"
        csvContent += "2025-01-21,INV-001,Cliente 1,125000\n"
        csvContent += "2025-01-21,INV-002,Cliente 2,89000\n"
        filename = "ventas.csv"
        break
      case "products":
        csvContent = "SKU,Nombre,Categoría,Precio,Stock\n"
        csvContent += "DET-ARI-1KG,Detergente Ariel 1kg,Detergentes,12500,50\n"
        csvContent += "DES-LYS-500ML,Desinfectante Lysol 500ml,Desinfectantes,8900,75\n"
        filename = "productos.csv"
        break
      case "inventory":
        csvContent = "Producto,Stock Actual,Stock Mínimo,Estado\n"
        csvContent += "Detergente Ariel 1kg,50,20,OK\n"
        csvContent += "Desinfectante Lysol 500ml,75,30,OK\n"
        filename = "inventario.csv"
        break
      case "purchases":
        csvContent = "Orden,Proveedor,Fecha,Total\n"
        csvContent += "PO-001,Proveedor 1,2025-01-15,1500000\n"
        csvContent += "PO-002,Proveedor 2,2025-01-18,890000\n"
        filename = "compras.csv"
        break
    }

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error exporting report" }, { status: 500 })
  }
}
