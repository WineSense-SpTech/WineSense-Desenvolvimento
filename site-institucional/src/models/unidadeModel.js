var database = require("../database/config");

function tanquesBase(grupoUsuario) {
  var instrucaoSql = `
  SELECT * from tanque_base tb
      WHERE tb.fkGrupo = '${grupoUsuario}';
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function registrosTemperatura(grupoUsuario) {
  var instrucaoSql = `
    SELECT * FROM registros_temp rt
      WHERE rt.fkGrupo = '${grupoUsuario}'
        AND rt.dataHoraOriginal >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY rt.fkSensor, rt.dataHoraOriginal;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  tanquesBase,
  registrosTemperatura
}
