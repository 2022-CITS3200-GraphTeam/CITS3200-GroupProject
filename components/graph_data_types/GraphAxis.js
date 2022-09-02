import { StyledElement } from "./StyledElement.js";

// TODO: class jsdoc
export class GraphAxis extends StyledElement {
  // TODO: constructor jsdoc
  constructor(name) {
    /**
     * The name of the axis - intended to be displayed on the graph.
     * e.g. a line graph showing population over time might have a
     * vertical axis named "population", and a horizontal axis named
     * "time".
     * 
     * @type {String}
     */
    this.name = name;
  }
};
