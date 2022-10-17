export class GraphRestriction {
  /**
   * @param {string} rule a string representation of the restriction rule
   * \- expected to have already been validated using {@link GraphRestriction.validateRule}
   * @param {string} errorMessage the message to display to the user if the rule is not satisfied
   */
  constructor(rule, errorMessage) {
    // TODO: proper jsdoc for the object properties, rather than just type
    
    /** @type {string} */
    this.rule = rule ?? "";

    /** @type {string} */
    this.errorMessage = errorMessage ?? "";
  }

  /**
   * @param {string} rule 
   * @returns {boolean}
   */
  static validateRule(rule) {
    // check the rule is defined
    if (rule === undefined || rule === null) return false;

    // check the rule is a string, but not empty
    if (typeof rule !== "string") return false;
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
    /**
     * Used by restrictions; returns the array of column values
     * @returns {Array<number>}
     */
    function colArr() { return [...graphValueArr]; }

    /**
     * Used by restrictions; fetches the value for a given column
     * @param {number} n 
     */
    function col(n) {
      let columnNumber = parseInt(n);
      if (!Number.isInteger(columnNumber)) {
        throw new Error(`Column Number (${JSON.stringify(n)}) is not a valid number (processed to: ${columnNumber})`);
      }

      let columnIndex = columnNumber - 1;
      if (columnIndex >= colArr().length || columnIndex < 0) {
        throw new Error(`Column Number (${columnNumber}) out of range (expected between 1 and ${colArr().length})`);
      }

      return colArr()[columnIndex] ?? NaN;
    }

    // evaluate the expression (=> its validity)
    let validity = Boolean(eval(this.rule));
    return validity;
  }
}
