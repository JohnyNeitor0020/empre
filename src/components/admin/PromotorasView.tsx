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
    status: 'active',
  },
];

export default function PromotorasView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<{ id: string, nombre: string, comision: number } | null>(null);
  const [viewingPromotora, setViewingPromotora] = useState<{ id: string, nombre: string, email: string, status?: string } | null>(null);
  const [suspendingPromotora, setSuspendingPromotora] = useState<{ id: string, nombre: string, action: 'suspend' | 'activate' } | null>(null);

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

  const handleStatusChange = () => {
    if (suspendingPromotora) {
      // In a real app, this would make an API call to update the status
      console.log(`${suspendingPromotora.action === 'suspend' ? 'Suspending' : 'Activating'} promotora: ${suspendingPromotora.nombre}`);
      setSuspendingPromotora(null);
      setViewingPromotora(null);
    }
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
              const status = (promotora as any).status || 'active';

              return (
                <TableRow key={promotora.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      {promotora.nombre}
                    </div>
                  </TableCell>
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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCommission({
                          id: promotora.id,
                          nombre: promotora.nombre,
                          comision: comision
                        })}
                      >
                        Editar Comisión
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingPromotora({
                          id: promotora.id,
                          nombre: promotora.nombre,
                          email: promotora.email,
                          status: status
                        })}
                      >
                        <Eye className="h-4 w-4 mr-1" />
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

      <RegistroPromotoraDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Dialogo de Edición de Comisión */}
      {editingCommission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm p-6 bg-background relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setEditingCommission(null)}
            >
              ✕
            </Button>
            <h2 className="text-lg font-bold mb-4">Editar Comisión</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Asignar porcentaje de comisión para {editingCommission.nombre}
            </p>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Porcentaje (6% - 10%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="6"
                    max="10"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={editingCommission.comision}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCommission(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  // Here we would update the commission in the backend/store
                  setEditingCommission(null);
                }}>
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Dialogo de Detalles de Promotora */}
      {viewingPromotora && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6 bg-background relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setViewingPromotora(null)}
            >
              ✕
            </Button>
            <h2 className="text-xl font-bold mb-2">{viewingPromotora.nombre}</h2>
            <p className="text-sm text-muted-foreground mb-6">{viewingPromotora.email}</p>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Estado de Cuenta</h3>
                <div className="flex justify-between text-sm">
                  <span>Estado Actual:</span>
                  <Badge variant={viewingPromotora.status === 'active' ? 'default' : 'destructive'}>
                    {viewingPromotora.status === 'active' ? 'Activo' : 'Suspendido'}
                  </Badge>
                </div>
              </div>

              {viewingPromotora.status === 'active' ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setSuspendingPromotora({
                    id: viewingPromotora.id,
                    nombre: viewingPromotora.nombre,
                    action: 'suspend'
                  })}
                >
                  Suspender Promotora
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setSuspendingPromotora({
                    id: viewingPromotora.id,
                    nombre: viewingPromotora.nombre,
                    action: 'activate'
                  })}
                >
                  Reactivar Promotora
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Dialogo de Confirmación de Suspensión/Reactivación */}
      {suspendingPromotora && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm p-6 bg-background relative">
            <h2 className={`text-lg font-bold mb-2 ${suspendingPromotora.action === 'suspend' ? 'text-destructive' : 'text-green-600'}`}>
              {suspendingPromotora.action === 'suspend' ? '¿Estás seguro?' : '¿Reactivar cuenta?'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {suspendingPromotora.action === 'suspend'
                ? <span>Estás a punto de suspender a <strong>{suspendingPromotora.nombre}</strong>. Esta acción revocará sus credenciales de acceso temporalmente.</span>
                : <span>Estás a punto de reactivar a <strong>{suspendingPromotora.nombre}</strong>. Podrá volver a acceder al sistema inmediatamente.</span>
              }
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSuspendingPromotora(null)}>
                Cancelar
              </Button>
              <Button
                variant={suspendingPromotora.action === 'suspend' ? 'destructive' : 'default'}
                className={suspendingPromotora.action === 'activate' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={handleStatusChange}
              >
                {suspendingPromotora.action === 'suspend' ? 'Sí, Suspender' : 'Sí, Reactivar'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
