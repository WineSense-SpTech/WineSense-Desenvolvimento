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
    let listaEmpresasCadastradas = ["AB123"]
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

    // Verificando se há algum campo em branco
    if (
      nome == "" ||
      email == "" ||
      senha == "" ||
      confirmaSenha == "" ||
        empresa == ""
    ) {
      cardErro.style.display = "block";
      mensagem_erro.innerHTML =
        "(Mensagem de erro para todos os campos em branco)";

      //finalizarAguardar();
      return false;
    } else {
      setInterval(sumirMensagem, 5000);
    }

    // Verificando se o código de ativação é de alguma empresa cadastrada
    for (let i = 0; i < listaEmpresasCadastradas.length; i++) {
      if (listaEmpresasCadastradas[i] == empresa) {
        empresa = listaEmpresasCadastradas[i]
        console.log("Código de ativação válido.");
        break;
      } else {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "(Mensagem de erro para código inválido)";
        //finalizarAguardar();
      }
    }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       body: JSON.stringify(corpo)
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          cardErro.style.display = "block";

          mensagem_erro.innerHTML =
            "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

          setTimeout(() => {
            window.location = "login.html";
          }, "2000");

          limparFormulario();
          //finalizarAguardar();
        } else {
          throw "Houve um erro ao tentar realizar o cadastro!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
        //finalizarAguardar();
      });

    return false;
  }

  // Listando empresas cadastradas 
  function listar() {
    fetch("/empresas/listar", {
      method: "GET",
    })
      .then(function (resposta) {
        resposta.json().then((empresas) => {
          empresas.forEach((empresa) => {
            listaEmpresasCadastradas.push(empresa);

            console.log("listaEmpresasCadastradas")
            console.log(listaEmpresasCadastradas[0].codigo_ativacao)
          });
        });
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  }

  function sumirMensagem() {
    cardErro.style.display = "none";
  }
    // function cadastrar() {
    //     var nome = document.getElementById("idNome").value;
    //     var sobrenome = document.getElementById("idSobrenome").value;
    //     var email = document.getElementById("idEmail").value;
    //     var senha = document.getElementById("idSenha").value;
    //     var confirmaSenha = document.getElementById("idConfirmaSenha").value;
    //     var empresa = document.getElementById("idEmpresa").value;

    //     var corpo = {
    //         nomeServer: nome,
    //         sobrenomeServer: sobrenome,
    //         emailServer: email,
    //         senhaServer: senha,
    //         idEmpresaVincularServer: empresa
    //     };

    //     fetch("/usuarios/cadastrar", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(corpo)
    //     })
    //         .then(r => r.json())
    //         .then(function (dados) {
    //             if (dados.id) {
    //                 mostrarSucesso("Cadastro realizado! Redirecionando...");
    //                 setTimeout(() => window.location.href = "login.html", 1500);
    //             } else {
    //                 mostrarErro(dados.mensagem);
    //             }
    //         })
    //         .catch(() => mostrarErro("Não foi possível conectar ao servidor."));
    // }
}

// LOGIN
if (document.title.includes("Login")) {
    function entrar() {
        //aguardar();

        var email = idEmail.value;
        var senha = idSenha.value;

        if (email == "" || senha == "") {
            cardErro.style.display = "block"
            mensagem_erro.innerHTML = "(Mensagem de erro para todos os campos em branco)";
            //finalizarAguardar();
            return false;
        }
        else {
            setInterval(sumirMensagem, 5000)
        }

        console.log("FORM LOGIN: ", email);
        console.log("FORM SENHA: ", senha);

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: email,
                senhaServer: senha
            })
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO entrar()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));
                    sessionStorage.emailUser = json.email;
                    sessionStorage.nomeUser = json.nome;
                    sessionStorage.idUser = json.id;
                    sessionStorage.empresaUser = JSON.stringify(json.fkEmpresa)

                    setTimeout(function () {
                        window.location = "../Dashboard-estatica/selecionarUnidade.html";
                    }, 1000); // apenas para exibir o loading

                });

            } else {

                console.log("Houve um erro ao tentar realizar o login!");

                resposta.text().then(texto => {
                    console.error(texto);
                    //finalizarAguardar(texto);
                });
            }

        }).catch(function (erro) {
            console.log(erro);
        })

        return false;
    }

    function sumirMensagem() {
        cardErro.style.display = "none"
    }
    // function validarSessao() {
    //     var email = document.getElementById("idEmail").value;
    //     var senha = document.getElementById("idSenha").value;

    //     if (tentativas >= 3) {
    //         mostrarErro("Acesso bloqueado.");
    //         return;
    //     }

    //     if (!email || !senha) {
    //         mostrarErro("Preencha e-mail e senha.");
    //         return;
    //     }

    //     var corpo = { emailServer: email, senhaServer: senha };

    //     fetch("/usuarios/autenticar", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(corpo)
    //     })
    //         .then(r => r.json())
    //         .then(function (dados) {
    //             if (dados.id) {
    //                 mostrarSucesso("Login realizado! Redirecionando...");
    //                 setTimeout(() => window.location.href = "../dashboard/dashboard.html", 1500);
    //             } else {
    //                 tentativas++;
    //                 var restantes = 3 - tentativas;
    //                 document.getElementById("tentativas").textContent =
    //                     tentativas >= 3 ? "Acesso bloqueado!" : `Tentativas restantes: ${restantes}`;
    //                 mostrarErro(dados.mensagem || "Email e/ou senha inválidos.");
    //             }
    //         })
    //         .catch(() => mostrarErro("Não foi possível conectar ao servidor."));
    // }
}