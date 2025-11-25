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
  const [editingRuta, setEditingRuta] = useState<{ id: string, nombre: string } | null>(null);
  const [deletingRuta, setDeletingRuta] = useState<{ id: string, nombre: string } | null>(null);

  const handleEdit = () => {
    if (editingRuta) {
      console.log(`Updating ruta ${editingRuta.id} name to: ${editingRuta.nombre}`);
      setEditingRuta(null);
    }
  };

  const handleDelete = () => {
    if (deletingRuta) {
      console.log(`Deleting ruta: ${deletingRuta.nombre}`);
      setDeletingRuta(null);
    }
  };

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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingRuta({ id: ruta.id, nombre: ruta.nombre })}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingRuta({ id: ruta.id, nombre: ruta.nombre })}
                    >
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

      {/* Dialogo de Edición de Ruta */}
      {editingRuta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm p-6 bg-background relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setEditingRuta(null)}
            >
              ✕
            </Button>
            <h2 className="text-lg font-bold mb-4">Editar Ruta</h2>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Nombre de la Ruta</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingRuta.nombre}
                  onChange={(e) => setEditingRuta({ ...editingRuta, nombre: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingRuta(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleEdit}>
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Dialogo de Confirmación de Eliminación */}
      {deletingRuta && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm p-6 bg-background relative">
            <h2 className="text-lg font-bold text-destructive mb-2">¿Eliminar Ruta?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Estás a punto de eliminar la ruta <strong>{deletingRuta.nombre}</strong>.
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletingRuta(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Sí, Eliminar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
