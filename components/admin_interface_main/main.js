function makeColRowHTML(n) {
  return `
<td><input class="nameInput" oninput="updateGraph()" value="Column ${n}" size=20 type="text"></td>
<td><input class="valueInput" onchange="roundToStepSize(); updateMinValues(); updateMaxValues(); updateGraph();" oninput="updateGraph()" value="${(Math.min(new Decimal(n).times(getStepSize()).add(getScaleMin()), getScaleMax()))}" min="${getScaleMin()}" max="${getScaleMax()}" type="number"></td>
<td><input class="colourInput" id="colourInput" type="color" oninput="updateGraph()" value="#0072D0"></td>
<td><input class="deleteButton" type="button" value="Delete" onclick="deleteRow(this, 'colTable');updateGraph()"></td>
`;
}


function minErrorMessage() {
  if (getStepSize() != 0 && new Decimal(getScaleMin()).modulo(getStepSize()) != 0) {
    document.getElementById("errorTextMin").style.display = "block";
  } else {
    document.getElementById("errorTextMin").style.display = "none";
  }
}

function maxErrorMessage() {
  if (getStepSize() != 0 && new Decimal(getScaleMax()).minus(getScaleMin()).modulo(getStepSize()) != 0) {
    document.getElementById("errorTextMax").style.display = "block";
  } else {
    document.getElementById("errorTextMax").style.display = "none";
  }
}

function makeRuleRowHTML(n) {
  return `
<td><input class="ruleInput" value="" size=20 type="text"></td>
<td><input class="deleteButton" type="button" value="Delete" onclick="deleteRow(this, 'rulesInput')"></td>
`;
}
// <td><input class="errorInput" value="" size=30 type="text"></td>

let myChart;

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

