// Funções globais (fora dos ifs)
var tentativas = 0;

function mostrarErro(mensagem) {
    document.getElementById("cardErro").style.display = "block";
    document.getElementById("cardSucesso").style.display = "none";
    document.getElementById("mensagem_erro").innerHTML = mensagem;
}

function mostrarSucesso(mensagem) {
    document.getElementById("cardSucesso").style.display = "block";
    document.getElementById("cardErro").style.display = "none";
    document.getElementById("mensagem_sucesso").innerHTML = mensagem;
}

// CADASTRO
if (document.title.includes("Cadastro")) {
    function cadastrar() {
        var nome = document.getElementById("idNome").value;
        var sobrenome = document.getElementById("idSobrenome").value;
        var email = document.getElementById("idEmail").value;
        var senha = document.getElementById("idSenha").value;
        var confirmaSenha = document.getElementById("idConfirmaSenha").value;
        var empresa = document.getElementById("idEmpresa").value;

        var corpo = {
            nomeServer: nome,
            sobrenomeServer: sobrenome,
            emailServer: email,
            senhaServer: senha,
            idEmpresaVincularServer: empresa
        };

        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        })
            .then(r => r.json())
            .then(function (dados) {
                if (dados.id) {
                    mostrarSucesso("Cadastro realizado! Redirecionando...");
                    setTimeout(() => window.location.href = "login.html", 1500);
                } else {
                    mostrarErro(dados.mensagem);
                }
            })
            .catch(() => mostrarErro("Não foi possível conectar ao servidor."));
    }
}

// LOGIN
if (document.title.includes("Login")) {
    function validarSessao() {
        var email = document.getElementById("idEmail").value;
        var senha = document.getElementById("idSenha").value;

        if (tentativas >= 3) {
            mostrarErro("Acesso bloqueado.");
            return;
        }

        if (!email || !senha) {
            mostrarErro("Preencha e-mail e senha.");
            return;
        }

        var corpo = { emailServer: email, senhaServer: senha };

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        })
            .then(r => r.json())
            .then(function (dados) {
                if (dados.id) {
                    mostrarSucesso("Login realizado! Redirecionando...");
                    setTimeout(() => window.location.href = "../dashboard/dashboard.html", 1500);
                } else {
                    tentativas++;
                    var restantes = 3 - tentativas;
                    document.getElementById("tentativas").textContent =
                        tentativas >= 3 ? "Acesso bloqueado!" : `Tentativas restantes: ${restantes}`;
                    mostrarErro(dados.mensagem || "Email e/ou senha inválidos.");
                }
            })
            .catch(() => mostrarErro("Não foi possível conectar ao servidor."));
    }
}