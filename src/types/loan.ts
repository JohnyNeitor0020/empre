export type ScoreType = 'good' | 'warning' | 'bad' | null;

export interface ClientData {
  curp: string;
  nombre_completo: string;
  prioritario: boolean;
  whatsapp: string;
  celular?: string;
  cumpleanos: Date | null;
  ine: File | null;
  redes_sociales?: string;
  red_social?: 'facebook' | 'instagram' | 'otro';
  score: ScoreType;

  sueldo: number;
  banco: string;
  clabe: string;
  cuenta: string;

}

// types/loan.ts
export interface AddressData {
  cp: string;
  colonia: string;
  calle: string;
  ciudad: string;
  numero_ext: string;
  numero_int?: string;
  cruces: string;
  maps: string;
  vivienda: 'propia' | 'rentada' | 'familiar' | "";
  score_zona: string;
  tiempo: string;
  tipo: 'cliente' | 'aval' | 'referencia';
}

export interface WorkData {
  empresa: string;
  puesto: string;
  telefono: string;
  direccion: AddressData;
  tipo: 'cliente' | 'aval' | 'referencia';
}


export interface GuarantorData {
  curp: string;
  nombre_completo: string;
  whatsapp: string;
  parentesco: string;
  score: ScoreType;
  direccion: AddressData;
  laboral: WorkData;
}

export interface LoanDetailsData {
  amount: string;
  numberOfPayments: string;
  paymentFrequency: 'biweekly' | 'monthly' | '';
  startDate: Date | null;
  totalWithInterest?: string;
  paymentAmount?: string;
}

export interface PromoterData {
  nombre: string;
  ruta: string;
}

export interface SupervisorData {
  nombre_completo: string;
  phone: string;
  email: string;
}

export interface TokensData {
  promoterToken: string;
  supervisorToken: string;
}

export interface LoanFormData {
  client: ClientData;
  clientAddress: AddressData;
  clientWork: WorkData;
  clientWorkAddress: AddressData;
  guarantor: GuarantorData;
  guarantorAddress: AddressData;
  guarantorReference: GuarantorData;
  guarantorWork: WorkData;
  guarantorReferenceWork: WorkData;
  guarantorWorkAddress: AddressData;
  loanDetails: LoanDetailsData;
  promoter: PromoterData;
  supervisor: SupervisorData;
  tokens: TokensData;
}

export const STEPS = [
  'Cliente',
  'Domicilio',
  'Información Laboral',
  'Dirección Laboral',
  'Aval',
  'Domicilio del Aval',
  'Información Laboral del Aval',
  'Referencia del Aval',
  'Información Laboral de la Referencia',
  'Promotora',
  'Datos del Préstamo',
  'Resumen'
] as const;

export const REGISTER_STEPS = STEPS.slice(0, 10);
export const LOAN_STEPS = STEPS.slice(10);

export type StepName = typeof STEPS[number];