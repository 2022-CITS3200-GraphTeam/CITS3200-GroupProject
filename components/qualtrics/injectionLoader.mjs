import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";

// * note: graphObj as a (JSON) string
export async function injectionLoader(graphObjJSON) {
  /** @type {GraphDataObject} */
  let graphObj = JSON.parse(graphObjJSON);
  
  // load (this) module
  // ! TODO change import location to read from somewhere
  let modulePromise = import("http://localhost:5500/components/qualtrics/injection.min.mjs");

  // add qualtrics event handlers
  Qualtrics.SurveyEngine.addOnload(async function() { (await modulePromise).onLoad(this, JSON.parse(graphObj)); });
  Qualtrics.SurveyEngine.addOnReady(async function() { (await modulePromise).onReady(this, JSON.parse(graphObj)); });
  
  // report module loading success/failure
  modulePromise.then(
    () => { console.info("Loaded graph injection module."); },
    () => { console.error("Failed to load graph injection module."); alert("Failed to load graph."); }
  );
}
