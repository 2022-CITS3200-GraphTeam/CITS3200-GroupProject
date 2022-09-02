import { GraphPoint } from "./GraphPoint.js";
import { StyledElement } from "./StyledElement.js";

/**
 * An object describing all information about a graph that either interface
 * (the admin interface or the participant interface) might store.
 * Primarily intended for passing graph information from the admin interface
 * to the participant interface.
 * 
 * TODO: add getters and setters (?)
 *
 * @export
 * @class GraphDataObject
 * @extends {StyledElement}
 */
export class GraphDataObject extends StyledElement {
  // TODO: constructor jsdoc
  constructor() {
    /**
     * A list of 'points' of the graph; what a 'point' represents depends on
     * the type of the graph. E.g. a 'point' could be a bar on a bar graph,
     * a slice of a pie graph, or a point on a line graph.
     * 
     * @type {Array<GraphPoint>}
     */
    this.points = [];

    // TODO
  }
};

// ! TEMP: for intellisense testing purposes
let a = new GraphDataObject();
