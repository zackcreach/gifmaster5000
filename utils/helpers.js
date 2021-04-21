/**
 * Modify search field to satisfy postgres' to_tsquery() syntax
 * @param {String} value
 * @returns {String}
 */
export function formatSearchString(value) {
  return value.trim().replace(/\s/g, " | ");
}
