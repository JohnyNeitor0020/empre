import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const rutaSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la ruta es requerido'),
  supervisoraId: z.string().min(1, 'Debe seleccionar una supervisora'),
  promotoraIds: z.array(z.string()).min(1, 'Debe seleccionar al menos una promotora'),
});

type RutaFormData = z.infer<typeof rutaSchema>;

interface AsignarRutaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data
const mockSupervisoras = [
  { id: '3', nombre: 'Carmen López' },
];

const mockPromotoras = [
  { id: '2', nombre: 'Ana Martínez' },
];

export default function AsignarRutaDialog({
  open,
  onOpenChange,
}: AsignarRutaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RutaFormData>({
    resolver: zodResolver(rutaSchema),
    defaultValues: {
      nombre: '',
      supervisoraId: '',
      promotoraIds: [],
    },
  });

  const onSubmit = async (data: RutaFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implementar lógica de asignación con backend
      console.log('Asignando ruta:', data);

      toast.success('Ruta asignada exitosamente');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al asignar la ruta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Nueva Ruta</DialogTitle>
          <DialogDescription>
            Define una ruta asignando supervisora y promotoras
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Ruta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ruta Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supervisoraId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisora</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una supervisora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSupervisoras.map((supervisora) => (
                        <SelectItem key={supervisora.id} value={supervisora.id}>
                          {supervisora.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="promotoraIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Promotoras</FormLabel>
                  </div>
                  {mockPromotoras.map((promotora) => (
                    <FormField
                      key={promotora.id}
                      control={form.control}
                      name="promotoraIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={promotora.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(promotora.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, promotora.id])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== promotora.id
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {promotora.nombre}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Asignando...' : 'Asignar Ruta'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
