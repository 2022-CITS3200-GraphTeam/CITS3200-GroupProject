import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { writeText } from "../js_helper_funcs/clipboard.mjs";
import { encodeObject } from "../js_helper_funcs/encoding.mjs";
import { injectionLoader } from "../qualtrics/injectionLoader.mjs";

const copyFlagStart = `/** ----------------------- START OF BLOCK TO COPY ----------------------- **/`;
const copyFlagEnd =   `/** ------------------------ END OF BLOCK TO COPY ------------------------ **/`;

function formatCodeForCopy(code) {
  return `${copyFlagStart}\n\n\n${code}\n\n\n${copyFlagEnd}`;
}

function generateFailText(code) {
  return `Copying to clipboard failed, please manually copy the following code instead:\n\n${code}`;
}

/**
 * Generates an injection for Qualtrics as a string.
 * 
 * @param {GraphDataObject} graphObj 
 * 
 * @returns {Promise<string>} the injection as a string
 */
export async function generateCode(graphObj) {
  let encodedObjStr = encodeObject(graphObj ?? null);
  let injectionFuncStr = injectionLoader.toString();

  return `eval(${JSON.stringify(`(${injectionFuncStr})("${encodedObjStr}");`)});`;
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
