// Verifica qual página está aberta
const form = document.querySelector("form")

if (document.title.includes("Cadastro")) {
    
    form.addEventListener("submit", function(event) {
        event.preventDefault()

        const nome = document.querySelector("input[type='text']").value
        const email = document.querySelector("input[type='email']").value
        const senha = document.querySelectorAll("input[type='password']")[0].value
        const confirmarSenha = document.querySelectorAll("input[type='password']")[1].value

        // Validação
        if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
            alert("Preencha todos os campos")
            return
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem")
            return
        }

        // Salvar no localStorage
        const usuario = {
            nome: nome,
            email: email,
            senha: senha
        }

        localStorage.setItem("usuarioWineSense", JSON.stringify(usuario))

        alert("Cadastro realizado com sucesso!")

        window.location.href = "login.html"
    })
}


if (document.title.includes("Login")) {

    form.addEventListener("submit", function(event) {
        event.preventDefault()

        const email = document.querySelector("input[type='email']").value
        const senha = document.querySelector("input[type='password']").value

        const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioWineSense"))

        if (!usuarioSalvo) {
            alert("Nenhum usuário cadastrado")
            return
        }

        if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
            alert("Login realizado com sucesso!")
            window.location.href = "index.html"
        } else {
            alert("Email ou senha incorretos")
        }

    })
}