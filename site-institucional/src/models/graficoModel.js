var database = require("../database/config");

function buscarAquariosPorEmpresa(empresaId) {

  var instrucaoSql = `SELECT * FROM aquario a WHERE fk_empresa = ${empresaId}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrar(empresaId, descricao) {
  
  var instrucaoSql = `INSERT INTO (descricao, fk_empresa) aquario VALUES (${descricao}, ${empresaId})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function obterGrafico(grupoUsuario) {
  var instrucaoSql = `
    SELECT
      r.dataHora,
      r.temperatura
    FROM registro r
    JOIN sensor s ON s.idSensor = r.fkSensor
    JOIN tanque t ON s.idSensor = t.fkSensor
    JOIN empresa e ON e.codEmpresa = t.fkEmpresa
    WHERE e.fkGrupo = '${grupoUsuario}'
    ORDER BY r.dataHora DESC
    LIMIT 25;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = {
  buscarAquariosPorEmpresa,
  cadastrar,
  obterGrafico
}
