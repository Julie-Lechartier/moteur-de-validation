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
    let now = new Date();
    let birthYear = now.getFullYear() - 18;
    let birthDate = new Date(birthYear, now.getMonth(), now.getDate());

    let result = validateAge(birthDate);
    expect(result.valid).toBe(true);
  });

  it('should reject age under 18', () => {
    let now = new Date();
    let birthYear = now.getFullYear() - 17;
    let birthDate = new Date(birthYear, now.getMonth(), now.getDate());

    let result = validateAge(birthDate);
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
    let res1 = validatePostalCode('6900');
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
    let res = validateIdentity('Jean@Doe');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('INVALID_IDENTITY');
  });

  it('should reject identity with digits', () => {
    let res = validateIdentity('Jean123');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('INVALID_IDENTITY');
  });

  it('should reject HTML tags', () => {
    let res = validateIdentity('<script>alert(1)</script>');
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
    let res = validateEmail('invalid-email');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('INVALID_EMAIL');
  });
});

// all fields in form
describe('validateForm', () => {
  let now = new Date();
  let birthYear = now.getFullYear() - 25;

  it('should return valid=true for a correct payload', () => {

    let user = {
      birth: new Date(birthYear, now.getMonth(), now.getDate()),
      postalCode: '69001',
      firstName: 'admin',
      lastName: 'Test',
      email: 'admin.text@test.com',
    };

    let res = validateForm(user);
    expect(res.valid).toBe(true);
    expect(res.errors).toEqual([]);
  });

  it('should aggregate errors for invalid payload', () => {
    let user = {
      birth: new Date('invalid'),
      postalCode: '0100O',
      firstName: '<script>Test</script>',
      lastName: 'T3st',
      email: 'test.com',
    };

    let res = validateForm(user);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });

  it('should reject null payload', () => {
    let res = validateForm(null);
    expect(res.valid).toBe(false);
    expect(res.errors).toContain('INVALID_PAYLOAD');
  });
});

describe('isFormValid', () => {
  it('should return true for a valid form', () => {
    const now = new Date();
    const birthYear = now.getFullYear() - 25;

    const user = {
      birth: new Date(birthYear, now.getMonth(), now.getDate()),
      postalCode: '69001',
      firstName: 'admin',
      lastName: 'Test',
      email: 'admin.text@test.com',
    };

    expect(isFormValid(user)).toBe(true);
  });

  it('should return false for an invalid form', () => {
    const user = {
      birth: new Date('invalid'),
      postalCode: '0100O',
      firstName: '<script>Test</script>',
      lastName: 'T3st',
      email: 'test.com',
    };

    expect(isFormValid(user)).toBe(false);
  });
});

