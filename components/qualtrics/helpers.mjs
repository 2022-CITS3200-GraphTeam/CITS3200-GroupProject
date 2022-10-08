/**
 * @param {QuestionData} questionDataObj 
 * @returns {HTMLDivElement}
 */
 export function getAnswerContainer(questionDataObj) { return questionDataObj.getChoiceContainer(); }

 /**
  * @param {QuestionData} questionDataObj 
  * @returns {HTMLTextAreaElement}
  */
 export function getAnswerElement(questionDataObj) { return getAnswerContainer(questionDataObj).querySelector("textarea"); }
 
 /**
  * @param {QuestionData} questionDataObj 
  * @param {string} answerStr 
  */
 export function setAnswer(questionDataObj, answerStr) {
   let el = getAnswerElement(questionDataObj);
   el.value = answerStr;
 }
 
 /**
  * @param {QuestionData} questionDataObj 
  */
 export function disableSubmit(questionDataObj) { questionDataObj.disableNextButton(); }
 
 /**
  * @param {QuestionData} questionDataObj 
  */
 export function enableSubmit(questionDataObj) { questionDataObj.enableNextButton(); }
