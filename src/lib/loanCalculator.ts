export interface LoanCalculation {
  requestedAmount: number;
  interestRate: number;
  interestAmount: number;
  totalAmount: number;
  numberOfPayments: number;
  paymentAmount: number;
  frequency: 'biweekly' | 'monthly';
  totalDays: number;
}

const INTEREST_RATE = 0.15; // 15% fijo

export function calculateLoan(
  amount: number,
  numberOfPayments: number,
  frequency: 'biweekly' | 'monthly'
): LoanCalculation {
  const interestAmount = amount * INTEREST_RATE;
  const totalAmount = amount + interestAmount;
  const paymentAmount = totalAmount / numberOfPayments;
  
  // Calcular días totales
  const daysPerPayment = frequency === 'biweekly' ? 15 : 30;
  const totalDays = numberOfPayments * daysPerPayment;
  
  return {
    requestedAmount: amount,
    interestRate: INTEREST_RATE,
    interestAmount,
    totalAmount,
    numberOfPayments,
    paymentAmount,
    frequency,
    totalDays
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

/**
 * Valida que una fecha sea sábado
 */
export function isSaturday(date: Date): boolean {
  return date.getDay() === 6;
}

/**
 * Obtiene el próximo sábado desde una fecha dada
 */
export function getNextSaturday(date: Date = new Date()): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  result.setDate(result.getDate() + (daysUntilSaturday || 7));
  return result;
}
