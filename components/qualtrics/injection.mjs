// ? currently injecting everything that is needed; should some of it be loaded from github pages?
// advantages of loading: smaller payload, easier to separate out and organise code, less jank
// disadvantages: - changing the hosted code will break old surveys
//                - potential security vulnerability, but the user is already copying in the code from the website and other stuff is loaded from CDNs so probably fine?

// ! TODO change import location to read from somewhere
export const baseURL = "https://cdn.jsdelivr.net/gh/2022-CITS3200-GraphTeam/CITS3200-GroupProject@23+45-submit-stub";

// * note: graphObj as a (JSON) string
export async function injectionLoader(graphObjJSON) {
  let graphObj = JSON.parse(graphObjJSON);
  
  // load (this) module
  // ! TODO change import location to read from somewhere
  let modulePromise = import("https://cdn.jsdelivr.net/gh/2022-CITS3200-GraphTeam/CITS3200-GroupProject@23+45-submit-stub/components/qualtrics/injection.min.mjs");

  // add qualtrics event handlers
  Qualtrics.SurveyEngine.addOnload(async function() { (await modulePromise).onLoad(this, JSON.parse(graphObj)); });
  Qualtrics.SurveyEngine.addOnReady(async function() { (await modulePromise).onReady(this, JSON.parse(graphObj)); });
  
  // report module loading success/failure
  modulePromise.then(
    () => { console.info("Loaded graph injection module."); },
    () => { console.error("Failed to load graph injection module."); alert("Failed to load graph."); }
  );
}


function getAnswerContainer(questionDataObj) { return questionDataObj.getChoiceContainer(); }
function getAnswerElement(questionDataObj) { return getAnswerContainer(questionDataObj).querySelector("textarea"); }

function setAnswer(questionDataObj, answerStr) {
  let el = getAnswerElement(questionDataObj);
  el.value = answerStr;
}

function disableSubmit(questionDataObj) { questionDataObj.disableNextButton(); }
function enableSubmit(questionDataObj) { questionDataObj.enableNextButton(); }

export async function onLoad(questionDataObj, graphObj) {
  // hide answer text box
  getAnswerElement(questionDataObj).style.display = "none";
};

export async function onReady(questionDataObj, graphObj) {
  setAnswer(questionDataObj, "temp answer"); // ! TEMP

  // add iframe
  let graph = document.createElement("iframe");
  let htmlURL = `${baseURL}/templates/participant_interface.html`;
  let htmlStr = await fetch(htmlURL).then(resp => resp.text()); // fetch html src (string)
  htmlStr = htmlStr.replace("<head>", `<head><base href="${htmlURL}" />`); // set base URL for iframe
  graph.srcdoc = htmlStr;
  graph.style = "width: 100%; height: 450px;"; // ! TEMP
  getAnswerContainer(questionDataObj).appendChild(graph);
}
