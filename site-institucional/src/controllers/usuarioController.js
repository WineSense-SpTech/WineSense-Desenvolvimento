var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {

    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var codigo = req.body.codigoServer;
    var ehAdm = req.body.ehAdmServer;

    if (!email) return res.status(400).send("Email está indefinido!");
    if (!senha) return res.status(400).send("Senha está indefinida!");
    if (!codigo) return res.status(400).send("Código está indefinido!");

    usuarioModel.autenticar(email, senha, codigo, ehAdm)
        .then(function (resultado) {

            if (resultado.length === 1) {

                res.json({
                    id: resultado[0].idUsuario,
                    nome: resultado[0].nome,
                    email: resultado[0].email,
                    cargo: resultado[0].cargo,
                    fkEmpresa: resultado[0].fkEmpresa,
                    fkGrupo: resultado[0].fkGrupo
                });

            } else if (resultado.length === 0) {

                res.json({
                    erro: "Credenciais ou código inválidos!"
                });

            } else {

                res.json({
                    erro: "Mais de um usuário encontrado."
                });

            }

        })
        .catch(function (erro) {
            console.log("Erro ao autenticar: ", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {

    var nome = req.body.nomeServer;
    var sobrenome = req.body.sobrenomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var codigoEmpresa = req.body.idEmpresaVincularServer;

    if (!nome) return res.status(400).send("Nome está indefinido!");
    if (!sobrenome) return res.status(400).send("Sobrenome está indefinido!");
    if (!email) return res.status(400).send("Email está indefinido!");
    if (!senha) return res.status(400).send("Senha está indefinida!");
    if (!codigoEmpresa) return res.status(400).send("Código da empresa está indefinido!");

    usuarioModel.cadastrar(nome, sobrenome, email, senha, codigoEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao cadastrar: ", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listar(req, res) {

    console.log("Buscando data inicio");

    usuarioModel.listar()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send('Nenhum resultado encontrado');
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log('Houve um erro ao listar', erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = { autenticar, cadastrar, listar };