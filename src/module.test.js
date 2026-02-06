import { calculateAge } from './module';
import { beforeEach, describe, expect, it } from '@jest/globals';

/**
 * @function calculateAge
 */
describe('calculateAge Unit Test Suites', () => {
  // prendre en compte la date actuelle dans donnée de test
  // cas si on lance le test l'année prochaine
  let people20years;
  beforeEach(() => {
    let date = new Date();
    people20years = {
      birth: new Date(date.getFullYear() - 20),
    };
  });
  it('should throw a "missing param p" error', () => {
    expect(() => calculateAge()).toThrow('missing param p');
  });

  // le format envoyé n'est pas un objet
  it('should throw if p is not an object', () => {
    expect(() => calculateAge('string')).toThrow();
  });

  // l'objet ne contient pas un champ birth
  it('should throw if no birth property', () => {
    expect(() => calculateAge({})).toThrow('invalid birth date');
    expect(() => calculateAge({ birth: null })).toThrow('invalid birth date');
  });

  // le champ birth n'est pas une date
  it('should throw if birth property is not a date', () => {
    expect(() => calculateAge({ birth: 'string' })).toThrow(
      'invalid birth date',
    );
    expect(() => calculateAge({ birth: 1 })).toThrow('invalid birth date');
    expect(() => calculateAge({ birth: [] })).toThrow('invalid birth date');
  });

  // la date envoyée est fausse
  it('should throw if birth date is invalid', () => {
    expect(() => calculateAge({ birth: new Date('invalid') })).toThrow(
      'invalid birth date',
    );
  });
});
