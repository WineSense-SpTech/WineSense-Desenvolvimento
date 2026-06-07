let idUsuarioServer = sessionStorage.idUsuario;
let cargoUsuarioServer = sessionStorage.cargoUsuario;
let empresaUsuarioServer = sessionStorage.empresaUsuario;
let grupoUsuarioServer = sessionStorage.grupoUsuario;

if (idUsuarioServer == undefined) {
  window.location.href = "../homeWineSense/index.html";
}

if (cargoUsuarioServer !== "adm") {
  localStorage.setItem("empresaSelecionada", empresaUsuarioServer);

  btnUnidades.disabled = true;
  btnUnidades.style.opacity = "0.4";
  btnUnidades.style.cursor = "not-allowed";
  btnUnidades.title = "Acesso restrito à sua unidade";
}

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

console.log("Unidade Selecionada", unidadeSelecionada);

function inicializarDashboard() {
  console.log("dadosDashboard:", sessionStorage.getItem("dadosDashboard"));
  console.log("unidadeSelecionada:", sessionStorage.getItem("unidadeSelecionada"),);
  console.log("empresaUsuario:", sessionStorage.getItem("empresaUsuario"));
  console.log("grupoUsuario:", sessionStorage.getItem("grupoUsuario"));

  // Pega a string guardada no Selecionar Unidade
  let dadosString = sessionStorage.dadosDashboard;
  console.log(`Dados da dashboard:\n${dadosString}`);

  if (!dadosString) {
    console.error("Dados não encontrados na sessão. Buscando na API...");
    // Se o usuário entrou direto na URL sem passar pelo Selecionar Unidade, faz o fetch:
    fetch(`/unidades/carunidades/${grupoUsuarioServer}/${empresaUsuarioServer}`)
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.setItem("dadosDashboard", JSON.stringify(data));
        processarDadosDashboard(data);
      })
      .catch((err) => console.error("Erro no fetch de fallback", err));
    return;
  }

  // Transforma o texto em objeto de volta
  let data = JSON.parse(dadosString);
  processarDadosDashboard(data);
}

function processarDadosDashboard(data) {
  console.log("unidadeSelecionada:", unidadeSelecionada);
  console.log("data:", data);

  const unidadeObj = data.find((u) => u.unidade === unidadeSelecionada);

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
}

// Inicia a tela
inicializarDashboard();

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

  // KPI de horario com maior variação
  fetch(`/unidades/maior-variacao-tempo/${tanque.id}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Erro do servidor: status ${res.status}`);
      if (res.status === 204) return []; 
      return res.json();
    })
    .then((data) => {
      if (data.length > 0) {
        document.getElementById("horarioVar").innerText = data[0].horario + "h";
      } else {
        document.getElementById("horarioVar").innerText = "--h";
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar KPI de variação:", err);
      document.getElementById("horarioVar").innerText = "--h";
    });

    
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
  // document.getElementById("horarioVar").innerText =
  //   tanque.metricas.horarioVar + `h` + `m`;

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
  // const horario = tanque.metricas.horarioVar;

  // Se existir, mostra direto
  // Se não existir, mostra "--" (fallback)
  
  // document.getElementById("horarioVar").innerText = horario || "--";

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

  atualizarGrafico(tanque.id, tanque.temperatura.valores, chartLinha)
}

//Botão de voltar a seleção de unidades
function voltarUnidade() {
  // Remove o tanque selecionado
  localStorage.removeItem("tanqueId");

  // Redireciona para tela de unidades
  window.location.href = "selecionarUnidade.html";
}

function sair() {
  sessionStorage.clear();
  localStorage.clear();

  window.location.href = "../homeWineSense/index.html";
}

var proximaAtualizacao;

function atualizarGrafico(idTanque, dados, myChart) {
  // Se ja existir tanque atualizando, da clear na atualização dele
  if (proximaAtualizacao != undefined) {
    clearTimeout(proximaAtualizacao);
  }

  console.log('Esse é o id do tanque: ', idTanque);

  fetch(`/unidades/novovalor/${idTanque}`, { cache: "no-store" })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (novoRegistro) {
          // alertar(novoRegistro, idAquario);
          console.log(`Dados recebidos: ${JSON.stringify(novoRegistro)}`);
          console.log(`Dados atuais do gráfico:`);
          console.log(dados);

          if (
            novoRegistro[0].valor ==
            dados[dados.length - 1]
          ) {
            console.log(
              "---------------------------------------------------------------",
            );
            console.log(
              "Como não há dados novos para captura, o gráfico não atualizará.",
            );
            console.log("Horário do novo dado capturado:");
            console.log(novoRegistro[0].valor);
            console.log("Horário do último dado capturado:");
            console.log(dados[dados.length - 1]);
            console.log(
              "---------------------------------------------------------------",
            );
          } else {
            // tirando e colocando valores no gráfico
            dados.shift(); // apagar o primeiro
            dados.push(novoRegistro[0].valor); // incluir um novo momento

            console.log("Atualizado com sucesso");

            // dados.datasets[0].data.shift(); // apagar o primeiro de umidade
            // dados.datasets[0].data.push(novoRegistro[0].umidade); // incluir uma nova medida de umidade

            // dados.datasets[1].data.shift(); // apagar o primeiro de temperatura
            // dados.datasets[1].data.push(novoRegistro[0].temperatura); // incluir uma nova medida de temperatura

            myChart.update();
          }

          // Altere aqui o valor em ms se quiser que o gráfico atualize mais rápido ou mais devagar
          proximaAtualizacao = setTimeout(
            () => atualizarGrafico(idTanque, dados, myChart),
            10000,
          );
        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
        // Altere aqui o valor em ms se quiser que o gráfico atualize mais rápido ou mais devagar
        proximaAtualizacao = setTimeout(
          () => atualizarGrafico(idTanque, dados, myChart),
          10000,
        );
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
    });
}
