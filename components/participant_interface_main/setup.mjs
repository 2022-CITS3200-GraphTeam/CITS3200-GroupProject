import { handleInjectionMessage, setAnswer } from "./iframe_coms.mjs";

// handle messages from the Qualtrics injection
window.addEventListener("message", handleInjectionMessage);
