// CADASTRO
if (document.title.includes("Cadastro")) {

    function cadastrar() {
        let nome = idNome.value;
        let email = idEmail.value;
        let senha = idSenha.value;
        let confirmarSenha = idConfirmaSenha.value;

        if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
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

        // Salva os dados separados
        sessionStorage.setItem("emailCadastrado", email);
        sessionStorage.setItem("senhaCadastrada", senha);

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
        let emailSalvo = sessionStorage.getItem("emailCadastrado");
        let senhaSalva = sessionStorage.getItem("senhaCadastrada");

        if (emailSalvo === null) {
            alert("Nenhum usuário cadastrado");
            return false;
        }

        if (email === emailSalvo && senha === senhaSalva) {
            alert("Login realizado com sucesso!");
            window.location.href = "../Dashboard-estatica/Dashboard.html";
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
        alert("Email ou senha incorretos. Tentativas restantes: " + restantes);
        return false;
    }
}