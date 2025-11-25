import { Cliente } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, DollarSign, Star } from 'lucide-react';

interface ClienteCardProps {
  cliente: Cliente;
  onCobrar: () => void;
  onNoPago: () => void;
}

export default function ClienteCard({
  cliente,
  onCobrar,
  onNoPago
}: ClienteCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{cliente.nombre_completo}</h3>
                {cliente.prioritario && (
                  <Star className="h-4 w-4 fill-warning text-warning" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{cliente.curp}</p>
            </div>
          </div>
          <Badge
            variant={
              cliente.diasRetraso && cliente.diasRetraso > 0
                ? 'destructive'
                : cliente.estado === 'activo'
                  ? 'default' // Green for active/al corriente
                  : 'secondary'
            }
            className={cliente.estado === 'activo' && (!cliente.diasRetraso || cliente.diasRetraso === 0) ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {cliente.diasRetraso && cliente.diasRetraso > 0
              ? `${cliente.diasRetraso} días de retraso`
              : cliente.estado === 'activo'
                ? 'Al Corriente'
                : cliente.estado}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{cliente.whatsapp}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Sueldo: ${cliente.sueldo.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Préstamo: ${cliente.montoPrestamo?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Pago Semanal: ${cliente.pagoSemanal?.toLocaleString() || '0'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            onClick={onCobrar}
            variant="outline"
            className="w-full h-8 text-xs"
          >
            Cobrar
          </Button>
          <Button
            onClick={onNoPago}
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Retraso de pago
          </Button>
        </div>
      </div>
    </Card>
  );
}
