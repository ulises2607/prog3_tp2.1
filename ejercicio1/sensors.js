class Sensor {
  constructor(id, name, type, value, unit, updated_at) {
    const validTypes = ["temperature", "humidity", "pressure"];
    if (!validTypes.includes(type)) {
      throw new Error(
        `Tipo inválido: ${type}. Los tipos válidos son ${validTypes.join(
          ", "
        )}.`
      );
    }
    this.id = id;
    this.name = name;
    this.type = type;
    this.value = value;
    this.unit = unit;
    this.updated_at = updated_at;
  }

  updateValue(newValue) {
    this.value = newValue;
    this.updated_at = new Date().toISOString();
  }
}

class SensorManager {
  constructor() {
    this.sensors = [];
  }

  addSensor(sensor) {
    this.sensors.push(sensor);
  }

  updateSensor(id) {
    console.log("el id que llega: ", id);
    const sensor = this.sensors.find((sensor) => sensor.id === id);
    console.log("el sensor que se encuentra: ", sensor);
    if (sensor) {
      let newValue;
      console.log("el tipo del sensor: ", sensor.type);
      switch (sensor.type) {
        case "temperature": // Rango de -30 a 50 grados Celsius
          newValue = (Math.random() * 80 - 30).toFixed(2);
          sensor.updateValue(newValue);
          console.log("Temperatura actualizada a: ", newValue);
          break;
        case "humidity": // Rango de 0 a 100%
          newValue = (Math.random() * 100).toFixed(2);
          sensor.updateValue(newValue);
          console.log("Humedad actualizada a: ", newValue);
          break;
        case "pressure": // Rango de 960 a 1040 hPa (hectopascales o milibares)
          newValue = (Math.random() * 80 + 960).toFixed(2);
          sensor.updateValue(newValue);
          console.log("Presión actualizada a: ", newValue);
          break;
        default: // Valor por defecto si el tipo es desconocido
          newValue = (Math.random() * 100).toFixed(2);
          sensor.updateValue(newValue);
          console.log("Valor desconocido actualizado a: ", newValue);
      }
      this.render();
    } else {
      console.error(`Sensor ID ${id} no encontrado`);
    }
  }

  async loadSensors(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      data.forEach((sensorData) => {
        const sensor = new Sensor(
          sensorData.id,
          sensorData.name,
          sensorData.type,
          sensorData.value,
          sensorData.unit,
          sensorData.updated_at
        );
        this.addSensor(sensor);
      });
      this.render();
    } catch (error) {
      console.error(`Error al cargar los sensores: ${error.message}`);
    }
  }

  render() {
    const container = document.getElementById("sensor-container");
    container.innerHTML = "";
    this.sensors.forEach((sensor) => {
      const sensorCard = document.createElement("div");
      sensorCard.className = "column is-one-third";
      sensorCard.innerHTML = `
                  <div class="card">
                      <header class="card-header">
                          <p class="card-header-title">
                              Sensor ID: ${sensor.id}
                          </p>
                      </header>
                      <div class="card-content">
                          <div class="content">
                              <p>
                                  <strong>Tipo:</strong> ${sensor.type}
                              </p>
                              <p>
                                 <strong>Valor:</strong> 
                                 ${sensor.value} ${sensor.unit}
                              </p>
                          </div>
                          <time datetime="${sensor.updated_at}">
                              Última actualización: ${new Date(
                                sensor.updated_at
                              ).toLocaleString()}
                          </time>
                      </div>
                      <footer class="card-footer">
                          <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                          }">Actualizar</a>
                      </footer>
                  </div>
              `;
      container.appendChild(sensorCard);
    });

    const updateButtons = document.querySelectorAll(".update-button");
    updateButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(
          "clickeando el id del sensor",
          button.getAttribute("data-id")
        );
        const sensorId = parseInt(button.getAttribute("data-id"));
        this.updateSensor(sensorId);
      });
    });
  }
}

const monitor = new SensorManager();

monitor.loadSensors("sensors.json");
