import { useClientesStore } from '@/store/clientesStore';
import { usePagosStore } from '@/store/pagosStore';
import { mockUsers } from '@/store/authStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import {
  User,
  Phone,
  Calendar,
  DollarSign,
  Building2,
  CreditCard,
  Star,
  History,
} from 'lucide-react';

interface ClienteDetailDialogProps {
  clienteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClienteDetailDialog({
  clienteId,
  open,
  onOpenChange,
}: ClienteDetailDialogProps) {
  const cliente = useClientesStore((state) => state.getCliente(clienteId));
  const getPagosByCliente = usePagosStore((state) => state.getPagosByCliente);

  if (!cliente) return null;

  const pagos = getPagosByCliente(clienteId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{cliente.nombre_completo}</DialogTitle>
            <div className="flex gap-2">
              {cliente.prioritario && (
                <Badge variant="default" className="bg-warning text-warning-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Prioritario
                </Badge>
              )}
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
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">CURP</p>
                <p className="font-mono font-medium">{cliente.curp}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {cliente.whatsapp}
                </p>
              </div>
              {cliente.cumpleanos && (
                <div>
                  <p className="text-sm text-muted-foreground">Cumpleaños</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(cliente.cumpleanos).toLocaleDateString('es-MX')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Red Social</p>
                <p className="font-medium">
                  {cliente.red_social} ({cliente.que_red_social})
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promotora</p>
                <p className="font-medium">
                  {mockUsers.find(u => u.id === cliente.promotoraId)?.nombre || 'No asignada'} {mockUsers.find(u => u.id === cliente.promotoraId)?.apellidos || ''}
                </p>
              </div>
            </div>
          </Card>

          {/* Información Financiera */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información Financiera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sueldo</p>
                <p className="font-medium text-lg text-success">
                  ${cliente.sueldo.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Banco</p>
                <p className="font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {cliente.tipo_de_banco}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CLABE</p>
                <p className="font-mono font-medium text-sm">{cliente.clabe}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de Cuenta</p>
                <p className="font-mono font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {cliente.numero_de_cuenta}
                </p>
              </div>
            </div>
          </Card>

          {/* Domicilio */}
          {cliente.direccion && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Domicilio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Dirección Completa</p>
                  <p className="font-medium">
                    {cliente.direccion.calle} #{cliente.direccion.numero_ext}
                    {cliente.direccion.numero_int ? ` Int. ${cliente.direccion.numero_int}` : ''},
                    Col. {cliente.direccion.colonia}, {cliente.direccion.ciudad}, C.P. {cliente.direccion.cp}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Entre Calles</p>
                  <p className="font-medium">{cliente.direccion.cruces}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Ubicación GPS</p>
                  <a
                    href={cliente.direccion.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Información Laboral */}
          {cliente.laboral && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información Laboral
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium">{cliente.laboral.empresa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Puesto</p>
                  <p className="font-medium">{cliente.laboral.puesto}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp Trabajo</p>
                  <p className="font-medium">{cliente.laboral.telefono}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Dirección Laboral</p>
                  <p className="font-medium">
                    {cliente.laboral.direccion.calle} #{cliente.laboral.direccion.numero_ext},
                    Col. {cliente.laboral.direccion.colonia}, {cliente.laboral.direccion.ciudad}, C.P. {cliente.laboral.direccion.cp}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Entre: {cliente.laboral.direccion.cruces}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Aval */}
          {cliente.aval && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Aval
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{cliente.aval.nombre_completo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parentesco</p>
                  <p className="font-medium">{cliente.aval.parentesco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CURP</p>
                  <p className="font-mono font-medium">{cliente.aval.curp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{cliente.aval.whatsapp}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Domicilio Aval</p>
                  <p className="font-medium">
                    {cliente.aval.direccion.calle} #{cliente.aval.direccion.numero_ext},
                    Col. {cliente.aval.direccion.colonia}, {cliente.aval.direccion.ciudad}, C.P. {cliente.aval.direccion.cp}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Entre: {cliente.aval.direccion.cruces}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Referencia */}
          {cliente.referencia && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Referencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{cliente.referencia.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parentesco</p>
                  <p className="font-medium">{cliente.referencia.parentesco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CURP</p>
                  <p className="font-mono font-medium">{cliente.referencia.curp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{cliente.referencia.whatsapp}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Historial de Pagos */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial de Pagos
            </h3>
            {pagos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay pagos registrados</p>
            ) : (
              <div className="space-y-2">
                {pagos.map((pago) => (
                  <div
                    key={pago.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {pago.tipo.charAt(0).toUpperCase() + pago.tipo.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(pago.fecha).toLocaleDateString('es-MX')} • {pago.medio}
                      </p>
                    </div>
                    <p className="font-semibold text-lg text-success">
                      ${pago.cantidad.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
