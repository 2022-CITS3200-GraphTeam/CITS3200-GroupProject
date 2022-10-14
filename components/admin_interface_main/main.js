function makeColRowHTML(n) {
  return `
<td><input class="nameInput" oninput="updateGraph()" value="Column ${n}" size=20 type="text"></td>
<td><input class="valueInput" onchange="roundToStepSize(this)" oninput="updateGraph()" value="${n}" min="0" size=10 type="number" step="getStepSize()"></td>
<td><input class="colourInput" id="colourInput" type="color" oninput="updateGraph()" value="#0072D0"></td>
<td><input class="deleteButton" type="button" value="Delete" onclick="deleteRow(this, 'colTable');updateGraph()"></td>
`;
}

function minErrorMessage(){
  if(getScaleMin() % getStepSize() != 0){
    document.getElementById("errorText").style.display = "block";
  }
  else{
    document.getElementById("errorText").style.display = "none";
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
function getStepSize(){
  var stepSize = document.getElementById('stepSize').value;
  return stepSize;
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

function updateGraph() {
  myChart.data.labels = getColNames();
  myChart.data.datasets[0].data = getColValues();
  myChart.config._config.options.plugins.title.text = getTitle();
  myChart.config._config.options.scales.y.title.text = getYTitle();
  myChart.config._config.options.scales.x.title.text = getXTitle();
  myChart.config._config.options.scales.y.min = getScaleMin();
  myChart.config._config.options.scales.y.max = getScaleMax();
  myChart.config._config.options.scales.y.ticks.stepSize = getScaleIncrement();
  myChart.options.plugins.dragData.round = Math.log10(1/getStepSize());

  myChart.data.datasets[0].backgroundColor = getColour();
  myChart.data.datasets[0].borderColor = getColour();

  // update sum display
  let graphValues = myChart.data.datasets[0].data.map(v => parseFloat(v));
  let graphValueSum = graphValues.reduce((r, v) => r + v, 0);
  document.getElementById("currentSum").innerHTML = graphValueSum;

  myChart.update();
  var values = document.getElementsByClassName('valueInput'); 
  updateStepSize(values);
  updateMinValues(values);
  //for each value automatically updates the values and rounds them if the checkbox is ticked.
  if(document.getElementById("roundToStepSizeButton").checked && values[x].value % getStepSize()){
    for(var x in values){
      roundToStepSize(values[x]);
    }
  }
}
//Updates the minimum values and changes the value if it is less then the new minimum
function updateMinValues(values){
  for(var x in values){
    if(values[x].value < getScaleMin()){
      values[x].value = getScaleMin();
    }
    }
    values[x].min = getScaleMin();
}
//Updates the step size for all the value boxes so the first click on the up arrow will 
//use the new correct step size
function updateStepSize(values){
  for (var x in values){
    values[x].step = getStepSize();
  }
}

function dragHandler(datasetIndex, index, value) {
  const name = myChart.data.labels[index];
  if(value>3.3){
    var x = getDecimalPlaces(getStepSize());
  }
  document.getElementsByClassName("valueInput")[index].value = value.toFixed(getDecimalPlaces(getStepSize()));
  updateGraph();
}

// returns the ChartJS graph obj
function getChartObj() {
  return myChart.config._config;
}

function returnTutorial(){
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
  else if (event.target == parModal){
    parModal.style.display = "none"
  }
}

function openModal(modalName){
  var modal = document.getElementById(modalName)
  modal.style.display = "block";
}

function closeModal(modalName){
  var modal = document.getElementById(modalName)
  modal.style.display = "none";
}


function roundToStepSize(column){
  column.step = getStepSize();
  if(document.getElementById("roundToStepSizeButton").checked){
    column.value = Math.round(column.value / getStepSize()) * getStepSize();
  }
}
function getDecimalPlaces(number)
{
  var char_array = number.toString().split(""); // split every single char
  var not_decimal = char_array.lastIndexOf(".");
  return (not_decimal<0)?0:char_array.length - (not_decimal + 1);
}

document.getElementById("addRuleButton").addEventListener("click", () => document.getElementById("submitButton").scrollIntoView());
document.getElementById("addColButton").addEventListener("click", () => document.getElementById("submitButton").scrollIntoView());
