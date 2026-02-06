import { calculateAge } from './module.js';

/**
 * Invalidate age under 18
 *
 * @param {Date} birthDate
 * @returns {{ valid: boolean, errorCode?: string }}
 */
function validateAge(birthDate) {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return { valid: false, errorCode: 'INVALID_BIRTHDATE' };
  }

  const age = calculateAge({ birth: birthDate });

  if (age < 18) {
    return { valid: false, errorCode: 'AGE_UNDER_18' };
  }

  return { valid: true };
}

/**
 * french postal code
 *
 * @param {string} postalCode
 * @returns {{ valid: boolean, errorCode?: string }}
 */
function validatePostalCode(postalCode) {
  if (typeof postalCode !== 'string') {
    return { valid: false, errorCode: 'INVALID_TYPE' };
  }

  const regex = /^[0-9]{5}$/;

  if (!regex.test(postalCode)) {
    return { valid: false, errorCode: 'INVALID_POSTAL_CODE' };
  }

  return { valid: true };
}

/**
 * FirstName, LastName :
 *
 *
 * @param {string} identity
 * @returns {{ valid: boolean, errorCode?: string }}
 */
function validateIdentity(identity) {
  if (typeof identity !== 'string') {
    return { valid: false, errorCode: 'INVALID_TYPE' };
  }

  // petite protection XSS
  if (/<[^>]*>/.test(identity)) {
    return { valid: false, errorCode: 'XSS_DETECTED' };
  }

  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\- ]+$/u;

  if (!regex.test(identity)) {
    return { valid: false, errorCode: 'INVALID_IDENTITY' };
  }

  return { valid: true };
}

/**
 * Email
 *
 * @param {string} email
 * @returns {{ valid: boolean, errorCode?: string }}
 */
function validateEmail(email) {
  if (typeof email !== 'string') {
    return { valid: false, errorCode: 'INVALID_TYPE' };
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    return { valid: false, errorCode: 'INVALID_EMAIL' };
  }

  return { valid: true };
}

/**
 * All form
 *
 * @param {{ birth: Date, postalCode: string, firstName: string, lastName: string, email: string }} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateForm(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['INVALID_PAYLOAD'] };
  }

  const errors = [];

  const ageResult = validateAge(data.birth);
  if (!ageResult.valid) {
    errors.push(ageResult.errorCode);
  }

  const postalResult = validatePostalCode(data.postalCode);
  if (!postalResult.valid) {
    errors.push(postalResult.errorCode);
  }

  const firstNameResult = validateIdentity(data.firstName);
  if (!firstNameResult.valid) {
    errors.push(`FIRSTNAME_${firstNameResult.errorCode}`);
  }

  const lastNameResult = validateIdentity(data.lastName);
  if (!lastNameResult.valid) {
    errors.push(`LASTNAME_${lastNameResult.errorCode}`);
  }

  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.push(emailResult.errorCode);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export {
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail,
  validateForm,
};
