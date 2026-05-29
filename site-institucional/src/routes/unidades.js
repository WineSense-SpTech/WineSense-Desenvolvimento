var express = require("express");
var router = express.Router();

var unidadeController = require("../controllers/unidadeController");

router.get("/carunidades/:grupoUsuarioPar", function (req, res) {
    unidadeController.carregarUnidades(req, res);
});

module.exports = router;