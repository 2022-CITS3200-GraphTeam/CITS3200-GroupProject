/**
 * @param {QuestionData} questionDataObj 
 * @returns {HTMLDivElement}
 */
export function getAnswerContainer(questionDataObj) { return questionDataObj.getChoiceContainer(); }

/**
 * @param {QuestionData} questionDataObj 
 * @returns {HTMLInputElement}
 */
export function getAnswerElement(questionDataObj) { return getAnswerContainer(questionDataObj).querySelector("input"); }

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
 * @returns {string}
 */
export function getAnswer(questionDataObj) {
  let el = getAnswerElement(questionDataObj);
  return el.value;
}

/**
 * @param {QuestionData} questionDataObj 
 */
export function disableSubmit(questionDataObj) { questionDataObj.disableNextButton(); }

/**
 * @param {QuestionData} questionDataObj 
 */
export function enableSubmit(questionDataObj) { questionDataObj.enableNextButton(); }
