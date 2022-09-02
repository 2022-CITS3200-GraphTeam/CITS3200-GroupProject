import { StyledElement } from "./StyledElement";

// TODO: class jsdoc
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
