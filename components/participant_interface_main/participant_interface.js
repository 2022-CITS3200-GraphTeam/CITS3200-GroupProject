// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("helpButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}
window.onerror = function (e) {
    alert(e);
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
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
  document.getElementById("mainSidebar").style.marginLeft= "0";

}
function updateSection(){
//On update click > Grab integer value from input box > update data value in graph
const sectionValue = document.getElementById("sectionName").value;
const sectionName = document.getElementById("integerValue").value;
console.log(myChart.data.labels[1]);
const sectionIndex = data.labels.indexOf(sectionName);
data.datasets.data[sectionIndex] = sectionValue;
}

//Initial attempt at understanding how to update values - high level idea experimenting
//myChart.data.labels[index] =  sectionName;
//myChart.data.datasets[datasetIndex].data[index] =  sectionValue;

function generateGraph() {
  const data = {
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
  };

  // config 
  const config = {
    type: 'bar',
    data,
    options: {
      plugins: {
        dragData: {
          onDragStart: (event) => {
            console.log(event)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  //pintpointing the chart, so that the click understands the canvs tag
  const ctx = document.getElementById('myChart');
  // render init block
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );

  //Function that understands the clicking event - testing how to properly use this
  function clickHandler(click){
      const points = myChart.getElementsAtEventForMode(click, 'nearest', 
          { intersect: true }, true);

      if (points.length){
          const firstPoint = points[0];
          const value = myChart.data.datasets[firstPoint.datasetIndex].
              data[firstPoint.index];
          const name = myChart.data.labels[firstPoint.index];

          console.log(data.labels)
          document.getElementById("sectionName").value = name;
          document.getElementById("integerValue").value = value;
      }
  }
  ctx.onclick = clickHandler;
}


