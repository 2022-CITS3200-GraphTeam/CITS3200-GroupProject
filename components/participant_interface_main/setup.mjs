import { updateInteger } from "./graph_handlers.mjs";
import { handleInjectionMessage } from "./iframe_coms.mjs";

// handle messages from the Qualtrics injection
window.addEventListener("message", handleInjectionMessage);

document.getElementById("sectionName").addEventListener("input", updateInteger);
