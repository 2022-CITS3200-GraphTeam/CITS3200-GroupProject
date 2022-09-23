import { handleInjectionMessage, setAnswer } from "./iframe_coms.mjs";

// handle messages from the Qualtrics injection
window.addEventListener("message", handleInjectionMessage);

// temp
document.getElementById("submitButton").addEventListener("click", () => {
  setAnswer("test");
});
