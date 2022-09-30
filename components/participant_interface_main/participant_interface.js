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

//Function that updates graph value based on integer value
function updateSection() {
  const sectionValue = document.getElementById("integerValue").value;
  const sectionName = document.getElementById("sectionName").value;
  const sectionIndex = graphChart.data.labels.indexOf(sectionName);
  graphChart.data.datasets[0].data[sectionIndex] = sectionValue;
  graphChart.update();
}


//Function on Section name selection updates the integer value box

function updateInteger() {
  const select = document.getElementById("sectionName");
  const sectionOption = select.options[select.selectedIndex].value;
  const sectionIndex = graphChart.data.labels.indexOf(sectionOption);
  document.getElementById("integerValue").value = graphChart.data.datasets[0].data[sectionIndex];
}


// ! TEMP - exists to load the graph for testing; should be removed when the qualtrics injection calls the graph generation
function generateGraphPreset() {
  let chartjsObj = {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Weekly Sales',
        data: [18, 12, 6, 9, 12, 3, 9],
        backgroundColor: [
          'rgba(255, 26, 104, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(0, 0, 0, 0.2)'
        ],
        borderColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(0, 0, 0, 1)'
        ],
        borderWidth: 1,
        dragData: true,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  loadGraph(chartjsObj);
}

/** */
=======
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
  graphObj.options.plugins.dragData.onDragEnd = (event, datasetIndex, index, value) => {
    dragHandler(datasetIndex, index, value);
    graphChart.data.datasets[0].data[index] = Math.round(value*100)/100;
    graphChart.update();
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
    document.getElementById("integerValue").value = Math.round(value*100)/100;
  }
  
  //Function that populates the Section Name options with labels from the Graph
  function popOptions(){
    graphChart.data.labels.forEach(function(option){
      var allOptions = document.getElementById("sectionName");
      var option = new Option(option, option);
      allOptions.appendChild(option);
    });
  };
  popOptions();

  //Set the Default integer value to the first Data value
  document.getElementById("integerValue").defaultValue = graphChart.data.datasets[0].data[0];
};
 
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
