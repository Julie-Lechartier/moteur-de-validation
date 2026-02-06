import {
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail,
  validateForm,
} from './validator.js';
import { describe, it, expect } from '@jest/globals';

// age
describe('validateAge', () => {
  it('should accept age 18', () => {
    const now = new Date();
    const birthYear = now.getFullYear() - 18;
    const birthDate = new Date(birthYear, now.getMonth(), now.getDate());

    const result = validateAge(birthDate);
    expect(result.valid).toBe(true);
  });

  it('should reject age under 18', () => {
    const now = new Date();
    const birthYear = now.getFullYear() - 17;
    const birthDate = new Date(birthYear, now.getMonth(), now.getDate());

    const result = validateAge(birthDate);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('AGE_UNDER_18');
  });
});

// postal code
describe('validatePostalCode', () => {
  it('should accept valid french postal code', () => {
    expect(validatePostalCode('69001').valid).toBe(true);
  });

  it('should reject not string', () => {
    expect(validatePostalCode(69001).valid).toBe(false);
  });

  it('should reject when not 5 number', () => {
    const res1 = validatePostalCode('6900');
    expect(res1.valid).toBe(false);
    expect(res1.errorCode).toBe('INVALID_POSTAL_CODE');

    expect(validatePostalCode('6900A').valid).toBe(false);
  });
});

// firstname / lastname
describe('validateIdentity', () => {
  it('should accept name with some chars', () => {
    expect(validateIdentity('Jean-Pierre Éléonore').valid).toBe(true);
  });

  it('should reject bad chars', () => {
    const res = validateIdentity('Jean@Doe');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('INVALID_IDENTITY');
  });

  it('should reject HTML tags', () => {
    const res = validateIdentity('<script>alert(1)</script>');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('XSS_DETECTED');
  });
});

// email
describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('test@example.com').valid).toBe(true);
  });

  it('should reject invalid email', () => {
    const res = validateEmail('invalid-email');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('INVALID_EMAIL');
  });
});

// all fields in form
describe('validateForm', () => {
  it('should return valid=true for a correct payload', () => {
    const now = new Date();
    const birthYear = now.getFullYear() - 25;
    const user = {
      birth: new Date(birthYear, now.getMonth(), now.getDate()),
      postalCode: '69001',
      firstName: 'admin',
      lastName: 'Test',
      email: 'admin.text@test.com',
    };

    const res = validateForm(user);
    expect(res.valid).toBe(true);
    expect(res.errors).toEqual([]);
  });

  it('should aggregate errors for invalid payload', () => {
    const user = {
      birth: new Date('invalid'),
      postalCode: '0100O',
      firstName: '<script>Test</script>',
      lastName: 'T3st',
      email: 'test.com',
    };

    const res = validateForm(user);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });

  it('should reject null payload', () => {
    const res = validateForm(null);
    expect(res.valid).toBe(false);
    expect(res.errors).toContain('INVALID_PAYLOAD');
  });
});
