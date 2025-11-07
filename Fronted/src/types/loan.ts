export type ScoreType = 'good' | 'warning' | 'bad' | null;

export interface ClientData {
  curp: string;
  fullName: string;
  isDisabled: boolean;
  whatsapp: string;
  birthday: Date | null;
  ine: File | null;
  socialMedia?: string;
  socialMediaType?: 'facebook' | 'instagram';
  score: ScoreType;
}

export interface AddressData {
  postalCode: string;
  neighborhood: string;
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  crossStreets: string;
  city: string;
  latitude?: number;
  longitude?: number;
  housingType?: 'owned' | 'paying' | 'rented' | 'family';
  timeAtAddress?: string;
}

export interface WorkData {
  companyName: string;
  position: string;
  companyPhone: string;
  salary: string;
}

export interface GuarantorData {
  curp: string;
  fullName: string;
  whatsapp: string;
  relationship: string;
  score: ScoreType;
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
  fullName: string;
  phone: string;
  email: string;
  route: string;
}

export interface SupervisorData {
  fullName: string;
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
  'Dirección del Aval',
  'Referencia del Aval',
  'Información Laboral del Aval',
  'Dirección Laboral del Aval',
  'Datos del Préstamo',
  'Promotora',
  'Supervisora',
  'Resumen'
] as const;

export type StepName = typeof STEPS[number];
