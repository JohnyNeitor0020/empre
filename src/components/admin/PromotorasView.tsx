import { useState } from 'react';
import { useClientesStore } from '@/store/clientesStore';
import { usePagosStore } from '@/store/pagosStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, UserPlus } from 'lucide-react';
import RegistroPromotoraDialog from './RegistroPromotoraDialog';

// Mock promotoras data
const mockPromotoras = [
  {
    id: '2',
    nombre: 'Ana Martínez',
    email: 'promotora@emprendedora.com',
    clientesAsignados: ['cliente-1', 'cliente-2', 'cliente-3'],
    comision: 8,
  },
];

export default function PromotorasView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const clientes = useClientesStore((state) => state.clientes);
  const pagos = usePagosStore((state) => state.pagos);

  const getPromotoraStats = (promotoraId: string) => {
    const clientesCount = clientes.filter((c) => c.promotoraId === promotoraId).length;
    const totalCobrado = pagos
      .filter((p) => {
        const cliente = clientes.find((c) => c.id === p.clienteId);
        return cliente?.promotoraId === promotoraId;
      })
      .reduce((sum, p) => sum + p.cantidad, 0);

    return { clientesCount, totalCobrado };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Promotoras</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nueva Promotora
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Clientes</TableHead>
              <TableHead className="text-center">Comisión</TableHead>
              <TableHead className="text-right">Cobro Semanal</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPromotoras.map((promotora) => {
              const stats = getPromotoraStats(promotora.id);
              // Mock commission for display - in real app this comes from DB
              const comision = (promotora as any).comision || 8;

              return (
                <TableRow key={promotora.id}>
                  <TableCell className="font-medium">{promotora.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{promotora.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{stats.clientesCount}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{comision}%</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    ${stats.totalCobrado.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <RegistroPromotoraDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
