var database = require("../database/config");

function obterGrafico(empresaUsuario) {
  var instrucaoSql = `
    SELECT * FROM obter_dados od
      WHERE od.fkGrupo = '${empresaUsuario}'
        ORDER BY od.dataHoraOriginal DESC
        LIMIT 21;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  obterGrafico,
};
