import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";
import { MESSAGE_LOGGING } from "../qualtrics/consts.mjs";
import { Message, MessageType } from "../qualtrics/Message.mjs";
import { loadGraph } from "./graph_handlers.mjs";

const hostVerificationRegex = /^https:\/\/(?:(.+)\.)?qualtrics.com$/;

/** @type {MessagePort} */
let port;

/**
 * Wrapper around `port.postMessage`, passing a {@link Message} object.
 * @param {typeof MessageType} type 
 * @param {*} [data]
 */
function postMessage(type, data = undefined) {
  port.postMessage(new Message(type, data));
}

/**
 * @param {MessageEvent} e 
 */
export function handleInjectionMessage(e) {
  // check the event is from Qualtrics
  if (!hostVerificationRegex.test(e.origin)) {
    console.warn(`Ignoring request from non-qualtrics origin "${e.origin}"`);
    return false;
  }

  if (MESSAGE_LOGGING) console.info("[Participant Interface Loader] Message Received:", e);

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
 * Sends a message to the Qualtrics injection instructing it to set the current answer to the given
 * string and consider it as a valid response (e.g. enabling the submission button).
 * @param {string} str 
 */
export function setAnswer(str) {
  postMessage(MessageType.SET_ANS, str);
}

/**
 * Sends a message to the Qualtrics injection instructing it to consider the current graph answer
 * as invalid (e.g. disable the submission button).
 */
export function setAnswerInvalid() {
  postMessage(MessageType.SET_INVALID);
}

/**
 * @param {MessageEvent} e 
 */
function handlePortInitRequest(e) {
  // prevent re-init (?)
  // if (port !== undefined) return false;

  // setup port
  port = e.ports[0];
  port.onmessage = handleRequest;

  // send "ready" response to qualtrics
  postMessage(MessageType.READY);
}

/**
 * @param {MessageEvent} e 
 */
function handleRequest(e) {
  if (MESSAGE_LOGGING) console.info("[Participant Interface] Message Received:", e);

  /** @type {Message} */
  let message = e.data;
  switch (message.messageType) {
    case undefined:
      console.error("Missing message type in message data structure:", e);
      break;

    case MessageType.SET_GRAPH:
      // load the graph
      let graphObj = GraphDataObject.fromObject(message.messageData);

      if (!graphObj) {
        console.error("bad graph load request:", graphObj);
        return;
      }

      console.log("load request for:", graphObj);
      loadGraph(graphObj);
      break;
    
    default:
      console.warn(`Ignoring unrecognised message type ("${e.data}")`);
      break;
  }
}
