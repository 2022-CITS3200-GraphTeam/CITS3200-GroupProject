import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { GraphRestriction } from "../graph_data_types/GraphRestriction.mjs";
import { generateCode, outputGeneratedCode } from "./participant_interface_generator.mjs";

/**
 * @returns {Array<GraphRestriction>}
 */
function getRestrictions() {
  let restrictionRows = [...document.getElementById("rulesInput").rows].slice(1); // excluding the header row
  
  let restrictions = restrictionRows.flatMap(row => {
    let rule = row.querySelector(".ruleInput").value;
    let errorMessage = ""; // row.querySelector(".errorInput").value;

    // exclude the rule if it's not valid
    if (!GraphRestriction.validateRule(rule)) {
      console.warn("Invalid rule being excluded:", rule);
      return [];
    }

    return [new GraphRestriction(rule, errorMessage)];
  });
  
  return restrictions;
}

document.getElementById("submitButton").addEventListener("click", async () => {
  let chartObj = getChartObj(); // `getChartObj` defined in `main.js`
  let graphRestrictions = getRestrictions();
  let graphObj = new GraphDataObject(chartObj, graphRestrictions);

  let codeStr = await generateCode(graphObj);
  await outputGeneratedCode(codeStr);
});
