var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT idUsuario, nome, email FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, sobrenome, email, senha, empresa) {

    var instrucaoSql = `
        INSERT INTO usuario 
        (nome, sobrenome, email, senha, fkEmpresa) 
        VALUES 
        ('${nome}', '${sobrenome}', '${email}', '${senha}', '${empresa}');
    `;

    return database.executar(instrucaoSql);
}

module.exports = { autenticar, cadastrar };