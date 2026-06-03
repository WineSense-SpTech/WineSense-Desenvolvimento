//var ambiente_processo = 'desenvolvimento';
var ambiente_processo = 'producao';
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
var unidadesRouter = require("./src/routes/unidades");
var graficosRouter = require("./src/routes/graficos");
var jiraRouter = require("./src/routes/jira")

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
app.use("/unidades", unidadesRouter);
app.use("/graficos", graficosRouter);
app.use("/jira", jiraRouter)

app.listen(PORTA_APP, function () {
    console.log(`
        ##   ##   ####   ##   ##  ######   #####   ######  ##   ##   #####   ######  
        ##   ##    ##    ###  ##  ##      ##   ##  ##      ###  ##  ##   ##  ##      
        ##   ##    ##    #### ##  ##      ##       ##      #### ##  ##       ##      
        ## # ##    ##    ## # ##  ####     #####   ####    ## # ##   #####   ####    
        #######    ##    ## ####  ##           ##  ##      ## ####       ##  ##      
        ### ###    ##    ##  ###  ##      ##   ##  ##      ##  ###  ##   ##  ##      
        ##   ##   ####   ##   ##  ######   #####   ######  ##   ##   #####   ######  
        \n\n
        Servidor rodando em http://${HOST_APP}:${PORTA_APP}
    `);
});