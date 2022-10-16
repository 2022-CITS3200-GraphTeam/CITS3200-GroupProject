import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";

// * note: graphObjStr is encoded - see `components/js_helper_funcs/encoding.mjs`
export async function injectionLoader(graphObjStr) {
  /** @type {GraphDataObject} */
  let graphObj = JSON.parse(decodeURIComponent(atob(graphObjStr)));
  
  // load (this) module
  // ! TODO change import location to read from somewhere
  let modulePromise = import("http://localhost:5500/components/qualtrics/injection.mjs");

  // add qualtrics event handlers
  Qualtrics.SurveyEngine.addOnload(async function() { (await modulePromise).onLoad(this, graphObj); });
  Qualtrics.SurveyEngine.addOnReady(async function() { (await modulePromise).onReady(this, graphObj); });
  
  // report module loading success/failure
  modulePromise.then(
    () => { console.info("Loaded graph injection module."); },
    (err) => { console.error("Failed to load graph injection module.", err); alert("Failed to load graph."); }
  );
}
