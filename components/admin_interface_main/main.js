function makeColRowHTML(n) {
  return `
<td><input class="nameInput" oninput="updateGraph()" value="Column ${n}" size=20 type="text"></td>
<td><input class="valueInput" oninput="updateGraph()" value="${n}" size=10 type="number"></td>
<td><input class="colourInput" id="colourInput" type="color" oninput="updateGraph()" value="#0072D0"></td>
<td><input class="deleteButton" type="button" value="Delete" onclick="deleteRow(this, 'colTable');updateGraph()"></td>
`;
}

function makeRuleRowHTML(n) {
  return `
<td><input class="ruleInput" value="" size=20 type="text"></td>
<td><input class="deleteButton" type="button" value="Delete" onclick="deleteRow(this, 'rulesInput')"></td>
`;
}
// <td><input class="errorInput" value="" size=30 type="text"></td>

let graphData, graphConfig, myChart;

function deleteRow(row, dd) {
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById(dd).deleteRow(i);
}

function addColRow(dd) {
  let x = document.getElementById(dd);

  let newRow = document.createElement("tr");
  newRow.innerHTML = makeColRowHTML(x.rows.length);

  x.appendChild(newRow);
}

function addRuleRow(dd) {
  let x = document.getElementById(dd);

  let newRow = document.createElement("tr");
  newRow.innerHTML = makeRuleRowHTML(x.rows.length);

  x.appendChild(newRow);
}

function getColour(){
  let rows = [...document.getElementById("colTable").rows].slice(1);
  return rows.map(row => row.querySelector(".colourInput").value);
}

function getColNames() {
  let rows = [...document.getElementById("colTable").rows].slice(1); // excluding the header row
  return rows.map(row => row.querySelector(".nameInput").value); // converts the list of rows to a list of the names
}

function getColValues() {
  let rows = [...document.getElementById("colTable").rows].slice(1); // excluding the header row
  return rows.map(row => row.querySelector(".valueInput").value); // converts the list of rows to a list of the values
}

function getTitle() {
  var testTitle = document.getElementById("title").value;
  return testTitle;
}
function getYTitle() {
  var testYTitle = document.getElementById("yTitle").value;
  return testYTitle;
}
function getXTitle() {
  var testXTitle = document.getElementById("xTitle").value;
  return testXTitle;
}
function getScaleMin() {
  var testScaleMin = document.getElementById("scaleMin").value;
  return Math.round(testScaleMin * 100) / 100;
}
function getScaleMax() {
  var testScaleMax = document.getElementById("scaleMax").value;
  return Math.round(testScaleMax * 100) / 100;
}
function getScaleIncrement() {
  var testScaleIncrement = document.getElementById("scaleIncrement").value;
  return Math.round(testScaleIncrement * 100) / 100;
}


function generateGraph() {
  // start with 3 table columns
  for (let i = 0; i < 3; i++) addColRow("colTable");

  // start with 1 (empty) rule
  addRuleRow('rulesInput');

  graphData = {
    labels: getColNames(),
    datasets: [{
      label: 'Weekly Sales',
      data: getColValues(),
      backgroundColor: getColour(),
      borderColor: getColour(),
      borderWidth: 1,
      dragData: true,
    }]
  };

  // config 
  graphConfig = {
    type: 'bar',
    data: graphData,
    options: {
      plugins: {
        title: {
          display: true,
          text: ""
        },
        legend: {
          display: false
        },
        dragData: {
          onDrag: (event, datasetIndex, index, value) => dragHandler(datasetIndex, index, value),
          onDragEnd: (event, datasetIndex, index, value) => dragHandler(datasetIndex, index, value)
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "y"
          },
          min: 0,
          max: 20,
          ticks: {
            stepSize: 2
          }
        },
        x: {
          title: {
            display: true,
            text: "x"
          }
        }
      }
    }
  };

  // render init block
  myChart = new Chart(
    document.getElementById('myChart'),
    graphConfig
  );

  updateGraph();
}

function updateGraph() {
  myChart.data.labels = getColNames();
  myChart.data.datasets[0].data = getColValues();

  myChart.config._config.options.plugins.title.text = getTitle();
  myChart.config._config.options.scales.y.title.text = getYTitle();
  myChart.config._config.options.scales.x.title.text = getXTitle();
  myChart.config._config.options.scales.y.min = getScaleMin();
  myChart.config._config.options.scales.y.max = getScaleMax();
  myChart.config._config.options.scales.y.ticks.stepSize = getScaleIncrement();
  
  myChart.data.datasets[0].backgroundColor = getColour();
  myChart.data.datasets[0].borderColor = getColour();

  // update sum display
  let graphValues = myChart.data.datasets[0].data.map(v => parseFloat(v));
  let graphValueSum = graphValues.reduce((r, v) => r + v, 0);
  document.getElementById("currentSum").innerHTML = graphValueSum;

  myChart.update();
}

function dragHandler(datasetIndex, index, value) {
  document.getElementsByClassName("valueInput")[index].value = value;

  updateGraph();
}

// returns the ChartJS graph obj
function getChartObj() {
  return myChart.config._config;
}


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("helpButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

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
