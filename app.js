const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const Chart = require('chart.js');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  const db = new sqlite3.Database('/home/waldo/Downloads/PROYECTO/sensores/base.bd');

  const queryPromedioPh = "SELECT id_sensor, AVG(ph) AS promedio_ph FROM DatosSensor GROUP BY id_sensor";
  db.all(queryPromedioPh, (err, rowsPh) => {
    if (err) {
      console.error(err.message);
    } else {
      const promediosPh = rowsPh.map(row => ({
        id_sensor: row.id_sensor,
        promedio_ph: row.promedio_ph.toFixed(2)
      }));

      const queryPromedioAcidez = "SELECT id_sensor, AVG(acidez) AS promedio_acidez FROM DatosSensor GROUP BY id_sensor";
      db.all(queryPromedioAcidez, (err, rowsAcidez) => {
        if (err) {
          console.error(err.message);
        } else {
          const promediosAcidez = rowsAcidez.map(row => ({
            id_sensor: row.id_sensor,
            promedio_acidez: row.promedio_acidez.toFixed(2)
          }));

          // Generar gráficas con Chart.js
          const phChartLabels = promediosPh.map(data => `Sensor ${data.id_sensor}`);
          const phChartValues = promediosPh.map(data => data.promedio_ph);

          const acidezChartLabels = promediosAcidez.map(data => `Sensor ${data.id_sensor}`);
          const acidezChartValues = promediosAcidez.map(data => data.promedio_acidez);

          const phChartConfig = {
            type: 'pie',
            data: {
              labels: phChartLabels,
              datasets: [{
                label: 'Promedio de pH',
                data: phChartValues,
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(153, 102, 255, 0.5)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true
            }
          };

          const acidezChartConfig = {
            type: 'bar',
            data: {
              labels: acidezChartLabels,
              datasets: [{
                label: 'Promedio de Acidez',
                data: acidezChartValues,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          };

          const phChartCanvas = `<canvas id="graficoPh"></canvas>`;
          const acidezChartCanvas = `<canvas id="graficoAcidez"></canvas>`;

          const phChartScript = `
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
              var ctx = document.getElementById('graficoPh').getContext('2d');
              new Chart(ctx, ${JSON.stringify(phChartConfig)});
            </script>
          `;

          const acidezChartScript = `
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
              var ctx = document.getElementById('graficoAcidez').getContext('2d');
              new Chart(ctx, ${JSON.stringify(acidezChartConfig)});
            </script>
          `;

          // Generar página HTML con los gráficos
          const html = `
          <html>
  <head>
    <title>Dashboard de Sensores</title>
    <style>
      /* Estilos Tailwind CSS */
      .bg-gray-200 {
        background-color: #edf2f7;
      }
      
      .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
      }
      
      .mt-8 {
        margin-top: 2rem;
      }
      
      /* Resto de tus estilos Tailwind CSS */
    </style>
  </head>
  <body class="bg-gray-200">
    <div class=" p-4">
      <h1 class="text-4xl text-white">Promedio de pH por Sensor</h1>
    </div>
    
    ${phChartCanvas}
    ${phChartScript}

    <h1 class="mt-8 text-4xl">Promedio de Acidez por Sensor</h1>
    ${acidezChartCanvas}
    ${acidezChartScript}
  </body>
</html>

        
          `;

          res.send(html);
        }

        db.close();
      });
    }
  });
});

app.listen(port, () => {
  console.log(`El servidor está en funcionamiento en http://localhost:${port}`);
});