const tanqueId = localStorage.getItem("tanqueId");

fetch("tanques.js")
  .then(res => {
    console.log("STATUS:", res.status);

    if (!res.ok) {
      throw new Error("Erro ao carregar JSON");
    }

    return res.json();
  })
  .then(data => {
    console.log("DADOS:", data);

    let tanque;

    if (!tanqueId) {
      console.warn("Nenhum tanque selecionado, usando o primeiro");
      tanque = data[0];
    } else {
      tanque = data.find(t => t.id == tanqueId);
    }

    if (!tanque) {
      console.error("Tanque não encontrado");
      return;
    }

    carregarDashboard(tanque);
  })
  .catch(err => {
    console.error("ERRO REAL:", err);
  });


function carregarDashboard(tanque) {

  document.getElementById("tempoIdeal").innerText =
    tanque.metricas.tempoIdeal + "%";

  document.getElementById("alertasSemana").innerText =
    tanque.metricas.alertasSemana;

  document.getElementById("desvioPadrao").innerText =
    tanque.metricas.desvioPadrao + "°C";


  new Chart(document.getElementById("linha"), {
    type: "line",
    data: {
      labels: tanque.temperatura.labels,
      datasets: [{
        label: "Temperatura",
        data: tanque.temperatura.valores,
        borderColor: "#7a2f4b",
        fill: false
      }]
    }
  });


  new Chart(document.getElementById("barra"), {
    type: "bar",
    data: {
      labels: tanque.alertas.labels,
      datasets: [
        {
          label: "Urgente",
          data: tanque.alertas.urgente,
          backgroundColor: "#5a1f35"
        },
        {
          label: "Atenção",
          data: tanque.alertas.atencao,
          backgroundColor: "#b07a8d"
        },
        {
          label: "Regular",
          data: tanque.alertas.regular,
          backgroundColor: "#d23c6b"
        }
      ]
    }
  });

}