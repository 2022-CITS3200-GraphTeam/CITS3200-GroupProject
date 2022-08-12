Qualtrics.SurveyEngine.addOnload(function() {
	let input = document.querySelector(`#QID2 > div.Inner.BorderColor.SL > div > fieldset > div > div > input`);
	input.style.display = "none";
});
Qualtrics.SurveyEngine.addOnReady(function() {
	let input = document.querySelector(`#QID2 > div.Inner.BorderColor.SL > div > fieldset > div > div > input`);
	input.value = prompt("Dynamically set answer");
});
