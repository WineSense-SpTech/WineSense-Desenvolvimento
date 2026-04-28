const container = document.getElementById("carrossel");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

let tanques = [];
let indexAtual = 0;
const itensPorPagina = 6;

let chartLinha = null;
let chartBarra = null;


const tanqueId = localStorage.getItem("tanqueId");


fetch("tanques.js")
  .then(res => {
    if (!res.ok) {
      throw new Error("Erro ao carregar JSON");
    }
    return res.json();
  })
  .then(data => {
    tanques = data;

    renderizarCarrossel();

    let tanque;

    if (!tanqueId) {
      tanque = tanques[0];
    } else {
      tanque = tanques.find(t => t.id == tanqueId);
    }

    if (!tanque) {
      console.error("Tanque não encontrado");
      return;
    }

    carregarDashboard(tanque);
  })
  .catch(err => {
    console.error("ERRO:", err);
  });


function renderizarCarrossel() {
  container.innerHTML = "";

  const slice = tanques.slice(indexAtual, indexAtual + itensPorPagina);

  slice.forEach(tanque => {
    const div = document.createElement("div");
    div.className = "card_tanque";

    div.innerHTML = `
      <button class="tanque">
        <h3>Tanque ${tanque.id}</h3>
        <p class="${tanque.classe}">${tanque.status}</p>
      </button>
    `;

    div.onclick = () => {
      localStorage.setItem("tanqueId", tanque.id);
      carregarDashboard(tanque);
    };

    container.appendChild(div);
  });
}


btnNext.onclick = () => {
  if (indexAtual + itensPorPagina < tanques.length) {
    indexAtual += itensPorPagina;
    renderizarCarrossel();
  }
};

btnPrev.onclick = () => {
  if (indexAtual - itensPorPagina >= 0) {
    indexAtual -= itensPorPagina;
    renderizarCarrossel();
  }
};



function carregarDashboard(tanque) {

  const data_medicao = document.getElementById("data_medicao");

  data_medicao.innerText = tanque.data_medicao;

  const titulo = document.getElementById("tituloTanque");

  titulo.innerText = `Tanque ${tanque.id} - ${tanque.unidade}`;
  titulo.className = `titulo_tanque ${tanque.classe}`;

  document.getElementById("tempoIdeal").innerText =
    tanque.metricas.tempoIdeal + "%";

  document.getElementById("alertasSemana").innerText =
    tanque.metricas.alertasSemana;

  document.getElementById("varMinMax").innerText =
    tanque.metricas.varMin + "°C - " + tanque.metricas.varMax + "°C";

  if (chartLinha) chartLinha.destroy();

  chartLinha = new Chart(document.getElementById("linha"), {
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

  if (chartBarra) chartBarra.destroy();

  chartBarra = new Chart(document.getElementById("barra"), {
    type: "bar",
    data: {
      labels: tanque.alertas.labels,
      datasets: [
        {
          label: "Urgente",
          data: tanque.alertas.urgente,
          backgroundColor: "#5a1f35",
          borderRadius: "6"
        },
        {
          label: "Atenção",
          data: tanque.alertas.atencao,
          backgroundColor: "#b07a8d",
          borderRadius: "6"
        }
      ]
    }
  });

}