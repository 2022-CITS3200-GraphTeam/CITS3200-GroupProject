import { handleInjectionMessage, setAnswer } from "./iframe_coms.mjs";

// handle messages from the Qualtrics injection
window.addEventListener("message", handleInjectionMessage);

// submit the answer on button press
document.getElementById("submitButton").addEventListener("click", () => {
  let answerStr = getAnswerStr(); // defined in `participant_interface.js`
  setAnswer(answerStr);
});
