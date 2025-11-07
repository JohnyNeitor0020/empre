/**
 * Valida el formato de un CURP mexicano
 * Formato: 4 letras, 6 dígitos, 6 caracteres alfanuméricos, 1 dígito
 */
export function validateCurpFormat(curp: string): boolean {
  const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/;
  return curpRegex.test(curp.toUpperCase());
}

/**
 * Valida la fecha de nacimiento en el CURP
 */
export function validateCurpDate(curp: string): boolean {
  if (!validateCurpFormat(curp)) return false;
  
  const year = parseInt(curp.substring(4, 6));
  const month = parseInt(curp.substring(6, 8));
  const day = parseInt(curp.substring(8, 10));
  
  // Validar mes
  if (month < 1 || month > 12) return false;
  
  // Validar día
  if (day < 1 || day > 31) return false;
  
  // Validación básica de días según mes
  if ([4, 6, 9, 11].includes(month) && day > 30) return false;
  if (month === 2 && day > 29) return false;
  
  return true;
}

/**
 * Valida estados válidos de México en CURP
 */
export function validateCurpState(curp: string): boolean {
  if (!validateCurpFormat(curp)) return false;
  
  const validStates = [
    'AS', 'BC', 'BS', 'CC', 'CL', 'CM', 'CS', 'CH', 'DF', 'DG',
    'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC',
    'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ',
    'YN', 'ZS', 'NE'
  ];
  
  const state = curp.substring(11, 13).toUpperCase();
  return validStates.includes(state);
}

/**
 * Validación completa de CURP mexicano
 */
export function isValidCurp(curp: string): boolean {
  if (!curp || curp.length !== 18) return false;
  
  return validateCurpFormat(curp) && 
         validateCurpDate(curp) && 
         validateCurpState(curp);
}

/**
 * Genera un score aleatorio para demo (verde/amarillo/rojo)
 */
export function generateRandomScore(): 'good' | 'warning' | 'bad' {
  const random = Math.random();
  if (random < 0.5) return 'good';
  if (random < 0.8) return 'warning';
  return 'bad';
}
