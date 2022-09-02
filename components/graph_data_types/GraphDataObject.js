import { GraphRestriction } from './GraphRestriction.js'

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
 * @export
 * @class GraphDataObject
 */
export class GraphDataObject {
  /**
   * Creates an instance of a GraphDataObject.
   * 
   * @param {ChartConfig} chartConfig the config object passed to [Chart.js](https://www.chartjs.org/docs/latest/) to construct the graph.
   * @param {Array<GraphRestriction>=} restrictions an array of validity restrictions on the graph. An empty array means there are no restrictions.
   * @memberof GraphDataObject
   */
  constructor(chartConfig, restrictions = []) {
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
     * Currently unused.
     * TODO: determine structure of restrictions
     * 
     * @type {Array<GraphRestriction>}
     */
    this.restrictions = restrictions;
  }
};
