import { GraphAxis } from "./GraphAxis.js";
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
     * A map from 'names'/values (i.e. the x axis) to 'points' of the graph.
     * 
     * @type {Map<*, GraphPoint>}
     */
    this.points = new Map();

    /**
     * TODO: proper description
     * Note: ordered list, order determined and used by inheriting types
     * 
     * @type {Array<GraphAxis>}
     */
    this.axi = [];

    // TODO
  }
};

// ! TEMP: for intellisense testing purposes
let a = new GraphDataObject();
