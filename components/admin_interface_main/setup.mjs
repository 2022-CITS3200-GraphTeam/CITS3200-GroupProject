import { outputGeneratedCode } from "./participant_interface_generator.mjs";

document.getElementById("submitButton").addEventListener("click", async () => {
  let code = "/** Blah **/";
  await outputGeneratedCode(code);
});
