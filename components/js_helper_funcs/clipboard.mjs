export const plaintextMIME = "text/plain";

export function createTextBlob(text) {
  return new Blob([text], { type: plaintextMIME });
}

export function createTextClipboardItemObject(text) {
  return [new ClipboardItem({ [plaintextMIME]: createTextBlob(text) })];
}

/**
 * Writes text to the user's clipboard.
 * 
 * @param {string} text the text to write to the clipboard
 * @returns {Promise<void>} a promise that resolves when/if the write succeeds, and rejects if it fails
 */
export async function writeText(text) {
  return navigator.clipboard.write(createTextClipboardItemObject(text));
}
