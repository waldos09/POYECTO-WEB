document.addEventListener('DOMContentLoaded', function() {
    fetch('/')
      .then(response => response.json())
      .then(data => {
        var promedioPhElement = document.getElementById('promedioPh');
        promedioPhElement.textContent = data.promedio_ph;
  
        var graficoAcidezElement = document.getElementById('graficoAcidez');
        new Chart(graficoAcidezElement, {
          type: 'bar',
          data: {
            labels: ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5'],
            datasets: [{
              label: 'Promedio de Acidez',
              data: data.datos_acidez,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
  
        var graficoPromedioAcidezElement = document.getElementById('graficoPromedioAcidez');
        new Chart(graficoPromedioAcidezElement, {
          type: 'bar',
          data: {
            labels: ['Promedio de Acidez'],
            datasets: [{
              label: 'Promedio de Acidez',
              data: [data.promedio_acidez],
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
  });  