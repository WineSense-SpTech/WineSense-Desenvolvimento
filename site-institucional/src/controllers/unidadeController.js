var unidadeModel = require("../models/unidadeModel");

function carregarUnidades(req, res) {
  var grupoUsuario = req.params.grupoUsuarioPar;
  var empresaUsuario = req.params.empresaUsuarioPar;

  // Cria um objeto Date com a data de hoje e converte pro formato
  // "YYYY-MM-DD", formato que o banco de dados usa.
  var dataAtual = new Date();
  var hojeISO = dataAtual.toLocaleDateString("en-CA");

  unidadeModel
    .tanquesBase(grupoUsuario, empresaUsuario)
    .then(function (tanquesDB) {
      unidadeModel
        .registrosTemperatura(grupoUsuario, empresaUsuario)
        .then(function (registrosDB) {
          // JSON final que vai pro front.
          var respostaJSON = [];

          // Esse objeto agrupa os tanques por unidade,
          // evitando duplicar unidades na resposta.
          var agrupamentoPorUnidade = {};

          // Percorre cada tanque que veio do banco.
          tanquesDB.forEach(function (tanque) {
            // Filtra só os registros que pertencem ao sensor deste tanque.
            var todosOsRegistrosDaSemana = registrosDB.filter(
              (reg) => reg.fkSensor === tanque.fkSensor,
            );

            // Pega todas as datas que aparecem nos registros deste tanque.
            var datasRegistradas = todosOsRegistrosDaSemana.map(
              (reg) => reg.data_leitura,
            );

            // Usa a última data dos registros como "hoje" pra esse tanque.
            // Se não tiver nenhum registro, usa a data real de hoje.
            var ultimaDataStr =
              datasRegistradas.length > 0
                ? datasRegistradas[datasRegistradas.length - 1]
                : hojeISO;

            // Filtra apenas os registros da última data encontrada.
            var registrosDeHoje = todosOsRegistrosDaSemana.filter(
              (reg) => reg.data_leitura === ultimaDataStr,
            );

            // Separa os horários e os valores das leituras de hoje
            // pra montar o gráfico no front-end (eixoX = horários, eixoY = temperaturas).
            var labelsArray = registrosDeHoje.map((reg) => reg.horario);
            var valoresArray = registrosDeHoje.map((reg) => Number(reg.valor));

            // Pega a semana inteira pra calcular a variação de temperatura.
            // O Math.min e Math.max com spread percorrem o array todo de uma vez
            // pegando a maior e menor temperatura.
            // O spread (...) copia o array corretamente para a função.
            var todasAsTemperaturasDaSemana = todosOsRegistrosDaSemana.map(
              (reg) => Number(reg.valor),
            );
            var variacaoMin =
              todasAsTemperaturasDaSemana.length > 0
                ? Math.min(...todasAsTemperaturasDaSemana)
                : 0;
            var variacaoMax =
              todasAsTemperaturasDaSemana.length > 0
                ? Math.max(...todasAsTemperaturasDaSemana)
                : 0;

            // Conta quantas leituras da semana ficaram fora dos limites
            // definidos pra esse tanque (temp_min_limite e temp_max_limite).
            // Cada uma conta como um alerta.
            var alertasReaisDaSemana = 0;
            todosOsRegistrosDaSemana.forEach(function (leitura) {
              if (
                Number(leitura.valor) < tanque.temp_min_limite ||
                Number(leitura.valor) > tanque.temp_max_limite
              ) {
                alertasReaisDaSemana++;
              }
            });

            var contagemPorDia = {};
            var diasComRegistro = [];

            // Variável para rastrear quantas vezes seguidas a temperatura ficou em atenção.
            var leiturasRuinsSeguidas = 0;

            // Olha todos os registros da semana.
            for (let i = 0; i < todosOsRegistrosDaSemana.length; i++) {
              var leitura = todosOsRegistrosDaSemana[i];
              var dataAtual = leitura.data_leitura;
              var valorTemperatura = Number(leitura.valor);

              // Caso seja a primeira vez desse dia no loop, cria os objetos pra ele.
              if (!contagemPorDia[dataAtual]) {
                contagemPorDia[dataAtual] = { atencao: 0, urgente: 0 };
                diasComRegistro.push(dataAtual); // Guarda o dia na lista.
              }

              // Verifica se a temperatura está fora do limite da âncora.
              if (
                valorTemperatura < tanque.temp_min_limite ||
                valorTemperatura > tanque.temp_max_limite
              ) {
                // Caso esteja fora, aumenta o contador.
                leiturasRuinsSeguidas++;

                // Caso tenha 7 leituras seguidas...
                if (leiturasRuinsSeguidas >= 7) {
                  contagemPorDia[dataAtual].urgente++; // Conta como Urgente.
                } else {
                  contagemPorDia[dataAtual].atencao++; // Conta como Atenção.
                }
              } else {
                // Caso volte ao normal, zera o contador.
                leiturasRuinsSeguidas = 0;
              }
            }

            // Pega apenas os últimos 5 dias dessa lista.
            var ultimos5Dias = diasComRegistro.slice(-5);

            // Criando as variáveis para armazenar o valor que o status do tanque terá e a cor que ele receberá.
            let status;
            let classe;

            // Se não teve nenhum alerta na semana, o status é "Regular".
            if (alertasReaisDaSemana === 0) {
              status = "Regular";
              classe = "normal";

              // Se teve até 20 alerta na semana, o alerta terá o status "Atenção".
            } else if (alertasReaisDaSemana <= 20) {
              status = "Atenção";
              classe = "atencao yellow";

              // Se tiver mais de 20 alertas o status será "Crítico".
            } else {
              status = "Crítico";
              classe = "critico red";
            }

            // Cria os arrays que vão para o gráfico no front.
            var labelsAlertas = [];
            var urgenteArray = [];
            var atencaoArray = [];

            for (let i = 0; i < ultimos5Dias.length; i++) {
              var dataAlvo = ultimos5Dias[i];

              // Formata a data para o gráfico ("2026-06-07" > "07/06").
              var partesData = dataAlvo.split("-");
              var diaFormatado = partesData[2] + "/" + partesData[1];

              labelsAlertas.push(diaFormatado);

              // Pega a contagem e coloca no array do gráfico.
              urgenteArray.push(contagemPorDia[dataAlvo].urgente);
              atencaoArray.push(contagemPorDia[dataAlvo].atencao);
            }

            // Monta o objeto que representa um tanque na resposta.
            var objetoTanque = {
              id: tanque.id,
              status: status,
              classe: classe,

              Uva: tanque.uva_nome,

              // Converte a data de "YYYY-MM-DD" pra "DD/MM" pra exibição.
              // Exemplo: "2025-06-07" > ["2025","06","07"] > invertido > ["07","06","2025"]
              // > pega só os 2 primeiros > ["07","06"] > "07/06".
              data_medicao: ultimaDataStr
                .split("-")
                .reverse()
                .slice(0, 2)
                .join("/"),

              metricas: {
                // Horário da última leitura do dia, ou "--" se não tiver nenhuma.
                horarioVar:
                  labelsArray.length > 0
                    ? labelsArray[labelsArray.length - 1]
                    : "--",
                alertasSemana: alertasReaisDaSemana,
                varMin: variacaoMin,
                varMax: variacaoMax,
              },

              // Dados pro gráfico de linha de temperatura do dia.
              temperatura: {
                labels: labelsArray,
                valores: valoresArray,
                temp_max: [Number(tanque.temp_max_limite)],
                temp_min: [Number(tanque.temp_min_limite)],
              },

              // Dados pro gráfico de barras de alertas da semana.
              alertas: {
                labels: labelsAlertas,
                urgente: urgenteArray,
                atencao: atencaoArray,
              },
            };

            // Agrupa o tanque dentro da sua unidade.
            // Se essa unidade ainda não existe no nosso agrupamento, cria ela,
            // evitando ter a mesma unidade duplicada na resposta.
            if (!agrupamentoPorUnidade[tanque.unidade]) {
              agrupamentoPorUnidade[tanque.unidade] = {
                unidade: tanque.unidade,
                tanques: [],
              };
              // Adiciona a referência da unidade no array final também.
              respostaJSON.push(agrupamentoPorUnidade[tanque.unidade]);
            }

            // Empurra o tanque montado dentro da unidade correta.
            agrupamentoPorUnidade[tanque.unidade].tanques.push(objetoTanque);
          });

          if (respostaJSON.length > 0) {
            res.status(200).json(respostaJSON);
          } else {
            res.status(204).send(`Não foi encontrado registros`);
          }
        })
        .catch(function (erroRegistros) {
          console.log("Erro ao buscar registros: ", erroRegistros);
          res.status(500).json(erroRegistros.sqlMessage || erroRegistros);
        });
    })
    .catch(function (erroTanques) {
      console.log("Erro ao buscar tanques: ", erroTanques);
      res.status(500).json(erroTanques.sqlMessage || erroTanques);
    });
}

function novoValor(req, res) {
  var idTanque = req.params.idTanque;

  unidadeModel
    .novoValor(idTanque)
    .then((resultado) => {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).json.send(`Não foi encontrado novo valor`);
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar os registros: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function buscarMaiorVariacao(req, res) {
  var tanqueSelecionado = req.params.idTanque;

  unidadeModel
    .buscarMaiorVariacao(tanqueSelecionado)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum registro encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(
        "Houve um erro ao buscar as variações de temperatura: ",
        erro.sqlMessage,
      );
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  carregarUnidades,
  novoValor,
  buscarMaiorVariacao,
};
