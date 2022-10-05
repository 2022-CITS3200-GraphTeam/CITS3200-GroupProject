import { GraphDataObject } from "../graph_data_types/GraphDataObject.mjs";

/**
 * TODO: set return value to the ChartJS graph object
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
    graphChart.data.datasets[0].data[index] = document.getElementById("integerValue").value;
    graphChart.update();
  };

  // TODO: process `graphObj.restrictions` (see issue #8, or child issues of it)
  // returns true iff all restrictions are satisfied
  function verifyRestrictions(override) {
    let graphValues = getGraphValues();
    for (let [i, v] of Object.entries(override)) graphValues[i] = v; // override updated values, if required
    return graphObj.restrictions.every(restriction => restriction.isValid(graphValues));
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
      const index = firstPoint.index;
      const value = graphChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

      document.getElementById("sectionName").value = index;
      document.getElementById("integerValue").value = value;
    }
  }
  ctx.onclick = clickHandler;

  // update the inputs when a column is dragged
  function dragHandler(datasetIndex, index, value) {
    const roundedValue = Math.round(value * 100) / 100;

    let changedValues = { [index]: roundedValue };

    if (graphObj.maintainSum) {
      // handle totalSum i.e. reduce other columns by the required amount
      let currentValues = getGraphValues();
      // TODO: deal with rounded value not being 0.01
      let mod = -(roundedValue - currentValues[index]) / (currentValues.length - 1);
      for (let i = 0; i < currentValues.length; i++) {
        if (i === index) continue;
        changedValues[i] = currentValues[i] + mod;
      }
    }

    // cancel interaction if it violates a restriction
    if (!verifyRestrictions(changedValues)) {
      return false;
    }

    if (graphObj.maintainSum) {
      // update other columns
      for (let i in changedValues) {
        if (i === index) continue;
        graphChart.data.datasets[0].data[i] = changedValues[i];
      }

      graphChart.update();
    }

    document.getElementById("sectionName").value = index;
    document.getElementById("integerValue").value = roundedValue;
  }

  // update the graph when the column input value is changed
  document.getElementById("integerValue").addEventListener("input", () => {
    // get graph section name and new value
    const sectionIndex = document.getElementById("sectionName").value;
    const sectionValue = document.getElementById("integerValue").value;

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
  let selectElement = document.getElementById("sectionName");
  graphChart.data.labels.forEach((option, i) => {
    let optionElement = new Option(option, i);
    selectElement.appendChild(optionElement);
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

/**
 * Returns a string representation of the chart output; the answer to give to Qualtrics.
 * Outputs the graph values as a single-row CSV (delimited by commas)
 * @returns {string}
 */
export function getAnswerStr() {
  return getGraphValues().join(",");
}
