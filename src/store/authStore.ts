import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '@/types';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo
export const mockUsers: Usuario[] = [
  {
    id: '1',
    email: 'admin@emprendedora.com',
    nombre: 'Israel',
    apellidos: 'Piedra',
    telefono: '5551234567',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    email: 'promotora@emprendedora.com',
    nombre: 'Ana',
    apellidos: 'Martínez',
    telefono: '5557654321',
    role: 'promotora',
    rutaId: 'ruta-1',
    clientesAsignados: ['cliente-1', 'cliente-2', 'cliente-3'],
    comision: 8,
    status: 'active',
  },
  {
    id: '3',
    email: '',
    nombre: 'Carmen',
    apellidos: 'López',
    telefono: '5559876543',
    role: 'supervisora',
    promotoraIds: ['2'],
    status: 'active',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication
        const user = mockUsers.find((u) => u.email === email);

        if (user && password === 'demo123') {
          if (user.status === 'suspended') {
            return false; // Deny login if suspended
          }
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
