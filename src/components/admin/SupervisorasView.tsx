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
    status: 'active',
  },
];

export default function SupervisorasView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupervisora, setSelectedSupervisora] = useState<typeof mockSupervisoras[0] | null>(null);
  const [suspendingSupervisora, setSuspendingSupervisora] = useState<{ id: string, nombre: string, action: 'suspend' | 'activate' } | null>(null);

  const handleStatusChange = () => {
    if (suspendingSupervisora) {
      // In a real app, this would make an API call to update the status
      console.log(`${suspendingSupervisora.action === 'suspend' ? 'Suspending' : 'Activating'} supervisora: ${suspendingSupervisora.nombre}`);
      setSuspendingSupervisora(null);
      setSelectedSupervisora(null);
    }
  };

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
            {mockSupervisoras.map((supervisora) => {
              const status = (supervisora as any).status || 'active';
              return (
                <TableRow key={supervisora.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      {supervisora.nombre}
                    </div>
                  </TableCell>
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
                        onClick={() => setSelectedSupervisora({ ...supervisora, status } as any)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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
            <h2 className="text-xl font-bold mb-4">Detalles de Supervisora</h2>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{selectedSupervisora.nombre}</span>
                  <Badge variant={(selectedSupervisora as any).status === 'active' ? 'default' : 'destructive'}>
                    {(selectedSupervisora as any).status === 'active' ? 'Activo' : 'Suspendido'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedSupervisora.email}</p>
                <p className="text-sm text-muted-foreground">{selectedSupervisora.telefono}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm">Promotoras Asignadas ({selectedSupervisora.promotoraIds.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedSupervisora.promotoraIds.map(id => (
                    <div key={id} className="p-2 bg-muted/50 rounded-md flex justify-between items-center text-sm">
                      <span>Promotora ID: {id}</span>
                    </div>
                  ))}
                  {selectedSupervisora.promotoraIds.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">No hay promotoras asignadas</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                {(selectedSupervisora as any).status === 'active' ? (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setSuspendingSupervisora({
                      id: selectedSupervisora.id,
                      nombre: selectedSupervisora.nombre,
                      action: 'suspend'
                    })}
                  >
                    Suspender Supervisora
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setSuspendingSupervisora({
                      id: selectedSupervisora.id,
                      nombre: selectedSupervisora.nombre,
                      action: 'activate'
                    })}
                  >
                    Reactivar Supervisora
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Dialogo de Confirmación de Suspensión/Reactivación */}
      {suspendingSupervisora && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm p-6 bg-background relative">
            <h2 className={`text-lg font-bold mb-2 ${suspendingSupervisora.action === 'suspend' ? 'text-destructive' : 'text-green-600'}`}>
              {suspendingSupervisora.action === 'suspend' ? '¿Estás seguro?' : '¿Reactivar cuenta?'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {suspendingSupervisora.action === 'suspend'
                ? <span>Estás a punto de suspender a <strong>{suspendingSupervisora.nombre}</strong>. Esta acción revocará sus credenciales de acceso temporalmente.</span>
                : <span>Estás a punto de reactivar a <strong>{suspendingSupervisora.nombre}</strong>. Podrá volver a acceder al sistema inmediatamente.</span>
              }
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSuspendingSupervisora(null)}>
                Cancelar
              </Button>
              <Button
                variant={suspendingSupervisora.action === 'suspend' ? 'destructive' : 'default'}
                className={suspendingSupervisora.action === 'activate' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={handleStatusChange}
              >
                {suspendingSupervisora.action === 'suspend' ? 'Sí, Suspender' : 'Sí, Reactivar'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
