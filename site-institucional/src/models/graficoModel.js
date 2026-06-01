var database = require("../database/config");

function obterGrafico(empresaUsuario) {
  var instrucaoSql = `
    SELECT
      DATE_FORMAT(r.dataHora, '%H:%i'),
      r.temperatura
    FROM registro r
    JOIN sensor s ON s.idSensor = r.fkSensor
    JOIN tanque t ON s.idSensor = t.fkSensor
    JOIN empresa e ON e.codEmpresa = t.fkEmpresa
    WHERE e.fkGrupo = '${empresaUsuario}'
    ORDER BY r.dataHora DESC
    LIMIT 25;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = {
  obterGrafico
}
