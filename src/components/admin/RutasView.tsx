import { useState } from 'react';
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
import { Route } from 'lucide-react';
import AsignarRutaDialog from './AsignarRutaDialog';

// Mock rutas data
const mockRutas = [
  {
    id: 'ruta-1',
    nombre: 'Ruta Centro',
    supervisora: 'Carmen López',
    promotoras: ['Ana Martínez'],
  },
];

export default function RutasView() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Rutas</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Route className="h-4 w-4 mr-2" />
          Asignar Ruta
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre de Ruta</TableHead>
              <TableHead>Supervisora</TableHead>
              <TableHead className="text-center">Promotoras</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRutas.map((ruta) => (
              <TableRow key={ruta.id}>
                <TableCell className="font-medium">{ruta.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{ruta.supervisora}</TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="secondary">{ruta.promotoras.length}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {ruta.promotoras.join(', ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AsignarRutaDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
