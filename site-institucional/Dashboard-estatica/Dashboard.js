const container = document.getElementById("carrossel");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

let tanques = [];
let indexAtual = 0;
const itensPorPagina = 6;

let chartLinha = null;
let chartBarra = null;

const tanqueId = localStorage.getItem("tanqueId");
const unidadeSelecionada = localStorage.getItem("unidadeSelecionada");


fetch("tanques.json")
  .then(res => {
    if (!res.ok) throw new Error("Erro ao carregar JSON");
    return res.json();
  })
  .then(data => {

    const unidadeObj = data.find(u => u.unidade === unidadeSelecionada);

    if (!unidadeObj) {
      console.error("Unidade não encontrada");
      return;
    }

    tanques = unidadeObj.tanques;

    if (tanques.length === 0) {
      console.error("Nenhum tanque encontrado para essa unidade");
      return;
    }

    renderizarCarrossel();
    carregarDashboardInicial();
  })
  .catch(err => console.error("ERRO:", err));

function ordenarTanques(lista) {
  const prioridade = {
    "Crítico": 1,
    "Atenção": 2,
    "Regular": 3
  };

  return lista.sort((a, b) => prioridade[a.status] - prioridade[b.status]);
}

function renderizarCarrossel() {
container.innerHTML = "";

const tanquesOrdenados = ordenarTanques([...tanques]);

const slice = tanquesOrdenados.slice(indexAtual, indexAtual + itensPorPagina);

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


function carregarDashboardInicial() {
  let tanque;

  if (!tanqueId) {
    tanque = tanques[0];
  } else {
    tanque = tanques.find(t => t.id == tanqueId) || tanques[0];
  }

  carregarDashboard(tanque);
}

  

function carregarDashboard(tanque) {

  
  document.getElementById("data_medicao").innerText =
    tanque.data_medicao || "--";

  const titulo = document.getElementById("tituloTanque");
  
  titulo.innerText =
    `Unidade: ${unidadeSelecionada} | Tanque ${tanque.id}`;

  titulo.className = `titulo_tanque ${tanque.classe}`;


  document.getElementById("horarioVar").innerText =
    tanque.metricas.horarioVar + `h` + `m`;

  document.getElementById("alertasSemana").innerText =
    tanque.metricas.alertasSemana;

  document.getElementById("varMinMax").innerText =
    `${tanque.metricas.varMin}°C - ${tanque.metricas.varMax}°C`;


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

  const totalMinutos = tanque.metricas.horarioVar;
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  const horaFormatada = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

  document.getElementById("horarioVar").innerText = horaFormatada;

  titulo.className = `titulo_tanque ${tanque.classe}`;
  document.getElementById("tipoUva").innerText = `Uva: ${tanque.Uva ? tanque.Uva : "Não informada"}`;


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
          borderRadius: 6
        },
        {
          label: "Atenção",
          data: tanque.alertas.atencao,
          backgroundColor: "#b07a8d",
          borderRadius: 6
        }
      ]
    }
  });

}

function voltarUnidade() {
  localStorage.removeItem("tanqueId");
  window.location.href = "selecionarUnidade.html";
}