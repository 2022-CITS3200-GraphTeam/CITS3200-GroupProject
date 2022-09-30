import { isValid } from "../constraints/processing.mjs";
import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";

/**
 * TODO: set return value to the chartjs graph object
 * @param {GraphDataObject} graphObj
 */
export function loadGraph(graphObj) {
  // create the `graphObj.chartConfig.options.plugins.dragData` object,
  // if it doesn't already exist in the graph settings
  graphObj.chartConfig.options = graphObj.chartConfig.options ?? {};
  graphObj.chartConfig.options.plugins = graphObj.chartConfig.options.plugins ?? {};
  graphObj.chartConfig.options.plugins.dragData = graphObj.chartConfig.options.plugins.dragData ?? {};

  // update the input when a drag occurs
  graphObj.chartConfig.options.plugins.dragData.onDrag = (event, datasetIndex, index, value) => {
    return dragHandler(datasetIndex, index, value);
  };

  // round the value after drag is complete
  graphObj.chartConfig.options.plugins.dragData.onDragEnd = (event, datasetIndex, index, value) => {
    // update the input box, based on (rounded) graph values
    dragHandler(datasetIndex, index, value);

    // update the graph, based on the (rounded) input box
    graphChart.update();
  };

  // TODO: process `graphObj.restrictions` (see issue #8, or child issues of it)
  // returns true iff all restrictions are satisfied
  function verifyRestrictions(override) {
    let graphValues = getGraphValues();
    for (let [i, v] of Object.entries(override)) graphValues[i] = v; // override updated values, if required
    return graphObj.restrictions.every(restriction => isValid(restriction, graphValues));
  }

  // pintpointing the chart, so that the click understands the canvas tag
  const ctx = document.getElementById('myChart');

  // create the (ChartJS) chart object
  // ! graphChart is defined in `participant_interface.js`
  graphChart = new Chart(ctx, graphObj.chartConfig);

  // Function that understands the clicking event - testing how to properly use this
  function clickHandler(click) {
    const points = graphChart.getElementsAtEventForMode(click, 'nearest', { intersect: true }, true);

    if (points.length) {
      const firstPoint = points[0];
      const value = graphChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
      const name = graphChart.data.labels[firstPoint.index];

      document.getElementById("sectionName").value = name;
      document.getElementById("integerValue").value = value;
    }
  }
  ctx.onclick = clickHandler;

  // update the inputs when a column is dragged
  function dragHandler(datasetIndex, index, value) {
    let roundedValue = Math.round(value * 100) / 100;

    // cancel interaction if it violates a restriction
    if (!verifyRestrictions({ [index]: roundedValue })) {
      return false;
    }

    const name = graphChart.data.labels[index];

    document.getElementById("sectionName").value = name;
    document.getElementById("integerValue").value = roundedValue;
  }

  // update the graph when the column input value is changed
  document.getElementById("integerValue").addEventListener("input", () => {
    // get graph section name and new value
    const sectionName = document.getElementById("sectionName").value;
    const sectionValue = document.getElementById("integerValue").value;

    // get the index of the appropriate section
    const sectionIndex = graphChart.data.labels.indexOf(sectionName);

    // * only one value can be changed at a time with this UI, so only one value being changed is a valid assumption
    // cancel interaction if it violates a restriction
    if (!verifyRestrictions({ [sectionIndex]: sectionValue })) {
      return false;
    }

    // update the graph data with the new value
    graphChart.data.datasets[0].data[sectionIndex] = sectionValue;

    // update the graph display
    graphChart.update();
  });

  // Populate the Section Name options with labels from the Graph
  graphChart.data.labels.forEach(function (option) {
    var allOptions = document.getElementById("sectionName");
    var option = new Option(option, option);
    allOptions.appendChild(option);
  });

  // Set the Default integer value to the first Data value
  updateInteger(); // ! updateInteger is defined in `participant_interface.js`
}

/**
 * @returns {Array<number>} the chart values as an array of floats
 */
export function getGraphValues() {
  return [...graphChart.data.datasets[0].data].map(value => parseFloat(value));
}

// currently outputs in a CSV format: firs
/**
 * Returns a string representation of the chart output; the answer to give to Qualtrics.
 * The output is in a CSV format: the first row is the label names, and the second the values.
 * @returns {string}
 */
export function getAnswerStr() {
  // encodes the label to a CSV-compatible value
  let graphLabels = [...graphChart.data.labels].map(label => {
    // replace quotes with double quotes
    label = label.replace(/"/g, `""`);

    // encapsulate with quotes
    label = `"${label}"`;

    return label;
  });

  let graphData = getGraphValues();

  // returns the labels and values as a CSV
  return graphLabels.join(",") + "\n" + graphData.join(",");
}
