import { useState, useMemo } from 'react';
import { useClientesStore } from '@/store/clientesStore';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Search, Eye } from 'lucide-react';
import ClienteDetailDialog from './ClienteDetailDialog';

export default function ClientesView() {
  const clientes = useClientesStore((state) => state.clientes);
  const [searchCurp, setSearchCurp] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);

  const filteredClientes = useMemo(() => {
    if (!searchCurp.trim()) return clientes;
    const term = searchCurp.toLowerCase();
    return clientes.filter((c) => c.curp.toLowerCase().includes(term));
  }, [clientes, searchCurp]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
        <Button>
          <span className="mr-2">+</span>
          Nuevo Cliente
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por CURP..."
              value={searchCurp}
              onChange={(e) => setSearchCurp(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>Mostrar 10</option>
            <option value={50}>Mostrar 50</option>
            <option value={100}>Mostrar 100</option>
            <option value={10000}>Mostrar Todos</option>
          </select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>CURP</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.slice(0, limit).map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {cliente.id}
                </TableCell>
                <TableCell className="font-mono">{cliente.curp}</TableCell>
                <TableCell className="font-medium">{cliente.nombre_completo}</TableCell>
                <TableCell className="text-center">
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
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedClienteId(cliente.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredClientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {selectedClienteId && (
        <ClienteDetailDialog
          clienteId={selectedClienteId}
          open={!!selectedClienteId}
          onOpenChange={(open) => !open && setSelectedClienteId(null)}
        />
      )}
    </div>
  );
}
