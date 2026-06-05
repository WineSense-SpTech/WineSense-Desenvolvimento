var tentativas = 0;

function mostrarErro(mensagem) {
  cardErro.style.display = "block";
  cardSucesso.style.display = "none";
  mensagem_erro.innerHTML = mensagem;
}

function mostrarSucesso(mensagem) {
  cardSucesso.style.display = "block";
  cardErro.style.display = "none";
  mensagem_sucesso.innerHTML = mensagem;
}

function sumirMensagem() {
  cardErro.style.display = "none";
  cardSucesso.style.display = "none";
}

// CADASTRO

if (document.title.includes("Cadastro")) {
  var listaEmpresasCadastradas = [];

  listar();

  function cadastrar() {
    var nome = idNome.value;
    var sobrenome = idSobrenome.value;
    var email = idEmail.value;
    var senha = idSenha.value;
    var confirmaSenha = idConfirmaSenha.value;
    var codigoEmpresa = idEmpresa.value;

    // Verificando campos em branco
    if (
      nome == "" ||
      sobrenome == "" ||
      email == "" ||
      senha == "" ||
      confirmaSenha == "" ||
      codigoEmpresa == ""
    ) {
      mostrarErro("Preencha todos os campos!");
      return false;
    }

    if (email.includes("@winesense.com")) {
      mostrarErro(
        "Acesso negado! contas winesense não permitidas para cadastro!",
      );
      return false;
    }

    // Verificando se as senhas coincidem
    if (senha !== confirmaSenha) {
      mostrarErro("As senhas não coincidem!");
      return false;
    }

    // Verificando se o código de empresa é válido
    var empresaEncontrada = false;
    for (var i = 0; i < listaEmpresasCadastradas.length; i++) {
      if (listaEmpresasCadastradas[i].codEmpresa == codigoEmpresa) {
        empresaEncontrada = true;
        break;
      }
    }

    if (!empresaEncontrada) {
      mostrarErro("Código de empresa inválido!");
      return false;
    }

    var corpo = {
      nomeServer: nome,
      sobrenomeServer: sobrenome,
      emailServer: email,
      senhaServer: senha,
      idEmpresaVincularServer: codigoEmpresa,
    };

    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    })
      .then(function (resposta) {
        if (resposta.ok) {
          mostrarSucesso(
            "Cadastro realizado com sucesso! Redirecionando para o Login...",
          );
          setTimeout(function () {
            window.location = "login.html";
          }, 2000);
        } else {
          resposta.text().then(function (texto) {
            mostrarErro("Erro ao cadastrar: " + texto);
          });
        }
      })
      .catch(function (erro) {
        console.log("Erro: ", erro);
        mostrarErro("Erro ao conectar com o servidor!");
      });

    return false;
  }

  function listar() {
    fetch("/usuarios/listar", {
      method: "GET",
    })
      .then(function (resposta) {
        resposta.json().then(function (empresas) {
          console.log(empresas);

          listaEmpresasCadastradas = empresas;
        });
      })
      .catch(function (erro) {
        console.log("Erro ao listar empresas: ", erro);
      });
  }

  setInterval(sumirMensagem, 5000);
}

// LOGIN

if (document.title.includes("Login")) {
  // Troca o placeholder do campo código conforme o checkbox de adm
  function alternarCodigo() {
    var marcado = idAdm.checked;
    idCodigo.placeholder = marcado ? "Cód do Grupo" : "Cód da Empresa";
  }

  function entrar() {
    var email = idEmail.value;
    var senha = idSenha.value;
    var codigo = idCodigo.value;
    var ehAdm = idAdm.checked;

    // Verificando campos em branco
    if (email == "" || senha == "" || codigo == "") {
      mostrarErro("Preencha todos os campos!");
      return false;
    }

    fetch("/usuarios/autenticar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailServer: email,
        senhaServer: senha,
        codigoServer: codigo,
        ehAdmServer: ehAdm,
      }),
    })
      .then(function (resposta) {
        resposta.json().then(function (json) {
          if (json.erro) {
            mostrarErro(json.erro);
            return;
          }

          if (resposta.status == 200) {
            // Salvando dados na sessionStorage
            sessionStorage.idUsuario = json.id;
            sessionStorage.nomeUsuario = json.nome;
            sessionStorage.emailUsuario = json.email;
            sessionStorage.cargoUsuario = json.cargo;
            sessionStorage.empresaUsuario = json.fkEmpresa;
            sessionStorage.grupoUsuario = json.fkGrupo;

            console.log("bom dia");

            // Redirecionando conforme o cargo (adm ou N3)
            if (json.email.includes("@winesense.com")) {
              window.location = "../bobia/index.html";
            } else {
              window.location = "../Dashboard-estatica/SelecionarUnidade.html";
            }
          }
        });
      })
      .catch(function (erro) {
        console.log("Erro: ", erro);
        mostrarErro("Erro ao conectar com o servidor!");
      });

    return false;
  }

  setInterval(sumirMensagem, 5000);
}
