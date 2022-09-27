// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("helpButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

let graphChart;

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}
window.onerror = function (e) {
  alert(e);
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/*Side Bar Scripts */
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("mySidebar").style.padding = "8px 8px 8px 32px";
  document.getElementById("mainSidebar").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("mySidebar").style.padding = "0px 0px 0px 0px";
  document.getElementById("mainSidebar").style.marginLeft = "0";

}
function updateSection() {
  //On update click > Grab integer value from input box > update data value in graph
  const sectionValue = document.getElementById("integerValue").value;
  const sectionName = document.getElementById("sectionName").value;
  const sectionIndex = graphChart.data.labels.indexOf(sectionName);
  graphChart.data.datasets[0].data[sectionIndex] = sectionValue;
  graphChart.update();
}

/**
 * @param {GraphDataObject} graphObj
 * * note: this file is not a js module, so the GraphDataObject type can't be imported
 */
function loadGraph(graphObj) {
  // create the `graphObj.chartConfig.options.plugins.dragData` object,
  // if it doesn't already exist in the graph settings
  graphObj.chartConfig.options = graphObj.chartConfig.options ?? {};
  graphObj.chartConfig.options.plugins = graphObj.chartConfig.options.plugins ?? {};
  graphObj.chartConfig.options.plugins.dragData = graphObj.chartConfig.options.plugins.dragData ?? {};

  // update the input when a drag occurs
  graphObj.chartConfig.options.plugins.dragData.onDrag = (event, datasetIndex, index, value) => {
    dragHandler(datasetIndex, index, value)
  };

  // TODO: process `graphObj.restrictions` (see issue #8, or child issues of it)

  // pintpointing the chart, so that the click understands the canvas tag
  const ctx = document.getElementById('myChart');

  // create the (ChartJS) chart object
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

  // Function that understands the clicking event - testing how to properly use this
  function dragHandler(datasetIndex, index, value) {
    const name = graphChart.data.labels[index];

    document.getElementById("sectionName").value = name;
    document.getElementById("integerValue").value = value;
  }
}

// currently outputs in a CSV format: firs
/**
 * Returns a string representation of the chart output; the answer to give to Qualtrics.
 * The output is in a CSV format: the first row is the label names, and the second the values.
 * @returns {string}
 */
function getAnswerStr() {
  // encodes the label to a CSV-compatible value
  let graphLabels = [...graphChart.data.labels].map(label => {
    // replace quotes with double quotes
    label = label.replace(/"/g, `""`);

    // encapsulate with quotes
    label = `"${label}"`;

    return label;
  });

  // encodes the (string) values from the graph as floats
  let graphData = [...graphChart.data.datasets[0].data].map(value => parseFloat(value));

  // returns the labels and values as a CSV
  return graphLabels.join(",") + "\n" + graphData.join(",");
}
