import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { BASE_URL } from "./consts.mjs";
import { Message, MessageType } from "./Message.mjs";

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
  // add iframe
  let graphIframe = document.createElement("iframe");
  let htmlURL = `${BASE_URL}/templates/participant_interface.html`;
  let htmlStr = await fetch(htmlURL).then(resp => resp.text()); // fetch html src (string)
  htmlStr = htmlStr.replace("<head>", `<head><base href="${htmlURL}" />`); // set base URL for iframe
  graphIframe.srcdoc = htmlStr;
  graphIframe.style = "width: 100%; height: 650px;"; // ! TEMP

  // setup coms with the iframe
  let channel = new MessageChannel();
  let port = channel.port1;

  graphIframe.addEventListener("load", () => {
    // setup channel listener
    port.onmessage = (e) => {
      /** @type {Message} */
      let message = e.data;
      switch (message.messageType) {
        case undefined:
          console.error("Missing message type in message data structure:", e);
          break;

        case MessageType.READY:
          // send graph object to be loaded
          port.postMessage(graphObj);
          break;

        case MessageType.SET_ANS:
          let ans = message.messageData;
          console.info("set answer request:", JSON.stringify(ans));
          setAnswer(questionDataObj, ans);
          break;

        // TODO: enable/disable submit button based on graph; more request types?
        
        default:
          console.warn(`Ignoring unrecognised message type ("${e.data}")`);
          break;
      }
    };

    // establish communication channel
    // * note: ideally would use `BASE_URL` for the target origin, except we're setting the iframe with `srcdoc`
    graphIframe.contentWindow.postMessage(new Message(MessageType.INIT), "*", [channel.port2]);
  });

  getAnswerContainer(questionDataObj).appendChild(graphIframe);
}
