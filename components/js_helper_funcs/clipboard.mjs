export const plaintextMIME = "text/plain";

/**
 * Writes text to the user's clipboard.
 * 
 * @param {string} text the text to write to the clipboard
 * @returns {Promise<void>} a promise that resolves when/if the write succeeds, and rejects if it fails
 */
export async function writeText(text) {
  return navigator.clipboard.writeText(text);
}
