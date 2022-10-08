import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { Message, MessageType } from "../qualtrics/Message.mjs";
import { getAnswerStr, loadGraph } from "./graph_handlers.mjs";

const hostVerificationRegex = /^https:\/\/(?:(.+)\.)?qualtrics.com$/;

/** @type {MessagePort} */
let port;

/**
 * @param {MessageEvent} e 
 */
export function handleInjectionMessage(e) {
  // check the event is from Qualtrics
  if (!hostVerificationRegex.test(e.origin)) {
    console.warn(`Ignoring request from non-qualtrics origin "${e.origin}"`);
    return false;
  }

  /** @type {Message} */
  let message = e.data;
  switch (message.messageType) {
    case undefined:
      console.error("Missing message type in message data structure:", e);
      break;

    case MessageType.INIT:
      handlePortInitRequest(e);
      break;
    
    default:
      console.warn(`Ignoring unrecognised message type ("${e.data}")`);
      break;
  }
}

/**
 * Send a message to the Qualtrics injection instructing it to set the answer to the given string.
 * @param {string} str 
 */
export function setAnswer(str) {
  port.postMessage(new Message(MessageType.SET_ANS, str));
}

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
  port.postMessage(new Message(MessageType.READY));
}

/**
 * @param {MessageEvent} e 
 */
function handleGraphLoadRequest(e) {
  let graphObj = GraphDataObject.fromObject(e.data);

  if (!graphObj) {
    console.error("bad graph load request:", graphObj);
    return;
  }

  console.log("load request for:", graphObj);
  loadGraph(graphObj); // defined in `participant_interface.js`
}
