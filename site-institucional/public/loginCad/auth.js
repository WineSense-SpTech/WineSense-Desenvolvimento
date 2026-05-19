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

        if (empresa.length < 5 || empresa.length > 5) {
            alert(`empresa deve conter 5 digitos`);
            return false;
        }

        var corpo = {
            nomeServer: nome,
            emailServer: email,
            senhaServer: senha,
            idEmpresaVincularServer: empresa
        };

        fetch("/usuarios/cadastrar", {
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
                    return
                }
            })
            .catch(function () {
                mostrarErro("Não foi possível conectar ao servidor.");
                return
            });

        // Salva os dados separados
        sessionStorage.setItem("emailCadastrado", email);
        sessionStorage.setItem("senhaCadastrada", senha);
        sessionStorage.setItem("empresaCadastrada", empresa);
    }
}


// LOGIN
if (document.title.includes("Login")) {



    function mostrarErro(mensagem) {
        var caixaErro = document.getElementById("cardErro");
        var textoErro = document.getElementById("mensagem_erro");
        var caixaSucesso = document.getElementById("cardSucesso");

        textoErro.innerHTML = mensagem;
        caixaErro.style.display = "block";
        caixaSucesso.style.display = "none";
    }

    function mostrarSucesso(mensagem) {
        var caixaSucesso = document.getElementById("cardSucesso");
        var textoSucesso = document.getElementById("mensagem_sucesso");
        var caixaErro = document.getElementById("cardErro");

        textoSucesso.innerHTML = mensagem;
        caixaSucesso.style.display = "block";
        caixaErro.style.display = "none";
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



        fetch("/usuarios/autenticar", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        })
            .then(function (resposta) {
                return resposta.json();
            })
            .then(function (dados) {
                if (dados.token) {
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
}
function limparSessao() {
    sessionStorage.clear();
    window.location.href = "../public/login.html";
}