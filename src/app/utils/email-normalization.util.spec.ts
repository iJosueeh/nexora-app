import { normalizeEmail } from './email-normalization.util';

describe('EmailNormalizationUtil', () => {
  it('should uppercase local part for @utp.edu.pe domain', () => {
    expect(normalizeEmail('u23226864@utp.edu.pe')).toBe('U23226864@utp.edu.pe');
    expect(normalizeEmail('U23226864@utp.edu.pe')).toBe('U23226864@utp.edu.pe');
    expect(normalizeEmail('  u23226864@UTP.EDU.PE  ')).toBe('U23226864@utp.edu.pe');
  });

  it('should lowercase whole email for other domains', () => {
    expect(normalizeEmail('User@Gmail.com')).toBe('user@gmail.com');
    expect(normalizeEmail('TEST.USER@outlook.com')).toBe('test.user@outlook.com');
  });

  it('should handle empty or invalid emails gracefully', () => {
    expect(normalizeEmail('')).toBe('');
    expect(normalizeEmail('not-an-email')).toBe('not-an-email');
  });
});
