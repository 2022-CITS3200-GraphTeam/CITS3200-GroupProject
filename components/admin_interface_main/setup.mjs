import { generateCode, outputGeneratedCode } from "./participant_interface_generator.mjs";

document.getElementById("submitButton").addEventListener("click", async () => {
  await outputGeneratedCode(await generateCode());
});
