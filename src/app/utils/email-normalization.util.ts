/**
 * Normaliza un correo electrónico siguiendo las reglas de la institución UTP.
 * Para dominios @utp.edu.pe, la parte local (ID de estudiante/docente) se convierte a MAYÚSCULAS.
 * Para otros dominios, se mantiene el estándar de minúsculas.
 * 
 * @param email Correo electrónico a normalizar
 * @returns Correo normalizado
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
  
  const trimmed = email.trim();
  if (!trimmed.includes('@')) return trimmed.toLowerCase();

  const [localPart, domain] = trimmed.split('@');
  const lowerDomain = domain.toLowerCase();

  // Si es dominio UTP, la parte local debe ser MAYÚSCULAS (ej: U23226864)
  if (lowerDomain === 'utp.edu.pe') {
    return `${localPart.toUpperCase()}@${lowerDomain}`;
  }

  // Para el resto de dominios, usamos el estándar de minúsculas
  return `${localPart.toLowerCase()}@${lowerDomain}`;
}
