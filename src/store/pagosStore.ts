import { create } from 'zustand';
import { PagoRegistro } from '@/types';

interface PagosState {
  pagos: PagoRegistro[];
  addPago: (pago: PagoRegistro) => void;
  getPagosByCliente: (clienteId: string) => PagoRegistro[];
  getPagosSemana: (promotoraId: string) => PagoRegistro[];
}

const mockPagos: PagoRegistro[] = [
  {
    id: 'pago-1',
    clienteId: 'cliente-1',
    fecha: new Date(),
    tipo: 'normal',
    medio: 'efectivo',
    cantidad: 500,
  },
  {
    id: 'pago-2',
    clienteId: 'cliente-2',
    fecha: new Date(),
    tipo: 'normal',
    medio: 'deposito',
    cantidad: 300,
  },
];

export const usePagosStore = create<PagosState>((set, get) => ({
  pagos: mockPagos,
  addPago: (pago) => set((state) => ({ pagos: [...state.pagos, pago] })),
  getPagosByCliente: (clienteId) =>
    get().pagos.filter((p) => p.clienteId === clienteId),
  getPagosSemana: (promotoraId) => {
    // Filter payments from current week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return get().pagos.filter((p) => p.fecha >= startOfWeek);
  },
}));
