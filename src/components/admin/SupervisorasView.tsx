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
import { UserCog } from 'lucide-react';
import RegistroSupervisoraDialog from './RegistroSupervisoraDialog';

// Mock supervisoras data
const mockSupervisoras = [
  {
    id: '3',
    nombre: 'Carmen López',
    email: 'supervisora@emprendedora.com',
    telefono: '5559876543',
    promotoraIds: ['2'],
  },
];

export default function SupervisorasView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupervisora, setSelectedSupervisora] = useState<typeof mockSupervisoras[0] | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Supervisoras</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <UserCog className="h-4 w-4 mr-2" />
          Nueva Supervisora
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-center">Promotoras Asignadas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSupervisoras.map((supervisora) => (
              <TableRow key={supervisora.id}>
                <TableCell className="font-medium">{supervisora.nombre}</TableCell>
                <TableCell className="text-muted-foreground">{supervisora.email}</TableCell>
                <TableCell className="text-muted-foreground">{supervisora.telefono}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{supervisora.promotoraIds.length}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSupervisora(supervisora)}
                    >
                      Ver Detalles
                    </Button>
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

      <RegistroSupervisoraDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Dialogo de Detalles */}
      {selectedSupervisora && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6 bg-background relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setSelectedSupervisora(null)}
            >
              ✕
            </Button>
            <h2 className="text-xl font-bold mb-4">Promotoras de {selectedSupervisora.nombre}</h2>
            <div className="space-y-2">
              {selectedSupervisora.promotoraIds.map(id => (
                <div key={id} className="p-2 bg-muted rounded-md flex justify-between items-center">
                  <span>Promotora ID: {id}</span>
                  {/* Aquí se buscaría el nombre real de la promotora */}
                </div>
              ))}
              {selectedSupervisora.promotoraIds.length === 0 && (
                <p className="text-muted-foreground text-center">No hay promotoras asignadas</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
