import { useState } from 'react';
import { TotalesSemanal, PagoRegistro, Cliente } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResumenSemanalProps {
  totales: TotalesSemanal;
  promotoraNombre: string;
  pagos: PagoRegistro[];
  clientes: Cliente[];
}

export default function ResumenSemanal({ totales, promotoraNombre, pagos, clientes }: ResumenSemanalProps) {
  const [acordado, setAcordado] = useState(false);

  const pagosEfectivo = pagos.filter(p => p.medio === 'efectivo');
  const pagosDeposito = pagos.filter(p => p.medio === 'deposito');

  const totalCobrado = totales.total;
  const aEntregar = totalCobrado - totales.comision;

  const getClienteNombre = (id: string) => {
    return clientes.find(c => c.id === id)?.nombre_completo || 'Cliente Desconocido';
  };

  const generarPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Emprendedora', 105, 20, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Resumen Semanal', 105, 30, { align: 'center' });

      // Promotora info
      doc.setFontSize(12);
      doc.text(`Promotora: ${promotoraNombre}`, 20, 45);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 20, 52);

      // Tables
      let y = 60;

      // Efectivo Table
      doc.setFont('helvetica', 'bold');
      doc.text('Pagos en Efectivo', 20, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [['Cliente', 'Fecha', 'Cantidad']],
        body: pagosEfectivo.map(p => [
          getClienteNombre(p.clienteId),
          new Date(p.fecha).toLocaleDateString('es-MX'),
          `$${p.cantidad.toLocaleString()}`
        ]),
      });

      // @ts-ignore
      y = doc.lastAutoTable.finalY + 15;

      // Deposito Table
      doc.text('Pagos en Depósito', 20, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [['Cliente', 'Fecha', 'Cantidad']],
        body: pagosDeposito.map(p => [
          getClienteNombre(p.clienteId),
          new Date(p.fecha).toLocaleDateString('es-MX'),
          `$${p.cantidad.toLocaleString()}`
        ]),
      });

      // @ts-ignore
      y = doc.lastAutoTable.finalY + 20;

      // Totals
      doc.setFontSize(12);
      doc.text(`Total Efectivo: $${totales.pagosNormalesEfectivo.toLocaleString()}`, 20, y);
      y += 8;
      doc.text(`Total Depósito: $${totales.pagosNormalesDeposito.toLocaleString()}`, 20, y);
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Cobrado: $${totalCobrado.toLocaleString()}`, 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Comisión Promotora: $${totales.comision.toLocaleString()}`, 20, y);
      y += 10;

      doc.setFillColor(71, 85, 105); // slate-600
      doc.rect(20, y - 6, 170, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(`A Entregar: $${aEntregar.toLocaleString()}`, 25, y + 2);

      // Save
      doc.save(`resumen-semanal-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF. Por favor intente de nuevo.');
    }
  };

  const enviarWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `*Resumen Semanal - Emprendedora*\n\n` +
      `Promotora: ${promotoraNombre}\n` +
      `Fecha: ${new Date().toLocaleDateString('es-MX')}\n\n` +
      `*Totales:*\n` +
      `Total Efectivo: $${totales.pagosNormalesEfectivo.toLocaleString()}\n` +
      `Total Depósito: $${totales.pagosNormalesDeposito.toLocaleString()}\n` +
      `*Total Cobrado: $${totalCobrado.toLocaleString()}*\n` +
      `Comisión: $${totales.comision.toLocaleString()}\n` +
      `*A Entregar: $${aEntregar.toLocaleString()}*`
    );

    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Resumen Semanal</h2>

      {/* Pagos en Efectivo Table */}
      <div>
        <h3 className="font-medium mb-2">Pagos Recibidos (Efectivo)</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Cliente</th>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-right">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {pagosEfectivo.length > 0 ? (
                pagosEfectivo.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{getClienteNombre(p.clienteId)}</td>
                    <td className="p-2">{new Date(p.fecha).toLocaleDateString('es-MX')}</td>
                    <td className="p-2 text-right">${p.cantidad.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    No hay pagos en efectivo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagos en Deposito Table */}
      <div>
        <h3 className="font-medium mb-2">Pagos Recibidos (Depósito)</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Cliente</th>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-right">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {pagosDeposito.length > 0 ? (
                pagosDeposito.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{getClienteNombre(p.clienteId)}</td>
                    <td className="p-2">{new Date(p.fecha).toLocaleDateString('es-MX')}</td>
                    <td className="p-2 text-right">${p.cantidad.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    No hay pagos en depósito
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Separator />

      {/* Totals Section */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Efectivo</span>
          <span className="font-semibold">${totales.pagosNormalesEfectivo.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Depósito</span>
          <span className="font-semibold">${totales.pagosNormalesDeposito.toLocaleString()}</span>
        </div>

        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total Cobrado</span>
          <span>${totalCobrado.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Comisión Promotora</span>
          <span>-${totales.comision.toLocaleString()}</span>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-l-primary mt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-primary text-lg">A Entregar</span>
            <span className="font-bold text-2xl text-primary">
              ${aEntregar.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={() => setAcordado(!acordado)}
          variant={acordado ? 'default' : 'outline'}
          className="w-full"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {acordado ? 'De acuerdo con mis cuentas' : 'Estoy de acuerdo con mis cuentas'}
        </Button>

        {acordado && (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={generarPDF} variant="secondary" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generar PDF
            </Button>

            <Button onClick={enviarWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Send className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
