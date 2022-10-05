/**
 * Encodes an object to a string.
 * @see {@link decodeObjectStr}
 * 
 * @param {Object} obj a JSON-compatible object (e.g. not `undefined`)
 * @returns {string} a string that can be decoded using {@link decodeObjectStr}
 */
export function encodeObject(obj) {
  // encode to JSON string
  let jsonStr = JSON.stringify(obj);

  // URI encode special characters (to support `btoa`)
  let uriStr = encodeURIComponent(jsonStr);

  // encode to base 64 (to remove special characters)
  let b64Str = btoa(uriStr);

  return b64Str;
}

/**
 * Decodes a string to an object.
 * @see {@link encodeObject}
 * 
 * @param {string} str an object encoded using {@link encodeObject}
 * @returns {Object}
 */
export function decodeObjectStr(str) {
  // decode from base 64
  let uriStr = atob(str);

  // decode URI replacements
  let jsonStr = decodeURIComponent(uriStr);

  // parse JSON
  let obj = JSON.parse(jsonStr);

  return obj;
}
