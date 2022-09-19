  
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
          //console.log(firstPoint);
          const value = myChart.data.datasets[firstPoint.datasetIndex].
              data[firstPoint.index];
          console.log(value);

          //Still to add correct reference to bar data structure - gotta think about 
          //location.href = dataStructureReference;
          //window.open(dataStructureReference);
      }
  }
  ctx.onclick = clickHandler;
}
