var unidadeModel = require("../models/unidadeModel");

function carregarUnidades(req, res) {
    var grupoUsuario = req.params.grupoUsuarioPar;

    // Obter a data de hoje no formato do banco para o filtro do gráfico
    var dataAtual = new Date();
    var hojeISO = dataAtual.toLocaleDateString('en-CA');

    unidadeModel.tanquesBase(grupoUsuario).then(function (tanquesDB) {
        unidadeModel.registrosTemperatura(grupoUsuario).then(function (registrosDB) {

            var respostaJSON = [];
            var agrupamentoPorUnidade = {};

            tanquesDB.forEach(function (tanque) {
                var todosOsRegistrosDaSemana = registrosDB.filter(reg => reg.fkSensor === tanque.fkSensor);

                // Descobre a última data registrada para este tanque
                var datasRegistradas = todosOsRegistrosDaSemana.map(reg => reg.data_leitura);
                var ultimaDataStr = datasRegistradas.length > 0 ? datasRegistradas[datasRegistradas.length - 1] : hojeISO;

                var registrosDeHoje = todosOsRegistrosDaSemana.filter(reg => reg.data_leitura === ultimaDataStr);

                var labelsArray = registrosDeHoje.map(reg => reg.horario);
                var valoresArray = registrosDeHoje.map(reg => Number(reg.valor));

                var todasAsTemperaturasDaSemana = todosOsRegistrosDaSemana.map(reg => Number(reg.valor));
                var variacaoMin = todasAsTemperaturasDaSemana.length > 0 ? Math.min(...todasAsTemperaturasDaSemana) : 0;
                var variacaoMax = todasAsTemperaturasDaSemana.length > 0 ? Math.max(...todasAsTemperaturasDaSemana) : 0;

                var alertasReaisDaSemana = 0;
                todosOsRegistrosDaSemana.forEach(function (leitura) {
                    if (Number(leitura.valor) < tanque.temp_min_limite || Number(leitura.valor) > tanque.temp_max_limite) {
                        alertasReaisDaSemana++;
                    }
                });

                var objetoTanque = {
                    id: tanque.id,
                    status: alertasReaisDaSemana > 0 ? "Crítico" : "Regular",
                    classe: alertasReaisDaSemana > 0 ? "critico red" : "normal",
                    Uva: tanque.uva_nome,
                    // Converte a data yyyy-mm-dd para dd/mm
                    data_medicao: ultimaDataStr.split('-').reverse().slice(0, 2).join('/'),
                    metricas: {
                        horarioVar: labelsArray.length > 0 ? labelsArray[labelsArray.length - 1] : "--",
                        alertasSemana: alertasReaisDaSemana,
                        varMin: variacaoMin,
                        varMax: variacaoMax
                    },
                    temperatura: {
                        labels: labelsArray,
                        valores: valoresArray,
                        temp_max: [Number(tanque.temp_max_limite)],
                        temp_min: [Number(tanque.temp_min_limite)]
                    },
                    alertas: {
                        labels: ["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5"],
                        urgente: [0, 0, Math.floor(alertasReaisDaSemana / 2), 0, Math.ceil(alertasReaisDaSemana / 2)],
                        atencao: [0, 0, 0, 0, 0]
                    }
                };

                if (!agrupamentoPorUnidade[tanque.unidade]) {
                    agrupamentoPorUnidade[tanque.unidade] = {
                        unidade: tanque.unidade,
                        tanques: []
                    };
                    respostaJSON.push(agrupamentoPorUnidade[tanque.unidade]);
                }
                agrupamentoPorUnidade[tanque.unidade].tanques.push(objetoTanque);
            });

            if (respostaJSON.length > 0) {
                res.status(200).json(respostaJSON);
            } else {
                res.status(204).send(`Não foi encontrado registros`);
            }

        }).catch(function (erroRegistros) {
            console.log("Erro ao buscar registros: ", erroRegistros);
            res.status(500).json(erroRegistros.sqlMessage || erroRegistros);
        });
    }).catch(function (erroTanques) {
        console.log("Erro ao buscar tanques: ", erroTanques);
        res.status(500).json(erroTanques.sqlMessage || erroTanques);
    });
}

module.exports = {
    carregarUnidades
}