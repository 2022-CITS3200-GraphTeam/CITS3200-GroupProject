import { writeText } from "../js_helper_funcs/clipboard.mjs";
import { getInjectionTemplate } from "../qualtrics/injection.mjs";

const copyFlagStart = `/** ------------------------ START OF BLOCK TO COPY ------------------------ **/`;
const copyFlagEnd =   `/** ------------------------- END OF BLOCK TO COPY ------------------------- **/`;

function formatCodeForCopy(code) {
  return `${copyFlagStart}\n\n\n${code}\n\n\n${copyFlagEnd}`;
}

function generateFailText(code) {
  return `Copying to clipboard failed, please manually copy the following code instead:\n\n${code}`;
}

/**
 * Generates an injection for Qualtrics as a string.
 * 
 * TODO: accept actual graph data inputs and set the graph data for the participant interface
 * ! current method for setting the iframe MUST be changed at some point
 * 
 * @returns {Promise<string>} the injection as a string
 */
export async function generateCode() {
  let websiteStr = `\n${await fetch("./participant_interface.html").then((response) => response.text())}`;
  return `(${getInjectionTemplate().toString().replace("${srcdoc}", websiteStr)})();`; // ! *very* jank - MUST be changed at some point
}

/**
 * Formats and outputs the code to the user.
 * Currently copies the code to the clipboard (as a string).
 * 
 * @param {Promise<string>} code
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
