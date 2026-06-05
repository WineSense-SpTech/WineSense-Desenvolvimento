var database = require("../database/config");

function tanquesBase(grupoUsuario, empresaUsuario) {
  if (empresaUsuario != "null") {
    var instrucaoSql = `
  SELECT * from tanque_base tb
      WHERE tb.codEmpresa = '${empresaUsuario}';
  `;
  } else {
    var instrucaoSql = `
  SELECT * from tanque_base tb
      WHERE tb.fkGrupo = '${grupoUsuario}';
  `;
  }
  console.log(
    "Executando a instrução SQL: \n" + instrucaoSql,
    grupoUsuario,
    empresaUsuario,
  );
  return database.executar(instrucaoSql);
}

function registrosTemperatura(grupoUsuario, empresaUsuario) {
  if (empresaUsuario != "null") {
    var instrucaoSql = `
    SELECT * FROM registros_temp rt
      WHERE rt.codEmpresa = '${empresaUsuario}'
        AND rt.dataHoraOriginal >= DATE_SUB(NOW(), INTERVAL 20 DAY)
      ORDER BY rt.fkSensor, rt.dataHoraOriginal;
  `;
  } else {
    var instrucaoSql = `
    SELECT * FROM registros_temp rt
      WHERE rt.fkGrupo = '${grupoUsuario}'
        AND rt.dataHoraOriginal >= DATE_SUB(NOW(), INTERVAL 20 DAY)
      ORDER BY rt.fkSensor, rt.dataHoraOriginal;
  `;
  }

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function novoValor(idTanque) {
  var instrucaoSql = `
    SELECT * FROM registros_temp rt
    WHERE rt.idTanque = ${idTanque}
    ORDER BY rt.fkSensor, rt.dataHoraOriginal DESC
    LIMIT 1;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  tanquesBase,
  registrosTemperatura,
  novoValor
};
