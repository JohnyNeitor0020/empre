export type Role = 'promotora' | 'supervisora' | 'admin';

export interface UsuarioBase {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  role: Role;
}

export interface Direccion {
  id_direccion?: number;
  cp: string;
  colonia: string;
  calle: string;
  numero_ext: string;
  numero_int?: string;
  ciudad: string;
  cruces: string;
  maps: string;
  vivienda?: string;
  score_zona?: string;
  tiempo?: string;
  tipo?: string;
}

export interface Laboral {
  id_laboral?: number;
  empresa: string;
  puesto: string;
  telefono: string;
  direccion: Direccion;
  tipo?: string;
}

export interface Aval {
  id_aval?: number;
  curp: string;
  nombre_completo: string;
  parentesco: string;
  whatsapp: string;
  direccion: Direccion;
  laboral?: Laboral;
  score_riesgo?: string;
}

export interface Referencia {
  id_referencia?: number;
  curp: string;
  nombre: string;
  whatsapp: string;
  parentesco: string;
  direccion: Direccion;
  laboral?: Laboral;
}

export interface Promotora extends UsuarioBase {
  role: 'promotora';
  rutaId?: string;
  clientesAsignados: string[];
  comision: number;
}

export interface Supervisora extends UsuarioBase {
  role: 'supervisora';
  promotoraIds: string[];
}

export interface Admin extends UsuarioBase {
  role: 'admin';
}

export type Usuario = Promotora | Supervisora | Admin;

export type EstadoCliente = 'activo' | 'baja' | 'moroso';
export type TipoRedSocial = 'facebook' | 'instagram' | 'otro';

export interface Cliente {
  id: string;
  curp: string;
  nombre_completo: string;
  prioritario: boolean;
  whatsapp: string;
  cumpleanos: Date | null;
  ineFileUrl?: string;
  red_social: string;
  que_red_social: TipoRedSocial;
  sueldo: number;
  tipo_de_banco: string;
  clabe: string;
  numero_de_cuenta: string;
  estado: EstadoCliente;
  promotoraId: string;
  // New fields
  direccion?: Direccion;
  laboral?: Laboral;
  aval?: Aval;
  referencia?: Referencia;
}

export type TipoPago = 'normal' | 'no_pago' | 'retardo' | 'renovado' | 'entregado';
export type MedioPago = 'efectivo' | 'deposito';

export interface PagoRegistro {
  id: string;
  clienteId: string;
  fecha: Date;
  tipo: TipoPago;
  medio: MedioPago;
  cantidad: number;
  descuento?: number;
}

export interface Ruta {
  id: string;
  nombre: string;
  supervisoraId: string;
  promotoraIds: string[];
}

export interface TotalesSemanal {
  pagosNormalesEfectivo: number;
  pagosNormalesDeposito: number;
  renovado: number;
  entregado: number;
  comision: number;
  total: number;
}
