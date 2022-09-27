export const MessageType = {
  INIT: "INIT",
  READY: "READY",

  SET_ANS: "SET_ANS",
  /** @todo not yet implemented */
  SUBMIT_ANS: "SUBMIT_ANS"
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
