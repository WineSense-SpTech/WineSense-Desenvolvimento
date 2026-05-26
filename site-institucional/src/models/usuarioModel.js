var db = require("../database/config");

function autenticar(email, senha, codigo, ehAdm) {

    var instrucaoSql;

    if (ehAdm) {
        // Administrador: valida email, senha, cargo e codGrupo
        instrucaoSql = `
            SELECT 
                u.idUsuario, 
                u.nome, 
                u.email, 
                u.cargo, 
                u.fkEmpresa,
                u.fkGrupo
            FROM usuario u
            INNER JOIN grupoEmpresa g ON u.fkGrupo = g.codGrupo
            WHERE u.email = '${email}' 
            AND u.senha = '${senha}'
            AND u.cargo = 'adm'
            AND g.codGrupo = '${codigo}';
        `;
    } else {
        // Usuário comum: valida email, senha e codEmpresa
        instrucaoSql = `
            SELECT 
                u.idUsuario, 
                u.nome, 
                u.email, 
                u.cargo, 
                u.fkEmpresa, 
                u.fkGrupo
            FROM usuario u
            INNER JOIN empresa e ON u.fkEmpresa = e.codEmpresa
            WHERE u.email = '${email}' 
            AND u.senha = '${senha}'
            AND e.codEmpresa = '${codigo}';
        `;
    }

    return db.executar(instrucaoSql);
}

function cadastrar(nome, sobrenome, email, senha, codigoEmpresa) {

    var instrucaoSql = `
        INSERT INTO usuario 
            (nome, sobrenome, email, senha, fkEmpresa) 
        VALUES 
            ('${nome}', '${sobrenome}', '${email}', '${senha}', '${codigoEmpresa}');
    `;

    return db.executar(instrucaoSql);
}

function listar() {

    var instrucaoSql = `
        SELECT
            codEmpresa
        FROM empresa;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return db.executar(instrucaoSql);
}

module.exports = { autenticar, cadastrar, listar };