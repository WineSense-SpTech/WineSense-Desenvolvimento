var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var graficosRouter = require("./src/routes/graficos");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/homeWineSense")));
app.use(express.static(path.join(__dirname, "public/sobre")));
app.use(express.static(path.join(__dirname, "public/loginCad")));
app.use(express.static(path.join(__dirname, "public/Dashboard-estatica")));
app.use(express.static(path.join(__dirname, "public/simulador-financeiro")));

// Rotas
app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/graficos", graficosRouter);

app.listen(PORTA_APP, function () {
    console.log(`Servidor rodando em http://${HOST_APP}:${PORTA_APP}`);
});