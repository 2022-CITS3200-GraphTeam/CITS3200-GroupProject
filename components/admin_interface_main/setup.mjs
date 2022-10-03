import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { GraphRestriction } from "../graph_data_types/GraphRestriction.mjs";
import { generateCode, outputGeneratedCode } from "./participant_interface_generator.mjs";

/**
 * @returns {{ valid: Array<GraphRestriction>, invalid: Array<{ rule: string, errorMessage: string }> }}
 */
export function getRestrictions() {
  let restrictionRows = [...document.getElementById("rulesInput").rows].slice(1); // excluding the header row

  // used to test if a restriction uses out of range columns
  // `getChartObj` defined in `main.js`
  let colValues = getChartObj().data.datasets[0].data.map(v => parseFloat(v));

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

    let restriction = new GraphRestriction(rule, errorMessage);

    let restrictionResult;
    try {
      restrictionResult = restriction.isValid(colValues);
    } catch (err) {
      // exclude the rule if it errors
      console.error("Invalid rule being excluded; errored with:\n", err);
      invalidRestrictions.push({ rule, errorMessage });
      return;
    }

    if (!restrictionResult) console.warn(`Restriction is not currently satisfied:`, restriction);
    validRestrictions.push(restriction);
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
