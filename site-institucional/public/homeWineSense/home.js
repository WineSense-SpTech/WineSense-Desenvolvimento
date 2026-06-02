
document.getElementById('contatoForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('ws-nome').value.trim(),
        email: document.getElementById('ws-email').value.trim(),
        pedido: document.getElementById('ws-pedido').value.trim(),
    };

    try {
        const res = await fetch('/api/contato', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        const data = await res.json();

        if (res.ok) alert('Solicitação enviada! Ticket: ' + data.ticket);
        else alert(data.erro || 'Erro ao enviar.');
    } catch {
        alert('Erro de conexão. Tente novamente.');
    }
});