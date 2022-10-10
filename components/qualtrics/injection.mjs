import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { BASE_URL, MESSAGE_LOGGING } from "./consts.mjs";
import { disableSubmit, enableSubmit, getAnswer, getAnswerContainer, getAnswerElement, setAnswer } from "./helpers.mjs";
import { Message, MessageType } from "./Message.mjs";

/**
 * Called by the injection loader when the qualtrics "onload" event fires.
 * @param {QuestionData} questionDataObj 
 * @param {object} rawGraphObj a {@link GraphDataObject}-like object
 */
export async function onLoad(questionDataObj, rawGraphObj) {
  // hide answer text box
  getAnswerElement(questionDataObj).style.display = "none";
};

/**
 * Called by the injection loader when the qualtrics "onReady" event fires.
 * @param {QuestionData} questionDataObj 
 * @param {object} rawGraphObj a {@link GraphDataObject}-like object
 */
export async function onReady(questionDataObj, rawGraphObj) {
  // process into a `GraphDataObject`
  let graphObj = GraphDataObject.fromObject(rawGraphObj);

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

  /**
   * Wrapper around `port.postMessage`, passing a {@link Message} object.
   * @param {typeof MessageType} type 
   * @param {*} [data]
   */
  function postMessage(type, data = undefined) {
    port.postMessage(new Message(type, data));
  }

  graphIframe.addEventListener("load", () => {
    // setup channel listener
    port.onmessage = (e) => {
      if (MESSAGE_LOGGING) console.info("[Qualtrics Injection] Message Received:", e);

      /** @type {Message} */
      let message = e.data;
      switch (message.messageType) {
        case undefined:
          console.error("Missing message type in message data structure:", e);
          break;

        case MessageType.READY:
          // check if an answer is already set
          let currentAnswer = getAnswer(questionDataObj);
          let nColumns = graphObj.chartConfig.data.datasets[0].data.length;

          // checks for `n` numbers separated by commas
          let answerRegex = new RegExp(`^\\s*(?:\\d+(?:\\.\\d+)?)(?:\\s*,\\s*\\d+(?:\\.\\d+)?){${nColumns-1}}\\s*$`);
          if (answerRegex.test(currentAnswer)) {
            // current answer is a valid answer; load it into the graph
            let values = currentAnswer.match(/(?:\d+(?:\.\d+)?)/g).map(v => parseFloat(v));
            if (values.length === nColumns) {
              console.info("Found existing Qualtrics answer:", values);
              graphObj.chartConfig.data.datasets[0].data = values;
            } else {
              console.error(
                "Found existing Qualtrics answer, but failed during parsing.",
                "Answer:", currentAnswer,
                "After Parsing:", values
              );
              alert("Failed to load user's saved graph values: check the console logs (f12) for more info. Loading the question's original graph values instead.")
            }
          }

          // send graph object to be loaded
          postMessage(MessageType.SET_GRAPH, graphObj);
          break;

        case MessageType.SET_ANS:
          let ans = message.messageData;
          setAnswer(questionDataObj, ans);
          enableSubmit(questionDataObj);
          break;

        case MessageType.SET_INVALID:
          // bad graph state; disable submission
          disableSubmit(questionDataObj);
          break;
        
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
