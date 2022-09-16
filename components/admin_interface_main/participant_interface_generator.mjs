import { writeText } from "../js_helper_funcs/clipboard.mjs";

const copyFlagStart = `/** -------------------------- START COPYING HERE -------------------------- **/`;
const copyFlagEnd =   `/** --------------------------- END COPYING HERE --------------------------- **/`;

function formatCodeForCopy(code) {
  return `${copyFlagStart}\n\n\n${code}\n\n\n${copyFlagEnd}`;
}

function generateFailText(code) {
  return `Copying to clipboard failed, please manually copy the following code instead:\n\n${code}`;
}

/**
 * Outputs the code generated, for the user to access.
 * Currently copies the code to the clipboard (as a string).
 * 
 * @param {string} code
 */
export async function outputGeneratedCode(code) {
  let formattedCode = formatCodeForCopy(code);

  await writeText(formattedCode).then(
    () => alert("Copied participant interface code to clipboard."),
    () => {
      console.log(generateFailText(formattedCode));
      alert("Failed to copy to clipboard: check the console logs (f12) for more info and to manually copy the code.")
    }
  );
}
