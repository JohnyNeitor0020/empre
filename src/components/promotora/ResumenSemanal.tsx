import { useState } from 'react';
import { TotalesSemanal } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface ResumenSemanalProps {
  totales: TotalesSemanal;
  promotoraNombre: string;
}

export default function ResumenSemanal({ totales, promotoraNombre }: ResumenSemanalProps) {
  const [acordado, setAcordado] = useState(false);

  // Mock detailed data - in real app this would come from props
  const pagosEfectivo = [
    { cliente: 'Maria González', cantidad: 250 },
    { cliente: 'Ana Martinez', cantidad: 350 },
    { cliente: 'Carlos Rodriguez', cantidad: 200 },
    { cliente: 'Elena Castro', cantidad: 220 },
  ];

  const pagosDeposito = [
    { cliente: 'Juan Pérez', cantidad: 150 },
    { cliente: 'Luis Fernández', cantidad: 180 },
  ];

  const renovados = [
    { cliente: 'Pedro Ramirez', descuento: 100 },
    { cliente: 'Sofia Mendoza', descuento: 150 },
    { cliente: 'Diego Morales', descuento: 80 },
  ];

  const totalEfectivo = pagosEfectivo.reduce((sum, p) => sum + p.cantidad, 0);
  const totalDeposito = pagosDeposito.reduce((sum, p) => sum + p.cantidad, 0);
  const subtotalPagos = totalEfectivo + totalDeposito;
  const totalRenovado = renovados.reduce((sum, r) => sum + r.descuento, 0);
  const totalEntregado = subtotalPagos + totalRenovado;

  const comisionPorcentaje = Math.round((totales.comision / totales.total) * 100) || 10;
  const comision = totalEntregado * (comisionPorcentaje / 100);
  const totalNeto = totalEntregado - comision;

  return (
    <Card className="p-6 space-y-6 max-w-md mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold">Reporte Semanal - {promotoraNombre}</h2>
          <p className="text-sm text-muted-foreground">Detalles de pagos y renovaciones de la semana</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <span className="sr-only">Cerrar</span>
          ✕
        </Button>
      </div>

      {/* Pagos Recibidos */}
      <div className="border rounded-lg overflow-hidden bg-blue-50/50 border-blue-100">
        <div className="p-3 bg-blue-50 border-b border-blue-100">
          <h3 className="font-semibold text-blue-900">Pagos Recibidos</h3>
        </div>

        <div className="p-3 space-y-4">
          {/* Header */}
          <div className="grid grid-cols-3 text-sm font-semibold text-blue-900 mb-2">
            <span>Cliente</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Tipo</span>
          </div>

          {/* Efectivo */}
          <div>
            <div className="text-xs font-bold text-green-600 uppercase mb-2">EFECTIVO</div>
            <div className="space-y-2">
              {pagosEfectivo.map((pago, i) => (
                <div key={i} className="grid grid-cols-3 items-center text-sm">
                  <span>{pago.cliente}</span>
                  <span className="text-center">${pago.cantidad}</span>
                  <div className="text-right">
                    <Badge variant="default" className="bg-black hover:bg-black/90 text-white text-xs py-0 h-5">Efectivo</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deposito */}
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase mb-2 mt-4">DEPÓSITO</div>
            <div className="space-y-2">
              {pagosDeposito.map((pago, i) => (
                <div key={i} className="grid grid-cols-3 items-center text-sm">
                  <span>{pago.cliente}</span>
                  <span className="text-center">${pago.cantidad}</span>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-xs py-0 h-5">Depósito</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Totales Pagos */}
        <div className="bg-blue-100/50 p-3 space-y-1 text-sm border-t border-blue-100">
          <div className="flex justify-between">
            <span className="text-blue-900">Total Efectivo:</span>
            <span className="font-semibold">${totalEfectivo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-900">Total Depósito:</span>
            <span className="font-semibold">${totalDeposito}</span>
          </div>
          <Separator className="bg-blue-200 my-1" />
          <div className="flex justify-between font-bold text-blue-900">
            <span>Subtotal Pagos:</span>
            <span>${subtotalPagos}</span>
          </div>
        </div>
      </div>

      {/* Renovado */}
      <div className="border rounded-lg overflow-hidden bg-green-50/50 border-green-100">
        <div className="p-3 bg-green-50 border-b border-green-100">
          <h3 className="font-semibold text-green-900">Renovado</h3>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-2 text-sm font-semibold text-green-900 mb-2">
            <span>Cliente</span>
            <span className="text-right">Descuento</span>
          </div>
          <div className="space-y-2">
            {renovados.map((ren, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{ren.cliente}</span>
                <span>${ren.descuento}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-100/50 p-3 flex justify-between font-bold text-green-900 text-sm border-t border-green-100">
          <span>Total Renovado:</span>
          <span>${totalRenovado}</span>
        </div>
      </div>

      {/* Entregado */}
      <div className="border rounded-lg overflow-hidden bg-purple-50/50 border-purple-100">
        <div className="p-3 bg-purple-50 border-b border-purple-100">
          <h3 className="font-semibold text-purple-900">Entregado</h3>
        </div>
        <div className="p-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-900">Total Pagos:</span>
            <span className="font-semibold">${subtotalPagos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-900">Total Renovado:</span>
            <span className="font-semibold">${totalRenovado}</span>
          </div>
          <Separator className="bg-purple-200 my-1" />
          <div className="flex justify-between font-bold text-purple-900">
            <span>Total Entregado:</span>
            <span>${totalEntregado}</span>
          </div>
        </div>
      </div>

      {/* Comisión */}
      <div className="border rounded-lg overflow-hidden bg-orange-50/50 border-orange-100">
        <div className="p-3 bg-orange-50 border-b border-orange-100">
          <h3 className="font-semibold text-orange-900">Comisión para Promotora</h3>
        </div>
        <div className="p-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-orange-900">Total Entregado:</span>
            <span className="font-semibold">${totalEntregado}</span>
          </div>
          <div className="flex justify-between text-orange-600">
            <span>Comisión ({comisionPorcentaje}%):</span>
            <span>- ${comision}</span>
          </div>
          <Separator className="bg-orange-200 my-1" />
          <div className="flex justify-between font-bold text-orange-900">
            <span>Total Neto:</span>
            <span>${totalNeto}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1">Cerrar</Button>
        <Button className="flex-1 bg-black text-white hover:bg-black/90">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Estoy de Acuerdo
        </Button>
      </div>
    </Card>
  );
}
