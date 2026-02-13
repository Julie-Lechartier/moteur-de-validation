import { calculateAge } from './module.js';

/**
 * Validates a person's age from a birth date.
 * Returns an error if the age is under 18.
 *
 * @param {Date} birthDate - The person's birth date.
 * @returns {{ valid: boolean, errorCode: string|undefined }} Validation result.
 */
function validateAge(birthDate) {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return { valid: false, errorCode: 'INVALID_BIRTHDATE' };
  }

  let age = calculateAge({ birth: birthDate });

  if (age < 18) {
    return { valid: false, errorCode: 'AGE_UNDER_18' };
  }

  return { valid: true };
}

/**
 * Validates a French postal code (5 digits).
 *
 * @param {string} postalCode - The postal code to validate.
 * @returns {{ valid: boolean, errorCode: string|undefined }} Validation result.
 */
function validatePostalCode(postalCode) {
  if (typeof postalCode !== 'string') {
    return { valid: false, errorCode: 'INVALID_TYPE' };
  }

  let regex = /^[0-9]{5}$/;

  if (!regex.test(postalCode)) {
    return { valid: false, errorCode: 'INVALID_POSTAL_CODE' };
  }

  return { valid: true };
}

/**
 * Validates a first name or last name.
 * Allows letters, accents, spaces and hyphens.
 * Returns an error for HTML tags or invalid characters.
 *
 * @param {string} identity - The name to validate.
 * @returns {{ valid: boolean, errorCode: string|undefined }} Validation result.
 */
function validateIdentity(identity) {
  if (typeof identity !== 'string') {
    return { valid: false, errorCode: 'INVALID_TYPE' };
  }

  // Basic XSS protection
  if (/<[^>]*>/.test(identity)) {
    return { valid: false, errorCode: 'XSS_DETECTED' };
  }

  let regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\- ]+$/u;

  if (!regex.test(identity)) {
    return { valid: false, errorCode: 'INVALID_IDENTITY' };
  }

  return { valid: true };
}

/**
 * Validates an email address.
 *
 * @param {string} email - The email to validate.
 * @returns {{ valid: boolean, errorCode: string|undefined }} Validation result.
 */
function validateEmail(email) {
  if (typeof email !== 'string') {
    return { valid: false, errorCode: 'INVALID_TYPE' };
  }

  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    return { valid: false, errorCode: 'INVALID_EMAIL' };
  }

  return { valid: true };
}

/**
 * Validates a full form payload.
 *
 * @param {{ birth: Date, postalCode: string, firstName: string, lastName: string, email: string }} data - Form data to validate.
 * @returns {{ valid: boolean, errors: string[] }} Global validation result.
 */
function validateForm(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['INVALID_PAYLOAD'] };
  }

  let errors = [];

  let ageResult = validateAge(data.birth);
  if (!ageResult.valid) {
    errors.push(ageResult.errorCode);
  }

  let postalResult = validatePostalCode(data.postalCode);
  if (!postalResult.valid) {
    errors.push(postalResult.errorCode);
  }

  let firstNameResult = validateIdentity(data.firstName);
  if (!firstNameResult.valid) {
    errors.push(`FIRSTNAME_${firstNameResult.errorCode}`);
  }

  let lastNameResult = validateIdentity(data.lastName);
  if (!lastNameResult.valid) {
    errors.push(`LASTNAME_${lastNameResult.errorCode}`);
  }

  let emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.push(emailResult.errorCode);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Global validator: returns true if the form is valid.
 *
 * @param {{ birth: Date, postalCode: string, firstName: string, lastName: string, email: string }} data - Form data to validate.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function isFormValid(data) {
  const result = validateForm(data);
  return result.valid;
}

export {
  validateAge,
  validatePostalCode,
  validateIdentity,
  validateEmail,
  validateForm,
  isFormValid,
};