function getColour() {
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
  if (testScaleMin === "") testScaleMin = document.getElementById("scaleMin").placeholder;
  return toStepSizeDP(testScaleMin);
}
function getScaleMax() {
  var testScaleMax = document.getElementById("scaleMax").value;
  if (testScaleMax === "") testScaleMax = document.getElementById("scaleMax").placeholder;
  return toStepSizeDP(testScaleMax);
}
function getScaleIncrement() {
  var testScaleIncrement = document.getElementById("scaleIncrement").value;
  if (testScaleIncrement === "") return undefined;
  return toStepSizeDP(testScaleIncrement);
}
function getEnforceStepSize() {
  return document.getElementById("roundToStepSizeButton").checked;
}
function getStepSize() {
  var stepSize = document.getElementById('stepSize').value;
  if (stepSize === "") stepSize = document.getElementById('stepSize').placeholder;
  return stepSize;
}
function toStepSizeDP(value) {
  return new Decimal(value).toDecimalPlaces(new Decimal(getStepSize()).dp()).toNumber();
}
function roundValueToStepSize(value) {
  value = new Decimal(value);
  let increment = getStepSize();

  // the closest multiple of `increment` to `value`, not necessarily within `min` and `max`
  let rounded = toStepSizeDP(value.div(increment).round().mul(increment));

  if (rounded > getScaleMax()) return getScaleMax();
  if (rounded < getScaleMin()) return getScaleMin();

  return rounded;
}
function generateGraph() {
  // start with 3 table columns
  for (let i = 0; i < 3; i++) addColRow("colTable");

  // start with 1 (empty) rule
  addRuleRow('rulesInput');

  let graphData = {
    labels: getColNames(),
    datasets: [{
      data: getColValues(),
      backgroundColor: getColour(),
      borderColor: getColour(),
      borderWidth: 1,
      dragData: true,
      minBarLength: 4
    }]
  };

  // config 
  let graphConfig = {
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
          round: 0,
          onDrag: (event, datasetIndex, index, value) => dragHandler(datasetIndex, index, value),
          onDragEnd: (event, datasetIndex, index, value) => dragHandler(datasetIndex, index, value)
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: ""
          },
          min: 0,
          max: 100,
          ticks: {
            stepSize: 10
          }
        },
        x: {
          title: {
            display: true,
            text: ""
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

function updateGraph(updateChart = true) {
  myChart.data.labels = getColNames();
  myChart.data.datasets[0].data = getColValues();
  myChart.config._config.options.plugins.title.text = getTitle();
  myChart.config._config.options.scales.y.title.text = getYTitle();
  myChart.config._config.options.scales.x.title.text = getXTitle();
  myChart.config._config.options.scales.y.min = getScaleMin();
  myChart.config._config.options.scales.y.max = getScaleMax();
  myChart.config._config.options.scales.y.ticks.stepSize = getScaleIncrement();
  myChart.options.plugins.dragData.round = Math.log10(1 / getStepSize());

  myChart.data.datasets[0].backgroundColor = getColour();
  myChart.data.datasets[0].borderColor = getColour();

  // update sum display
  let graphValues = myChart.data.datasets[0].data.map(v => parseFloat(v));
  let graphValueSum = graphValues.reduce((r, v) => r + v, 0);
  var decimals = new Decimal(getStepSize()).dp();
  document.getElementById("currentSum").innerHTML = new Decimal(graphValueSum).toDecimalPlaces(decimals);

  if (updateChart) {
    myChart.update();
  }
  var values = document.getElementsByClassName("valueInput");
  updateStepSize([
    ...values,
    document.getElementById("scaleMax"),
    document.getElementById("scaleMin")
  ]);
  //for each value automatically updates the values and rounds them if the checkbox is ticked.
}

//Updates the minimum values and changes the value if it is less then the new minimum
function updateMinValues() {
  var values = [
    ...document.getElementsByClassName("valueInput"),
    document.getElementById("scaleMax")
  ];
  for (var x in values) {
    values[x].min = getScaleMin();
    if (values[x].value < getScaleMin()) {
      values[x].value = roundValueToStepSize(getScaleMin());
    }
  }
}

//Updates the maximum values and changes the value if it is more then the new maximum
function updateMaxValues() {
  let max = getScaleMax();
  let values = document.getElementsByClassName('valueInput');
  for (let input of values) {
    input.max = max;
    if (input.value > max) input.value = roundValueToStepSize(max);
  }
}

//Updates the step size for all the value boxes so the first click on the up arrow will 
//use the new correct step size
function updateStepSize(values) {
  for (let value of values) {
    value.step = getStepSize();
  }
}

function dragHandler(datasetIndex, index, value) {
  const name = myChart.data.labels[index];
  document.getElementsByClassName("valueInput")[index].value = value.toFixed(getDecimalPlaces(getStepSize()));
  updateGraph(false);
}

// returns the ChartJS graph obj
function getChartObj() {
  return myChart.config._config;
}

function returnTutorial() {
  return document.getElementById('saveTutorial');
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("helpButton");

var parModal = document.getElementById("participantModal");
var parModalbtn = document.getElementById("parModalButton");

window.onerror = function (e) {
  alert(e);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  else if (event.target == parModal) {
    parModal.style.display = "none"
  }
}

function openModal(modalName) {
  var modal = document.getElementById(modalName)
  modal.style.display = "block";
}

function closeModal(modalName) {
  var modal = document.getElementById(modalName)
  modal.style.display = "none";
}


function roundToStepSize() {
  if (getStepSize() != 0) {
    var values = document.getElementsByClassName('valueInput');
    length = values.length;
    for (let step = 0; step < length; step++) {
      if (getEnforceStepSize() && new Decimal(values[step].value).modulo(getStepSize()) != 0) {
        values[step].value = parseFloat(values[step].value)
        values[step].value = roundValueToStepSize(values[step].value)
      }
    }
  }
}

function getDecimalPlaces(number) {
  var char_array = number.toString().split(""); // split every single char
  var not_decimal = char_array.lastIndexOf(".");
  return (not_decimal < 0) ? 0 : char_array.length - (not_decimal + 1);
}

document.getElementById("addRuleButton").addEventListener("click", () => document.getElementById("submitButton").scrollIntoView());
document.getElementById("addColButton").addEventListener("click", () => document.getElementById("submitButton").scrollIntoView());
