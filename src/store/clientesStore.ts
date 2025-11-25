import { create } from 'zustand';
import { Cliente } from '@/types';

interface ClientesState {
  clientes: Cliente[];
  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  getCliente: (id: string) => Cliente | undefined;
  searchByCurp: (curp: string) => Cliente[];
  markAsNoPago: (id: string) => void;
}

// Mock data
const mockClientes: Cliente[] = [
  {
    id: 'cliente-1',
    curp: 'GOMA850215HDFRRL09',
    nombre_completo: 'Juan Pérez García',
    prioritario: true,
    whatsapp: '5551234567',
    cumpleanos: new Date('1985-02-15'),
    red_social: '@juanperez',
    que_red_social: 'facebook',
    sueldo: 8000,
    tipo_de_banco: 'BBVA',
    clabe: '012180001234567890',
    numero_de_cuenta: '0123456789',
    estado: 'activo',
    promotoraId: '2',
    direccion: {
      cp: '06600',
      colonia: 'Juárez',
      calle: 'Reforma',
      numero_ext: '222',
      ciudad: 'CDMX',
      cruces: 'Insurgentes y Niza',
      maps: 'https://maps.google.com/?q=19.427024,-99.167665',
    },
    laboral: {
      empresa: 'Tech Solutions',
      puesto: 'Desarrollador',
      telefono: '5559876543',
      direccion: {
        cp: '11560',
        colonia: 'Polanco',
        calle: 'Masaryk',
        numero_ext: '101',
        ciudad: 'CDMX',
        cruces: 'Moliere y Arquimedes',
        maps: 'https://maps.google.com/?q=19.432608,-99.133209',
      },
    },
    aval: {
      curp: 'ROGS880520HDFMNT08',
      nombre_completo: 'Roberto Gómez',
      parentesco: 'Hermano',
      whatsapp: '5551112233',
      direccion: {
        cp: '06600',
        colonia: 'Juárez',
        calle: 'Reforma',
        numero_ext: '222',
        ciudad: 'CDMX',
        cruces: 'Insurgentes y Niza',
        maps: 'https://maps.google.com/?q=19.427024,-99.167665',
      },
    },
    referencia: {
      curp: 'LOMC920815MDFPRD05',
      nombre: 'María López',
      whatsapp: '5554445566',
      parentesco: 'Amiga',
      direccion: {
        cp: '06700',
        colonia: 'Roma',
        calle: 'Orizaba',
        numero_ext: '45',
        ciudad: 'CDMX',
        cruces: 'Colima y Durango',
        maps: 'https://maps.google.com/?q=19.419482,-99.161427',
      },
    },
    montoPrestamo: 5000,
    pagoSemanal: 500,
  },
  {
    id: 'cliente-2',
    curp: 'LOMC920815MDFPRD05',
    nombre_completo: 'María López Contreras',
    prioritario: false,
    whatsapp: '5559876543',
    cumpleanos: new Date('1992-08-15'),
    red_social: '@marialopez',
    que_red_social: 'instagram',
    sueldo: 6500,
    tipo_de_banco: 'Santander',
    clabe: '014180001234567890',
    numero_de_cuenta: '9876543210',
    estado: 'activo',
    promotoraId: '2',
    direccion: {
      cp: '06600',
      colonia: 'Juárez',
      calle: 'Reforma',
      numero_ext: '225',
      ciudad: 'CDMX',
      cruces: 'Insurgentes y Niza',
      maps: 'https://maps.google.com/?q=19.427024,-99.167665',
    },
    laboral: {
      empresa: 'Comercializadora SA',
      puesto: 'Ventas',
      telefono: '5551112222',
      direccion: {
        cp: '11560',
        colonia: 'Polanco',
        calle: 'Masaryk',
        numero_ext: '105',
        ciudad: 'CDMX',
        cruces: 'Moliere y Arquimedes',
        maps: 'https://maps.google.com/?q=19.432608,-99.133209',
      },
    },
    aval: {
      curp: 'ROGS880520HDFMNT08',
      nombre_completo: 'Pedro López',
      parentesco: 'Padre',
      whatsapp: '5559998877',
      direccion: {
        cp: '06600',
        colonia: 'Juárez',
        calle: 'Reforma',
        numero_ext: '225',
        ciudad: 'CDMX',
        cruces: 'Insurgentes y Niza',
        maps: 'https://maps.google.com/?q=19.427024,-99.167665',
      },
    },
    referencia: {
      curp: 'LOMC920815MDFPRD05',
      nombre: 'Luisa Martínez',
      whatsapp: '5557776655',
      parentesco: 'Prima',
      direccion: {
        cp: '06700',
        colonia: 'Roma',
        calle: 'Orizaba',
        numero_ext: '50',
        ciudad: 'CDMX',
        cruces: 'Colima y Durango',
        maps: 'https://maps.google.com/?q=19.419482,-99.161427',
      },
    },
    montoPrestamo: 3000,
    pagoSemanal: 300,
  },
  {
    id: 'cliente-3',
    curp: 'ROGS880520HDFMNT08',
    nombre_completo: 'Roberto Gómez Santos',
    prioritario: true,
    whatsapp: '5556543210',
    cumpleanos: new Date('1988-05-20'),
    red_social: '@robertogs',
    que_red_social: 'facebook',
    sueldo: 9500,
    tipo_de_banco: 'Banorte',
    clabe: '072180001234567890',
    numero_de_cuenta: '1122334455',
    estado: 'activo',
    promotoraId: '2',
    direccion: {
      cp: '06600',
      colonia: 'Juárez',
      calle: 'Reforma',
      numero_ext: '230',
      ciudad: 'CDMX',
      cruces: 'Insurgentes y Niza',
      maps: 'https://maps.google.com/?q=19.427024,-99.167665',
    },
    laboral: {
      empresa: 'Servicios Profesionales',
      puesto: 'Contador',
      telefono: '5553334444',
      direccion: {
        cp: '11560',
        colonia: 'Polanco',
        calle: 'Masaryk',
        numero_ext: '110',
        ciudad: 'CDMX',
        cruces: 'Moliere y Arquimedes',
        maps: 'https://maps.google.com/?q=19.432608,-99.133209',
      },
    },
    aval: {
      curp: 'ROGS880520HDFMNT08',
      nombre_completo: 'Ana Gómez',
      parentesco: 'Hermana',
      whatsapp: '5552223344',
      direccion: {
        cp: '06600',
        colonia: 'Juárez',
        calle: 'Reforma',
        numero_ext: '230',
        ciudad: 'CDMX',
        cruces: 'Insurgentes y Niza',
        maps: 'https://maps.google.com/?q=19.427024,-99.167665',
      },
    },
    referencia: {
      curp: 'LOMC920815MDFPRD05',
      nombre: 'Carlos Ruiz',
      whatsapp: '5558889900',
      parentesco: 'Amigo',
      direccion: {
        cp: '06700',
        colonia: 'Roma',
        calle: 'Orizaba',
        numero_ext: '55',
        ciudad: 'CDMX',
        cruces: 'Colima y Durango',
        maps: 'https://maps.google.com/?q=19.419482,-99.161427',
      },
    },
    montoPrestamo: 8000,
    pagoSemanal: 800,
  },
];

export const useClientesStore = create<ClientesState>((set, get) => ({
  clientes: mockClientes,
  addCliente: (cliente) =>
    set((state) => ({ clientes: [...state.clientes, cliente] })),
  updateCliente: (id, updatedData) =>
    set((state) => ({
      clientes: state.clientes.map((c) =>
        c.id === id ? { ...c, ...updatedData } : c
      ),
    })),
  getCliente: (id) => get().clientes.find((c) => c.id === id),
  searchByCurp: (curp) => {
    const searchTerm = curp.toLowerCase().trim();
    return get().clientes.filter((c) =>
      c.curp.toLowerCase().includes(searchTerm)
    );
  },
  markAsNoPago: (id) =>
    set((state) => ({
      clientes: state.clientes.map((c) =>
        c.id === id
          ? {
            ...c,
            diasRetraso: (c.diasRetraso || 0) + 7,
            estado: 'moroso' as const,
          }
          : c
      ),
    })),
}));
