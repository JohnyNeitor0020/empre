import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useClientesStore } from '@/store/clientesStore';
import { usePagosStore } from '@/store/pagosStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, LogOut, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Promotora, TotalesSemanal } from '@/types';
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

  const clientesAsignados = useMemo(
    () => clientes.filter((c) => user.clientesAsignados.includes(c.id)),
    [clientes, user.clientesAsignados]
  );

  const totalesSemanal = useMemo((): TotalesSemanal => {
    const pagosSemana = pagos.filter((p) => {
      const cliente = clientes.find((c) => c.id === p.clienteId);
      return cliente && user.clientesAsignados.includes(cliente.id);
    });

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
  }, [pagos, clientes, user.clientesAsignados]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRegistrarPago = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    setShowPagoDialog(true);
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
        <ResumenSemanal totales={totalesSemanal} promotoraNombre={`${user.nombre} ${user.apellidos}`} />

        {/* Clientes List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Mis Clientes</h2>
          <div className="space-y-3">
            {clientesAsignados.map((cliente) => (
              <ClienteCard
                key={cliente.id}
                cliente={cliente}
                onRegistrarPago={() => handleRegistrarPago(cliente.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Registro Pago Dialog */}
      {selectedClienteId && (
        <RegistroPagoDialog
          clienteId={selectedClienteId}
          open={showPagoDialog}
          onOpenChange={setShowPagoDialog}
        />
      )}
    </div>
  );
}
