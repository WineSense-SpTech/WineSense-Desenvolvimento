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