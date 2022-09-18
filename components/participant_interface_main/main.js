function deleteRow(row, dd) {
    var i = row.parentNode.parentNode.rowIndex;
    console.log(dd)
    document.getElementById(dd).deleteRow(i);
  }
  
  function insRow(dd) {
    console.log('hi');
    var x = document.getElementById(dd);
    var new_row = x.rows[1].cloneNode(true);
    var len = x.rows.length;
    new_row.cells[0].innerHTML = len;
  
    var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
    inp1.id += len;
    inp1.value = '';
    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
    inp2.id += len;
    inp2.value = '';
    x.appendChild(new_row);
  }
  
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
  
    // render init block
    const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );
  }
  