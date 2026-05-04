// Container onde os tanques (cards) vão aparecer
const container = document.getElementById("carrossel");

// Botões de navegação do carrossel (pra frente e pra tras)
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

// Lista que vai armazenar todos os tanques da unidade selecionada
let tanques = [];

// Índice atual do carrossel (controle de paginação, de 6 em 6 tanques)
let indexAtual = 0;
const itensPorPagina = 6;

// Variáveis para armazenar os gráficos (começam null para evitar duplicação)
let chartLinha = null;
let chartBarra = null;

// Id do tanque selecionado na pagina de unidades
const tanqueId = localStorage.getItem("tanqueId");

// Nome da unidade escolhida (São Paulo, Campinas, etc)
const unidadeSelecionada = localStorage.getItem("unidadeSelecionada");

fetch("tanques.json") // Faz requisição para pegar o JSON (puxa os dados do JSON)
  .then((res) => {
    // Verifica se a resposta deu certo (status 200)
    if (!res.ok) throw new Error("Erro ao carregar JSON");

    // Converte resposta para JSON
    return res.json();
  })
  .then((data) => {
    // Procura dentro do JSON a unidade escolhida pelo usuário
    const unidadeObj = data.find((u) => u.unidade === unidadeSelecionada);

    // Se não encontrar a unidade exibe o erro
    if (!unidadeObj) {
      console.error("Unidade não encontrada");
      return;
    }

    // Pega os tanques daquela unidade e adiciona na lista dos tanques
    tanques = unidadeObj.tanques;

    // Se não houver tanques na unidade
    if (tanques.length === 0) {
      console.error("Nenhum tanque encontrado para essa unidade");
      return;
    }

    // Renderiza os cards do carrossel para a seleção de tanques
    renderizarCarrossel();

    // Carrega os dados iniciais da dashboard (Como status, unidade, uva utilizada, etc.)
    carregarDashboardInicial();
  })
  .catch((err) => console.error("ERRO:", err));

function ordenarTanques(lista) {
  // Define prioridade dos status
  const prioridade = {
    Crítico: 1,
    Atenção: 2,
    Regular: 3,
  };

  // Ordena baseado na prioridade
  return lista.sort((a, b) => prioridade[a.status] - prioridade[b.status]);
}

function renderizarCarrossel() {
  // Limpa o conteúdo atual
  container.innerHTML = "";

  // Cria uma cópia dos tanques e ordena por prioridade
  const tanquesOrdenados = ordenarTanques([...tanques]);

  // Pega apenas os tanques da "página atual"
  const slice = tanquesOrdenados.slice(indexAtual, indexAtual + itensPorPagina);

  // Para cada tanque
  slice.forEach((tanque) => {
    // Cria uma div para o card
    const div = document.createElement("div");
    div.className = "card_tanque";

    // Conteúdo do card (HTML dinâmico)
    div.innerHTML = `
<button class="tanque">
<h3>Tanque ${tanque.id}</h3>
<p class="${tanque.classe}">${tanque.status}</p>
</button>
`;

    // Evento de clique no tanque
    div.onclick = () => {
      // Salva o tanque selecionado no navegador
      localStorage.setItem("tanqueId", tanque.id);

      // Atualiza a dashboard com os dados desse tanque
      carregarDashboard(tanque);
    };

    // Adiciona o card no container com as métricas vindas do JSON
    container.appendChild(div);
  });
}

// Botão próximo
btnNext.onclick = () => {
  // Verifica se ainda há itens à frente
  if (indexAtual + itensPorPagina < tanques.length) {
    // Avança a "página"
    indexAtual += itensPorPagina;

    // Renderizar outra vez para garantir que esteja exibindo os tanques certos
    renderizarCarrossel();
  }
};

// Botão anterior
btnPrev.onclick = () => {
  // Verifica se pode voltar
  if (indexAtual - itensPorPagina >= 0) {
    // Volta a "página"
    indexAtual -= itensPorPagina;

    // Renderizar outra vez para garantir que esteja exibindo so tanques certos
    renderizarCarrossel();
  }
};

