import { GraphRestriction } from "./GraphRestriction.mjs";


// Intellisense for Chart.js's `ChartConfiguration` type.
// Based on https://github.com/chartjs/Chart.js/blob/master/types/index.d.ts

/**
 * @typedef {Object} ChartConfig
 * @property {TType} type
 * @property {ChartData} data
 * @property {ChartOptions=} options
 * @property {Plugin[]=} plugins
 */

/**
 * @typedef {Object} ChartData
 * @property {TLabel[]=} labels
 * @property {ChartDataset[]=} datasets
 */

/**
 * An object describing all information about a graph that either interface
 * (the admin interface or the participant interface) might store.
 * Primarily intended for passing graph information from the admin interface
 * to the participant interface.
 *
 * @class GraphDataObject
 */
export class GraphDataObject {
  /**
   * Creates an instance of a GraphDataObject.
   * 
   * @param {ChartConfig} chartConfig the config object passed to [Chart.js](https://www.chartjs.org/docs/latest/) to construct the graph.
   * @param {Array<GraphRestriction>=} restrictions an array of validity restrictions on the graph. An empty array means there are no restrictions.
   * @param {number | undefined} totalSum the total sum value to restrict user input to (or undefined if not restricted)
   * @memberof GraphDataObject
   */
  constructor(chartConfig, restrictions, totalSum) {
    /**
     * A Chart.js [ChartConfiguration](https://www.chartjs.org/docs/latest/api/interfaces/ChartConfiguration.html)
     * object. For examples and more details see the [Chart.js docs](https://www.chartjs.org/docs/latest/).
     * 
     * @type {ChartConfig}
     */
    this.chartConfig = chartConfig;

    /**
     * An object describing restrictions and/or requirements on the graph
     * for it to be 'valid'. e.g. 'strictly increasing'.
     * 
     * @type {Array<GraphRestriction>}
     */
    this.restrictions = restrictions;

    /**
     * @type {number | undefined}
     */
    this.totalSum = totalSum;
  }

  /**
   * @param {object} obj 
   * @param {ChartConfig} obj.chartConfig 
   * @param {Array<GraphRestriction>} obj.restrictions 
   * @param {number | undefined} obj.totalSum 
   */
   static fromObject(obj) {
    if (obj === undefined || obj === null) return undefined;
    return new GraphDataObject(
      obj.chartConfig,
      (obj.restrictions ?? []).flatMap(restriction => {
        let restrictionObj = GraphRestriction.fromObject(restriction);

        if (restrictionObj === undefined) {
          console.error("Invalid restriction being excluded:", restriction);
          return [];
        }

        return [restrictionObj];
      }),
      Number.isFinite(parseFloat(obj.totalSum)) ? parseFloat(obj.totalSum) : undefined
    );
  }
}
