// ? currently injecting everything that is needed; should some of it be loaded from github pages?
// advantages of loading: smaller payload, easier to separate out and organise code, less jank
// disadvantages: - changing the hosted code will break old surveys
//                - potential security vulnerability, but the user is already copying in the code from the website and other stuff is loaded from CDNs so probably fine?


export function getInjectionTemplate() {
  return (() => {
    function getAnswerContainer(questionDataObj) { return questionDataObj.getChoiceContainer(); }
    function getAnswerElement(questionDataObj) { return getAnswerContainer(questionDataObj).querySelector("textarea"); }

    function setAnswer(questionDataObj, answerStr) {
      let el = getAnswerElement(questionDataObj);
      el.value = answerStr;
    }

    function disableSubmit(questionDataObj) { questionDataObj.disableNextButton(); }
    function enableSubmit(questionDataObj) { questionDataObj.enableNextButton(); }


    // hide answer text box
    Qualtrics.SurveyEngine.addOnload(function() {
      getAnswerElement(this).style.display = "none";
    });

    Qualtrics.SurveyEngine.addOnReady(function() {
      setAnswer(this, alert("Question answer:")); // ! TEMP

      // add iframe
      let graph = document.createElement("iframe");
      graph.srcdoc = `${srcdoc}`;
      graph.style = "width: 100%; height: 450px;"; // ! TEMP

      getAnswerContainer(this).appendChild(graph);
    });
  });
}