// Serve para pegar o primeiro tanque ao selecionar uma unidade (tanques[0])
function carregarDashboardInicial() {
  let tanque;

  // Se nenhum tanque foi selecionado antes
  if (!tanqueId) {
    tanque = tanques[0]; // pega o primeiro
  } else {
    // Procura o tanque salvo ou usa o primeiro
    tanque = tanques.find((t) => t.id == tanqueId) || tanques[0];
  }

  // Carrega os dados
  carregarDashboard(tanque);
}

function carregarDashboard(tanque) {
  // Data da medição
  document.getElementById("data_medicao").innerText =
    tanque.data_medicao || "--";

  // Título do Tanque (id/número do tanque)
  const titulo = document.getElementById("tituloTanque");

  // Unidade Selecionada
  titulo.innerText = `Unidade: ${unidadeSelecionada} | Tanque ${tanque.id}`;

  // Aplica classe de cor (critico, alerta, etc)
  titulo.className = `titulo_tanque ${tanque.classe}`;

  // Métricas de "Horário médio com maior variação de temperatura na última semana", "Alertas nos Últimos 5 dias" e "Variação de Temperatura do Último Dia (24h)"
  document.getElementById("horarioVar").innerText =
    tanque.metricas.horarioVar + `h` + `m`;

  document.getElementById("alertasSemana").innerText =
    tanque.metricas.alertasSemana;

  document.getElementById("varMinMax").innerText =
    `${tanque.metricas.varMin}°C - ${tanque.metricas.varMax}°C`;

  // Destroi gráfico antigo (evita duplicação)
  if (chartLinha) chartLinha.destroy();


  const tempMax = tanque.temperatura.temp_max[0];
  const tempMin = tanque.temperatura.temp_min[0];
  const totalLabels = tanque.temperatura.labels.length;

  // Cria novo gráfico de linhas
  chartLinha = new Chart(document.getElementById("linha"), {
  type: "line",
  data: {
    labels: tanque.temperatura.labels,
    datasets: [
      {
        label: "Temperatura",
        data: tanque.temperatura.valores,
        borderColor: "#7a2f4b",
        fill: false,
      },
      {
        label: "Limite Superior",
        data: new Array(totalLabels).fill(tempMax),
        borderColor: "#22c55e",
        borderDash: [6, 3],   
        borderWidth: 2,
        pointRadius: 0,        
        fill: false,
      },
      {
        label: "Limite Inferior",
        data: new Array(totalLabels).fill(tempMin),
        borderColor: "#16a34a",
        borderDash: [6, 3],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  },
});
  // Pega o horário já formatado do JSON
  const horario = tanque.metricas.horarioVar;

  // Se existir, mostra direto
  // Se não existir, mostra "--" (fallback)
  document.getElementById("horarioVar").innerText = horario || "--";

  // Uva usada para fazer o vinho daquele tanque
  document.getElementById("tipoUva").innerText =
    `Uva: ${tanque.Uva ? tanque.Uva : "Não informada"}`;

  // Destroi gráfico antigo (evita duplicação)
  if (chartBarra) chartBarra.destroy();

  // Cria novo gráfico de barras
  chartBarra = new Chart(document.getElementById("barra"), {
    type: "bar",
    data: {
      labels: tanque.alertas.labels,
      datasets: [
        {
          label: "Urgente",
          data: tanque.alertas.urgente,
          backgroundColor: "#5a1f35",
          borderRadius: 6,
        },
        {
          label: "Atenção",
          data: tanque.alertas.atencao,
          backgroundColor: "#b07a8d",
          borderRadius: 6,
        },
      ],
    },
  });
}

//Botão de voltar a seleção de unidades
function voltarUnidade() {
  // Remove o tanque selecionado
  localStorage.removeItem("tanqueId");

  // Redireciona para tela de unidades
  window.location.href = "selecionarUnidade.html";
}
