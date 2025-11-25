import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, mockUsers } from '@/store/authStore';
import { useClientesStore } from '@/store/clientesStore';
import { Card } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Building2, Users, UserCog, Route, LayoutDashboard, LogOut, Search } from 'lucide-react';
import PromotorasView from '@/components/admin/PromotorasView';
import ClientesView from '@/components/admin/ClientesView';
import SupervisorasView from '@/components/admin/SupervisorasView';
import RutasView from '@/components/admin/RutasView';

type AdminView = 'dashboard' | 'promotoras' | 'clientes' | 'supervisoras' | 'rutas';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'promotoras' as AdminView, label: 'Promotoras', icon: Users },
    { id: 'clientes' as AdminView, label: 'Clientes', icon: Search },
    { id: 'supervisoras' as AdminView, label: 'Supervisoras', icon: UserCog },
    { id: 'rutas' as AdminView, label: 'Rutas', icon: Route },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <div className="p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="bg-sidebar-primary p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-sidebar-foreground">Emprendedora</h1>
                  <p className="text-xs text-sidebar-foreground/70">Panel Administrativo</p>
                </div>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setCurrentView(item.id)}
                        isActive={currentView === item.id}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 border-t border-sidebar-border">
              <div className="mb-3 text-sm text-sidebar-foreground">
                <p className="font-medium">{user?.nombre} {user?.apellidos}</p>
                <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {currentView === 'dashboard' && (
              <div>
                <h1 className="text-3xl font-bold mb-6 text-foreground">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Clientes</p>
                        <h3 className="text-2xl font-bold">{useClientesStore.getState().clientes.length}</h3>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <UserCog className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Promotoras Activas</p>
                        <h3 className="text-2xl font-bold">
                          {mockUsers.filter(u => u.role === 'promotora' && u.status === 'active').length}
                        </h3>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                        <UserCog className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supervisoras Activas</p>
                        <h3 className="text-2xl font-bold">
                          {mockUsers.filter(u => u.role === 'supervisora' && u.status === 'active').length}
                        </h3>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                        <Route className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rutas Activas</p>
                        <h3 className="text-2xl font-bold">1</h3>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {currentView === 'promotoras' && <PromotorasView />}
            {currentView === 'clientes' && <ClientesView />}
            {currentView === 'supervisoras' && <SupervisorasView />}
            {currentView === 'rutas' && <RutasView />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
