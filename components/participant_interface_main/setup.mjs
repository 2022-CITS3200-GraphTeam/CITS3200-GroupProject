import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { INIT_MESSAGE, READY_MESSAGE } from "../qualtrics/consts.mjs";

const hostVerificationRegex = /^https:\/\/(?:(.+)\.)?qualtrics.com$/;

let port;

window.addEventListener("message", (e) => {
  // check the event is from Qualtrics
  if (!hostVerificationRegex.test(e.origin)) {
    console.info(`Ignoring request from non-qualtrics origin "${e.origin}"`);
    return false;
  }

  switch (e.data) {
    case INIT_MESSAGE:
      handlePortInitRequest(e);
      break;
    
    default:
      console.warn(`Ignoring unrecognised message type ("${e.data}")`);
      break;
  }
});

/**
 * @param {MessageEvent} e 
 */
function handlePortInitRequest(e) {
  // prevent re-init (?)
  // if (port !== undefined) return false;

  // setup port
  port = e.ports[0];
  port.onmessage = handleGraphLoadRequest;

  // send "ready" response to qualtrics
  port.postMessage(READY_MESSAGE);
}

/**
 * @param {MessageEvent} e 
 */
function handleGraphLoadRequest(e) {
  /** @type {GraphDataObject} */
  let graphObj = e.data;

  // ! TODO call participant interface load graph func
  console.log("load request for:", graphObj);
}
