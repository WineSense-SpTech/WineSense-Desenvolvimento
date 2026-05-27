var express = require("express");
var router = express.Router();

var graficoController = require("../controllers/graficoController");

router.get("/obtergrafico/:grupoUsuarioPar", function (req, res) {
  graficoController.obterGrafico(req, res);
});

module.exports = router;