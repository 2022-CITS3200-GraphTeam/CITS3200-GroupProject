export class GraphRestriction {
  /**
   * @param {string} rule a string representation of the restriction rule
   * \- expected to have already been validated using {@link GraphRestriction.validateRule}
   * @param {string} errorMessage the message to display to the user if the rule is not satisfied
   */
  constructor(rule, errorMessage) {
    // TODO: proper jsdoc for the object properties, rather than just type
    
    /** @type {string} */
    this.rule = rule;

    /** @type {string} */
    this.errorMessage = errorMessage;
  }

  /**
   * @param {string} rule 
   * @returns {boolean}
   */
  static validateRule(rule) {
    // check the rule is defined
    if (rule === undefined || rule === null) return false;

    // check the rule isn't empty
    if (rule === "") return false;

    return true;
  }

  /**
   * @param {object} restrictionObj 
   * @param {string} restrictionObj.rule 
   * @param {string} restrictionObj.errorMessage 
   */
  static fromObject(restrictionObj) {
    if (restrictionObj === undefined || restrictionObj === null) return undefined;

    // check the rule is valid
    if (!GraphRestriction.validateRule(restrictionObj.rule)) return undefined;

    return new GraphRestriction(restrictionObj.rule, restrictionObj.errorMessage);
  }

  /**
   * Evaluates the constraint with the given graph data.
   * @param {Array<number>} graphValueArr
   * @returns {boolean} true iff the constraint is respected (not violated)
   */
  isValid(graphValueArr) {
    // replace columns (of the form "[COLUMN_NUMBER]") with their values
    let expStr = this.rule.replace(/\[(\d+)\]/g, (_, columnNumber) => {
      let columnIndex = columnNumber - 1;
      if (columnIndex >= graphValueArr.length) throw new Error(`Column Number (${columnNumber}) out of range (expected between 0 and ${graphValueArr.length - 1})`);
      return graphValueArr[columnIndex] ?? NaN;
    });

    // evaluate the expression (=> its validity)
    // ! `Function` (eval) should be replaced with maths expression evaluation
    let validity = Boolean(Function(`return (${expStr})`)());
    return validity;
  }
}
