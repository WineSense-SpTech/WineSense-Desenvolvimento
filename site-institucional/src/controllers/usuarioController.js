var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) return res.status(400).send("Email está undefined!");
    if (!senha) return res.status(400).send("Senha está indefinida!");

    usuarioModel.autenticar(email, senha)
        .then(function (resultado) {
            if (resultado.length === 1) {
                // ✅ Responde o cliente
                res.json({
                    id: resultado[0].id,
                    nome: resultado[0].nome,
                    email: resultado[0].email
                });
            } else if (resultado.length === 0) {
                res.status(403).json({ mensagem: "Email e/ou senha inválidos." });
            } else {
                res.status(403).json({ mensagem: "Mais de um usuário encontrado." });
            }
        })
        .catch(function (erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!nome) return res.status(400).send("Nome está undefined!");
    if (!email) return res.status(400).send("Email está undefined!");
    if (!senha) return res.status(400).send("Senha está undefined!");

    usuarioModel.cadastrar(nome, email, senha)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = { autenticar, cadastrar };