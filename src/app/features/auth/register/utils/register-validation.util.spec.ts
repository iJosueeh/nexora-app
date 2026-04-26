import { FormControl } from '@angular/forms';
import { isUtpEmail, utpEmailValidator, buildFullName, buildUsername } from './register-validation.util';

describe('RegisterValidationUtil', () => {
  describe('isUtpEmail', () => {
    it('should return true for valid UTP emails', () => {
      expect(isUtpEmail('u23226864@utp.edu.pe')).toBe(true);
      expect(isUtpEmail('U23226864@utp.edu.pe')).toBe(true);
      expect(isUtpEmail('test.user@utp.edu.pe')).toBe(true);
    });

    it('should return false for non-UTP emails', () => {
      expect(isUtpEmail('user@gmail.com')).toBe(false);
      expect(isUtpEmail('test@outlook.com')).toBe(false);
    });
  });

  describe('utpEmailValidator', () => {
    it('should return null for valid UTP email', () => {
      const control = new FormControl('u23226864@utp.edu.pe');
      expect(utpEmailValidator(control)).toBeNull();
    });

    it('should return error for invalid UTP email', () => {
      const control = new FormControl('invalid@gmail.com');
      expect(utpEmailValidator(control)).toEqual({ utpEmail: true });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(utpEmailValidator(control)).toBeNull();
    });
  });

  describe('buildFullName', () => {
    it('should join first and last name', () => {
      expect(buildFullName('Josue', 'Huaman')).toBe('Josue Huaman');
    });
  });

  describe('buildUsername', () => {
    it('should create username from names', () => {
      expect(buildUsername('Josue', 'Huaman', '')).toBe('josue.huaman');
    });

    it('should create username from email prefix if names missing', () => {
      expect(buildUsername('', '', 'u23226864@utp.edu.pe')).toBe('u23226864');
    });
  });
});
