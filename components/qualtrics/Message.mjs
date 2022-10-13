export const MessageType = {
  INIT: "INIT",
  READY: "READY",

  /**
   * qualtrics -> participant interface
   * 
   * Requests the participant interface loads the (GraphDataObject) data as the graph
   */
  SET_GRAPH: "SET_GRAPH",

  /**
   * participant interface -> qualtrics
   * 
   * Request the qualtrics answer be set to the (string) data
   */
  SET_ANS: "SET_ANS",

  /**
   * participant interface -> qualtrics
   * 
   * Indicates the participant interface has an invalid answer;
   * requests that qualtrics e.g. disables the "next" button
   */
  SET_INVALID: "SET_INVALID"
};

export class Message {
  /**
   * @param {typeof MessageType} type 
   * @param {*} data 
   */
  constructor(type, data) {
    this.messageType = type;
    this.messageData = data;
  }
}
