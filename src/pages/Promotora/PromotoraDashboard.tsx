import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useClientesStore } from '@/store/clientesStore';
import { usePagosStore } from '@/store/pagosStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, LogOut, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Promotora, TotalesSemanal, MedioPago } from '@/types';
import ClienteCard from '@/components/promotora/ClienteCard';
import RegistroPagoDialog from '@/components/promotora/RegistroPagoDialog';
import ResumenSemanal from '@/components/promotora/ResumenSemanal';

export default function PromotoraDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user) as Promotora;
  const logout = useAuthStore((state) => state.logout);
  const clientes = useClientesStore((state) => state.clientes);
  const pagos = usePagosStore((state) => state.pagos);

  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [showPagoDialog, setShowPagoDialog] = useState(false);
  const [defaultMedio, setDefaultMedio] = useState<MedioPago>('efectivo');
  const [view, setView] = useState<'clientes' | 'reporte'>('clientes');

  const clientesAsignados = useMemo(
    () => clientes.filter((c) => user.clientesAsignados.includes(c.id)),
    [clientes, user.clientesAsignados]
  );

  const pagosSemana = useMemo(() => {
    return pagos.filter((p) => {
      const cliente = clientes.find((c) => c.id === p.clienteId);
      return cliente && user.clientesAsignados.includes(cliente.id);
    });
  }, [pagos, clientes, user.clientesAsignados]);

  const totalesSemanal = useMemo((): TotalesSemanal => {
    const pagosNormalesEfectivo = pagosSemana
      .filter((p) => p.tipo === 'normal' && p.medio === 'efectivo')
      .reduce((sum, p) => sum + p.cantidad, 0);

    const pagosNormalesDeposito = pagosSemana
      .filter((p) => p.tipo === 'normal' && p.medio === 'deposito')
      .reduce((sum, p) => sum + p.cantidad, 0);

    const renovado = pagosSemana
      .filter((p) => p.tipo === 'renovado')
      .reduce((sum, p) => sum + p.cantidad, 0);

    const entregado = pagosSemana
      .filter((p) => p.tipo === 'entregado')
      .reduce((sum, p) => sum + p.cantidad, 0);

    const total = pagosNormalesEfectivo + pagosNormalesDeposito + renovado + entregado;
    const comision = total * 0.08; // 8% commission

    return {
      pagosNormalesEfectivo,
      pagosNormalesDeposito,
      renovado,
      entregado,
      comision,
      total,
    };
  }, [pagosSemana]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCobrar = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    setDefaultMedio('efectivo'); // Default to efectivo, user can change in dialog
    setShowPagoDialog(true);
  };

  const handleNoPago = (clienteId: string) => {
    if (window.confirm('¿Estás segura de registrar que este cliente NO pagó? Se marcará con retraso.')) {
      useClientesStore.getState().markAsNoPago(clienteId);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Emprendedora</h1>
                <p className="text-xs opacity-90">
                  {user.nombre} {user.apellidos}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-muted p-1 rounded-lg inline-flex">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'clientes'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => setView('clientes')}
            >
              Mis Clientes
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'reporte'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => setView('reporte')}
            >
              Reporte Semanal
            </button>
          </div>
        </div>

        {view === 'reporte' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 border-l-4 border-l-primary">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clientes</p>
                    <p className="text-2xl font-bold text-foreground">
                      {clientesAsignados.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-success">
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 p-3 rounded-full">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Semanal</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${totalesSemanal.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-accent bg-accent/5">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comisión</p>
                    <p className="text-2xl font-bold text-accent">
                      ${totalesSemanal.comision.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Resumen Semanal */}
            <ResumenSemanal
              totales={totalesSemanal}
              promotoraNombre={`${user.nombre} ${user.apellidos}`}
              pagos={pagosSemana}
              clientes={clientes}
            />
          </>
        )}

        {view === 'clientes' && (
          /* Clientes List */
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Mis Clientes</h2>
            <div className="space-y-3">
              {clientesAsignados.map((cliente) => (
                <ClienteCard
                  key={cliente.id}
                  cliente={cliente}
                  onCobrar={() => handleCobrar(cliente.id)}
                  onNoPago={() => handleNoPago(cliente.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registro Pago Dialog */}
      {selectedClienteId && (
        <RegistroPagoDialog
          clienteId={selectedClienteId}
          open={showPagoDialog}
          onOpenChange={setShowPagoDialog}
          defaultMedio={defaultMedio}
        />
      )}
    </div>
  );
}
