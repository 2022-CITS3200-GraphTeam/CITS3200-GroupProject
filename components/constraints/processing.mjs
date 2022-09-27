/**
 * Evaluates the constraint with the given graph data.
 * @param {string} constraintStr 
 * @param {Array<number>} graphValueArr
 * @returns {boolean} true iff the constraint is not violated
 */
export function isValid(constraintStr, graphValueArr) {
  // replace columns (of the form "[COLUMN_NUMBER]") with their values
  let expStr = constraintStr.replace(/\[(\d+)\]/g, (_, columnNumber) => {
    let columnIndex = columnNumber - 1;
    if (columnIndex >= graphValueArr.length) throw new Error(`Column Number (${columnNumber}) out of range (expected between 0 and ${graphValueArr.length - 1})`);
    return graphValueArr[columnIndex] ?? NaN;
  });

  // evaluate the expression (=> its validity)
  let validity = Boolean(eval(expStr)); // ! MUST REPLACE
  return validity;
}
