import { StyledElement } from "./StyledElement.js";

/**
 * A 'point' of a graph; what a 'point' represents depends on the type of the
 * graph. E.g. a 'point' could be a bar on a bar graph, a slice of a pie graph,
 * or a point on a line graph.
 *
 * @export
 * @class GraphPoint
 * @extends {StyledElement}
 */
export class GraphPoint extends StyledElement {
  // TODO: constructor jsdoc
  constructor(value) {
    /**
     * A number representing the "value" or "size" of the point.
     * Defaults to `0` if given an invalid number.
     * 
     * @type {number}
     */
    this.value = value;
    if (!Number.isFinite(this.value)) {
      // ? should we use some custom error handling that e.g. also prompts the user ?
      console.warn(`Expected number, found '${value}'. Defaulting to '0'.`);
      this.value = 0;
    }

    // TODO
  }

  // TODO: getters and setters (?)
};
