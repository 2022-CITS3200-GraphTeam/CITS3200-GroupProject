import { getAnswerStr } from "./graph_handlers.mjs";
import { handleInjectionMessage, setAnswer } from "./iframe_coms.mjs";

// handle messages from the Qualtrics injection
window.addEventListener("message", handleInjectionMessage);

// submit the answer on button press
document.getElementById("submitButton").addEventListener("click", () => {
  let answerStr = getAnswerStr();
  setAnswer(answerStr);
});
