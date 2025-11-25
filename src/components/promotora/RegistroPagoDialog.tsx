import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePagosStore } from '@/store/pagosStore';
import { useClientesStore } from '@/store/clientesStore';
import { TipoPago, MedioPago } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const pagoSchema = z.object({
  tipo: z.enum(['normal', 'no_pago', 'retardo', 'renovado', 'entregado']),
  medio: z.enum(['efectivo', 'deposito']),
  cantidad: z.number().min(0, 'La cantidad debe ser mayor a 0'),
  descuento: z.number().min(0).optional(),
});

type PagoForm = z.infer<typeof pagoSchema>;

interface RegistroPagoDialogProps {
  clienteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMedio?: MedioPago;
}

export default function RegistroPagoDialog({
  clienteId,
  open,
  onOpenChange,
  defaultMedio = 'efectivo',
}: RegistroPagoDialogProps) {
  const addPago = usePagosStore((state) => state.addPago);
  const cliente = useClientesStore((state) => state.getCliente(clienteId));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PagoForm>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      tipo: 'normal',
      medio: defaultMedio,
      cantidad: 0,
    },
  });

  const tipo = watch('tipo');

  // Calculate penalty when 'no_pago' is selected
  useEffect(() => {
    if (tipo === 'no_pago' && cliente) {
      const penaltyAmount = cliente.pagoSemanal * 1.1112;
      setValue('cantidad', Number(penaltyAmount.toFixed(2)));
    } else if (tipo === 'normal') {
      setValue('cantidad', 0); // Reset or set to default
    }
  }, [tipo, cliente, setValue]);

  const onSubmit = (data: PagoForm) => {
    const newPago = {
      id: `pago-${Date.now()}`,
      clienteId,
      fecha: new Date(),
      tipo: data.tipo as TipoPago,
      medio: data.medio as MedioPago,
      cantidad: data.cantidad,
      descuento: data.descuento,
    };

    addPago(newPago);

    // If it's a "no_pago", we also want to update the client status in the store
    if (data.tipo === 'no_pago') {
      useClientesStore.getState().markAsNoPago(clienteId);
    }

    toast.success('Pago registrado exitosamente');
    reset();
    onOpenChange(false);
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <p className="text-sm text-muted-foreground">{cliente.nombre_completo}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Pago</Label>
            <Select
              onValueChange={(value) => setValue('tipo', value as TipoPago)}
              defaultValue="normal"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Pago Normal</SelectItem>
                <SelectItem value="no_pago">No Pagó</SelectItem>
                <SelectItem value="retardo">Retardo</SelectItem>
                <SelectItem value="renovado">Renovado</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tipo === 'no_pago' && (
            <div className="space-y-2">
              <Label htmlFor="cantidadPenalty" className="text-destructive">Cargo por No Pago (Incluye 11.12% comisión)</Label>
              <Input
                id="cantidadPenalty"
                type="number"
                step="0.01"
                disabled
                className="bg-destructive/10 text-destructive font-bold"
                {...register('cantidad', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                Pago Semanal: ${cliente.pagoSemanal} + 11.12% = ${Number((cliente.pagoSemanal * 1.1112).toFixed(2))}
              </p>
            </div>
          )}

          {tipo !== 'no_pago' && (
            <>
              <div className="space-y-2">
                <Label>Medio de Pago</Label>
                <Select
                  onValueChange={(value) => setValue('medio', value as MedioPago)}
                  defaultValue="efectivo"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="deposito">Depósito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  step="0.01"
                  {...register('cantidad', { valueAsNumber: true })}
                />
                {errors.cantidad && (
                  <p className="text-sm text-destructive">{errors.cantidad.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descuento">Descuento (opcional)</Label>
                <Input
                  id="descuento"
                  type="number"
                  step="0.01"
                  {...register('descuento', { valueAsNumber: true })}
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
