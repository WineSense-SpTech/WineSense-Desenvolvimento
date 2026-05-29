var database = require("../database/config");

function tanquesBase(grupoUsuario) {
  var instrucaoSql = `
    SELECT 
      end.cidade AS unidade,
      t.idTanque AS id,
      u.nome AS uva_nome,
      v.tempMinima AS temp_min_limite,
      v.tempMaxima AS temp_max_limite,
      t.fkSensor
    FROM empresa emp
    JOIN endereco end ON emp.fkEndereco = end.idEndereco
    JOIN tanque t ON t.fkEmpresa = emp.codEmpresa
    JOIN vinho v ON t.fkVinho = v.idVinho
    JOIN receitaVinho rv ON v.idVinho = rv.fkVinho
    JOIN uva u ON rv.idVinhoUva = u.idUva
    WHERE emp.fkGrupo = '${grupoUsuario}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function registrosTemperatura(grupoUsuario) {
  var instrucaoSql = `
    SELECT 
      r.fkSensor,
      DATE_FORMAT(r.dataHora, '%Y-%m-%d') AS data_leitura,
      DATE_FORMAT(r.dataHora, '%H:%i') AS horario,
      r.temperatura AS valor
    FROM registro r
    JOIN tanque t ON r.fkSensor = t.fkSensor
    JOIN empresa emp ON t.fkEmpresa = emp.codEmpresa
    WHERE emp.fkGrupo = '${grupoUsuario}'
      AND r.dataHora >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ORDER BY r.fkSensor, r.dataHora;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  tanquesBase,
  registrosTemperatura
}
