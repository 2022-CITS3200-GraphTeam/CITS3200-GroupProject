import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { BASE_URL, INIT_MESSAGE, READY_MESSAGE } from "./consts.mjs";

/**
 * @param {QuestionData} questionDataObj 
 * @returns {HTMLDivElement}
 */
function getAnswerContainer(questionDataObj) { return questionDataObj.getChoiceContainer(); }

/**
 * @param {QuestionData} questionDataObj 
 * @returns {HTMLTextAreaElement}
 */
function getAnswerElement(questionDataObj) { return getAnswerContainer(questionDataObj).querySelector("textarea"); }

/**
 * @param {QuestionData} questionDataObj 
 * @param {string} answerStr 
 */
function setAnswer(questionDataObj, answerStr) {
  let el = getAnswerElement(questionDataObj);
  el.value = answerStr;
}

/**
 * @param {QuestionData} questionDataObj 
 */
function disableSubmit(questionDataObj) { questionDataObj.disableNextButton(); }

/**
 * @param {QuestionData} questionDataObj 
 */
function enableSubmit(questionDataObj) { questionDataObj.enableNextButton(); }

/**
 * Called by the injection loader when the qualtrics "onload" event fires.
 * @param {QuestionData} questionDataObj 
 * @param {GraphDataObject} graphObj 
 */
export async function onLoad(questionDataObj, graphObj) {
  // hide answer text box
  getAnswerElement(questionDataObj).style.display = "none";
};

/**
 * Called by the injection loader when the qualtrics "onReady" event fires.
 * @param {QuestionData} questionDataObj 
 * @param {GraphDataObject} graphObj 
 */
export async function onReady(questionDataObj, graphObj) {
  setAnswer(questionDataObj, "temp answer"); // ! TEMP

  // add iframe
  let graphIframe = document.createElement("iframe");
  let htmlURL = `${BASE_URL}/templates/participant_interface.html`;
  let htmlStr = await fetch(htmlURL).then(resp => resp.text()); // fetch html src (string)
  htmlStr = htmlStr.replace("<head>", `<head><base href="${htmlURL}" />`); // set base URL for iframe
  graphIframe.srcdoc = htmlStr;
  graphIframe.style = "width: 100%; height: 450px;"; // ! TEMP

  // setup coms with the iframe
  let channel = new MessageChannel();
  let port = channel.port1;

  graphIframe.addEventListener("load", () => {
    // setup channel listener
    port.onmessage = (e) => {
      switch (e.data) {
        case READY_MESSAGE:
          // send graph object
          port.postMessage(graphObj);
          break;
        
        default:
          console.warn(`Ignoring unrecognised message type ("${e.data}")`);
          break;
      }
    };

    // establish communication channel
    // * note: ideally would use `BASE_URL` for the target origin, except we're setting the iframe with `srcdoc`
    graphIframe.contentWindow.postMessage(INIT_MESSAGE, "*", [channel.port2]);
  });

  getAnswerContainer(questionDataObj).appendChild(graphIframe);
}
