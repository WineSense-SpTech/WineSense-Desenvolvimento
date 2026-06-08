var ambiente_processo = 'desenvolvimento';
//var ambiente_processo = 'producao';
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");

const { GoogleGenAI } = require("@google/genai");

var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var unidadesRouter = require("./src/routes/unidades");
var graficosRouter = require("./src/routes/graficos");
var jiraRouter = require("./src/routes/jira")

// configurando o gemini (IA)
const chatIA = new GoogleGenAI({ apiKey: process.env.MINHA_CHAVE });

async function gerarResposta(mensagem) {

    try {
        // gerando conteúdo com base na pergunta
        const modeloIA = chatIA.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Em um paragráfo responda: ${mensagem}`

        });
        const resposta = (await modeloIA).text;
        const tokens = (await modeloIA).usageMetadata;

        console.log(resposta);
        console.log("Uso de Tokens:", tokens);

        return resposta;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/homeWineSense")));
app.use(express.static(path.join(__dirname, "public/sobre")));
app.use(express.static(path.join(__dirname, "public/loginCad")));
app.use(express.static(path.join(__dirname, "public/Dashboard-estatica")));
app.use(express.static(path.join(__dirname, "public/simulador-financeiro")));

// configurando o servidor para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public/bobia")));

// Rotas
app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/unidades", unidadesRouter);
app.use("/graficos", graficosRouter);
app.use("/jira", jiraRouter);

app.get("/bobia", (req, res) => {
    res.sendFile(path.join(__dirname, "public/bobia/index.html"));
});

// rota para receber perguntas e gerar respostas
app.post("/perguntar", async (req, res) => {
    const pergunta = req.body.pergunta;

    try {
        const resultado = await gerarResposta(pergunta);
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }

});

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
