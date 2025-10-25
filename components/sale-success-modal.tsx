"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Printer, Download } from "lucide-react"

interface SaleSuccessModalProps {
  invoice: string
  total: number
  onClose: () => void
}

export function SaleSuccessModal({ invoice, total, onClose }: SaleSuccessModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePrint = () => {
    alert("Función de impresión no implementada en la demo")
  }

  const handleDownload = () => {
    alert("Función de descarga no implementada en la demo")
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">¡Venta Exitosa!</DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Factura:</p>
            <p className="font-bold text-lg">{invoice}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total:</p>
            <p className="font-bold text-2xl text-primary">{formatCurrency(total)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>
          <Button onClick={onClose} className="w-full">
            Nueva Venta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
