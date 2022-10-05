// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("helpButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

let myChart;

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

/* Side Bar Scripts */
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


// Function that updates the integer value box based on the section name
function updateInteger() {
  const select = document.getElementById("sectionName");
  document.getElementById("integerValue").value = graphChart.data.datasets[0].data[select.value];
}
