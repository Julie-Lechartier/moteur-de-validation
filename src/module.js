/**
 * Calculate a person's age in years.
 *
 * @param {object} p An object representing a person, implementing a birth Date parameter.
 * @return {number} The age in years of p.
 */
function calculateAge(p) {
  if (!p) {
    throw new Error('missing param p');
  }
  if (!(p.birth instanceof Date) || isNaN(p.birth.getTime())) {
    throw new Error('invalid birth date');
  }
  let dateDiff = new Date(Date.now() - p.birth.getTime());
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  return age;

}
export { calculateAge };