import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { GraphRestriction } from "../graph_data_types/GraphRestriction.mjs";
import { generateCode, outputGeneratedCode } from "./participant_interface_generator.mjs";

/**
 * @returns {{ valid: Array<GraphRestriction>, invalid: Array<{ rule: string, errorMessage: string }> }}
 */
function getRestrictions() {
  let restrictionRows = [...document.getElementById("rulesInput").rows].slice(1); // excluding the header row
  
  // used for checking rule validity
  let nColumns = getColValues().length; // `getColValues` defined in `main.js`

  let validRestrictions = [], invalidRestrictions = [];
  restrictionRows.forEach(row => {
    let rule = row.querySelector(".ruleInput").value;
    let errorMessage = ""; // row.querySelector(".errorInput").value;

    // exclude the rule if it's not valid
    if (!GraphRestriction.validateRule(rule)) {
      console.error(`Invalid rule being excluded:`, rule);
      invalidRestrictions.push({ rule, errorMessage });
      return;
    }

    // exclude the rule if it uses out-of-range columns
    let columnIndices = [...rule.matchAll(GraphRestriction.getColumnRegex())].map(arr => parseInt(arr[1]));
    let maxColumnIndex = columnIndices.reduce((r, v) => v > r ? v : r, -1);
    if (maxColumnIndex > nColumns) {
      console.error(`Invalid rule being excluded (index ${maxColumnIndex} out of range - expected between 1 and ${nColumns}):`, rule);
      invalidRestrictions.push({ rule, errorMessage });
      return;
    }
    // ? should `maxColumnIndex === -1` (i.e. no columns specified in the rule) be checked

    validRestrictions.push(new GraphRestriction(rule, errorMessage));
    return;
  });
  
  return {
    valid: validRestrictions,
    invalid: invalidRestrictions
  };
}

function getTotalSum() {
  let raw = document.getElementById("totalSum").value;

  // handle total sum being not set
  if (raw === "") return undefined;

  return parseFloat(raw);
}

document.getElementById("submitButton").addEventListener("click", async () => {
  let chartObj = getChartObj(); // `getChartObj` defined in `main.js`
  let graphRestrictions = getRestrictions();
  let graphTotalSum = getTotalSum();
  let graphObj = new GraphDataObject(chartObj, graphRestrictions.valid, graphTotalSum);

  let nInvalid = graphRestrictions.invalid.length;
  if (nInvalid > 0) {
    // only trigger the extra alert if it's not the default empty rule
    if (!(graphRestrictions.valid.length + nInvalid === 1 && graphRestrictions.invalid[0].rule === "")) {
      alert(
        `${nInvalid} invalid restriction${nInvalid > 1 ? "s" : ""} have not been included in the export. ` +
        `Check the console logs (f12) for more details.`
      );
    }
  }

  let codeStr = await generateCode(graphObj);
  await outputGeneratedCode(codeStr);
});
