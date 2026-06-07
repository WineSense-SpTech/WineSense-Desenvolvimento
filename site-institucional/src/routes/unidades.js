var express = require("express");
var router = express.Router();

var unidadeController = require("../controllers/unidadeController");

router.get(
  "/carunidades/:grupoUsuarioPar/:empresaUsuarioPar",
  function (req, res) {
    unidadeController.carregarUnidades(req, res);
  },
);

router.get(
  "/novovalor/:idTanque",
  function (req, res) {
    unidadeController.novoValor(req, res);
  },
);

router.get(
  "/maior-variacao-tempo/:idTanque",
  function (req, res) {
    unidadeController.buscarMaiorVariacao(req, res);
  },
);

module.exports = router;
