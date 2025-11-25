import { Cliente } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, DollarSign, Star } from 'lucide-react';

interface ClienteCardProps {
  cliente: Cliente;
  onRegistrarPago: () => void;
}

export default function ClienteCard({ cliente, onRegistrarPago }: ClienteCardProps) {
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
              cliente.estado === 'activo'
                ? 'default'
                : cliente.estado === 'moroso'
                ? 'destructive'
                : 'secondary'
            }
          >
            {cliente.estado}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{cliente.whatsapp}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>${cliente.sueldo.toLocaleString()}</span>
          </div>
        </div>

        <Button onClick={onRegistrarPago} className="w-full" size="sm">
          Registrar Pago
        </Button>
      </div>
    </Card>
  );
}
