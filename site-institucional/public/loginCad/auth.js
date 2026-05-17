// CADASTRO
if (document.title.includes("Cadastro")) {

    function cadastrar() {
        let nome = idNome.value;
        let email = idEmail.value;
        let senha = idSenha.value;
        let confirmarSenha = idConfirmaSenha.value;
        let empresa = idEmpresa.value;

        if (nome === "" || email === "" || senha === "" || confirmarSenha === "" || empresa === ``) {
            alert("Preencha todos os campos");
            return false;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem");
            return false;
        }
    if (nome.length <= 1) {
        alert("Nome deve ter mais de 1 caractere.");
        return false;
    }

    if (email.includes("@") === false || email.includes(".") === false) {
        alert("E-mail inválido.");
        return false;
    }

    if (senha.length <= 6) {
        alert("Senha deve ter mais de 6 caracteres.");
        return false;
    }

    if (empresa.length < 5 || empresa.length > 5){
        alert(`empresa deve conter 5 digitos`);
        return false;
    }

        // Salva os dados separados
        sessionStorage.setItem("emailCadastrado", email);
        sessionStorage.setItem("senhaCadastrada", senha);
        sessionStorage.setItem("empresaCadastrada", empresa);

        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
        return false;
    }
}


// LOGIN
if (document.title.includes("Login")) {

    let erros = [];

    function entrar() {

        let email = idEmail.value;
        let senha = idSenha.value;
        let empresa = idEmpresa.value;
        let emailSalvo = sessionStorage.getItem("emailCadastrado");
        let senhaSalva = sessionStorage.getItem("senhaCadastrada");
        let empresaSalva = sessionStorage.getItem("empresaCadastrada");

        if (emailSalvo === null) {
            alert("Nenhum usuário cadastrado");
            return false;
        }

        if (email === emailSalvo && senha === senhaSalva && empresa === empresaSalva) {
            alert("Login realizado com sucesso!");
            window.location.href = "../Dashboard-estatica/selecionarUnidade.html";
            return false;
        } else {
            erros.push("erro");
        }

        for (let i = 0; i < erros.length; i++) {
            if (i === 2) {
                alert("Você excedeu o número de tentativas. Acesso bloqueado!");
                return false;
            }
        }

        let restantes = 3 - erros.length;
        alert("Email ou senha ou codEmpresa incorretos. Tentativas restantes: " + restantes);
        return false;
    }
}


var URL_API = "http://localhost:3000";

var tentativas = 0;

function mostrarErro(mensagem) {
    var caixaErro    = document.getElementById("cardErro");
    var textoErro    = document.getElementById("mensagem_erro");
    var caixaSucesso = document.getElementById("cardSucesso");

    textoErro.innerHTML        = mensagem;
    caixaErro.style.display    = "block";
    caixaSucesso.style.display = "none";
}

function mostrarSucesso(mensagem) {
    var caixaSucesso = document.getElementById("cardSucesso");
    var textoSucesso = document.getElementById("mensagem_sucesso");
    var caixaErro    = document.getElementById("cardErro");

    textoSucesso.innerHTML     = mensagem;
    caixaSucesso.style.display = "block";
    caixaErro.style.display    = "none";
}

function cadastrar() {
    var nome     = document.getElementById("idNome").value;
    var email    = document.getElementById("idEmail").value;
    var senha    = document.getElementById("idSenha").value;
    var empresa = document.getElementById("idEmpresa").value;
    var confirma = document.getElementById("idConfirmaSenha").value;

    // Validações — verifica cada campo antes de enviar
    if (nome === "" || email === "" || senha === "" || confirma === "") {
        mostrarErro("Preencha todos os campos.");
        return;
    }

    if (nome.length <= 1) {
        mostrarErro("Nome deve ter mais de 1 caractere.");
        return;
    }

    if (email.includes("@") === false || email.includes(".") === false) {
        mostrarErro("E-mail inválido.");
        return;
    }

    if (senha.length <= 6) {
        mostrarErro("Senha deve ter mais de 6 caracteres.");
        return;
    }

    if (senha !== confirma) {
        mostrarErro("As senhas não coincidem.");
        return;
    }

    var corpo = {
    nomeServer: nome,
    emailServer: email,
    senhaServer: senha,
    idEmpresaVincularServer: empresa
};

    // Envia para a API via fetch
    fetch(URL_API + "/usuarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    })
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function (dados) {
        if (dados.id) {
            mostrarSucesso("Cadastro realizado! Redirecionando...");
            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);
        } else {
            mostrarErro(dados.mensagem);
        }
    })
    .catch(function () {
        mostrarErro("Não foi possível conectar ao servidor.");
    });
}

function validarSessao() {
    var email = document.getElementById("idEmail").value;
    var senha = document.getElementById("idSenha").value;
    var empresa = document.getElementById("idEmpresa").value;

    // Bloqueia se já errou 3 vezes
    if (tentativas >= 3) {
        mostrarErro("Acesso bloqueado. Número máximo de tentativas atingido.");
        return;
    }

    if (email === "" || senha === "") {
        mostrarErro("Preencha e-mail e senha.");
        return;
    }

    var corpo = {
    nomeServer: nome,
    emailServer: email,
    senhaServer: senha,
    idEmpresaVincularServer: empresa
};

    fetch(URL_API + "/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    })
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function (dados) {
        if (dados.token) {
            sessionStorage.setItem("token",   dados.token);
            sessionStorage.setItem("usuario", JSON.stringify(dados.usuario));

            mostrarSucesso("Login realizado! Redirecionando...");
            setTimeout(function () {
                window.location.href = "../dashboard/dashboard.html";
            }, 1500);

        } else {
            tentativas = tentativas + 1;

            var restantes = 3 - tentativas;
            var spanTentativas = document.getElementById("tentativas");

            if (tentativas >= 3) {
                spanTentativas.textContent = "Acesso bloqueado!";
                mostrarErro("Você excedeu o número de tentativas.");
            } else {
                spanTentativas.textContent = "Tentativas restantes: " + restantes;
                mostrarErro(dados.mensagem);
            }
        }
    })
    .catch(function () {
        mostrarErro("Não foi possível conectar ao servidor.");
    });
}

function limparSessao() {
    sessionStorage.clear();
    window.location.href = "../public/login.html";
}