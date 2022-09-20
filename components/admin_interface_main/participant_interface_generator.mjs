import { writeText } from "../js_helper_funcs/clipboard.mjs";
import { injectionLoader } from "../qualtrics/injection.mjs";

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
 * @param {*} graphObj TODO
 * 
 * @returns {Promise<string>} the injection as a string
 */
export async function generateCode(graphObj) {
  return `eval(${JSON.stringify(`(${injectionLoader.toString()})("${JSON.stringify(graphObj ?? null)}");`)});`;
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
