import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { generateCode, outputGeneratedCode } from "./participant_interface_generator.mjs";

document.getElementById("submitButton").addEventListener("click", async () => {
  let chartObj = getChartObj(); // `getChartObj` defined in `main.js`
  let graphRestrictions = getRestrictions(); // `getRestrictions` defined in `main.js`
  let graphObj = new GraphDataObject(chartObj, graphRestrictions);

  let codeStr = await generateCode(graphObj);
  await outputGeneratedCode(codeStr);
});
