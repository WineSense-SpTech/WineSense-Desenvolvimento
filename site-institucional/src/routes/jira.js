const express = require("express");

const router = express.Router();
router.get("/teste-jira", async (req, res) => {
    try {
        console.log("EMAIL:", process.env.JIRA_EMAIL);
        console.log("DOMAIN:", process.env.JIRA_DOMAIN);
        console.log("TOKEN EXISTE?", !!process.env.JIRA_API_TOKEN);

        // ADICIONE ESTES
        console.log("EMAIL BRUTO:", JSON.stringify(process.env.JIRA_EMAIL));
        console.log(
            "TOKEN INICIO:",
            JSON.stringify(process.env.JIRA_API_TOKEN.substring(0, 20))
        );

        const credentials = Buffer.from(
            `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
        ).toString("base64");

        const response = await fetch(
            `https://${process.env.JIRA_DOMAIN}.atlassian.net/rest/api/3/myself`,
            {
                method: "GET",
                headers: {
                    Authorization: `Basic ${credentials}`,
                    Accept: "application/json"
                }
            }
        );

        console.log("STATUS:", response.status);

        const texto = await response.text();

        console.log("BODY:", texto);

        res.status(response.status).send(texto);

    } catch (erro) {
        console.error(erro);
        res.status(500).send(erro.message);
    }
});
router.post("/contato", async (req, res) => {
    try {
        const { nome, email, pedido } = req.body;

        const credentials = Buffer.from(
            `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
        ).toString("base64");

        const response = await fetch(
            `https://${process.env.JIRA_DOMAIN}.atlassian.net/rest/servicedeskapi/request`,
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-ExperimentalApi": "opt-in"
                },
                body: JSON.stringify({
                    serviceDeskId: process.env.JIRA_SERVICE_DESK_ID,
                    requestTypeId: process.env.JIRA_REQUEST_TYPE_ID,
                    requestFieldValues: {
                        summary: `[Contato] ${nome}`,
                        description: `Nome: ${nome}\nEmail: ${email}\n\n${pedido}`
                    }
                })
            }
        );

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Resposta Jira:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                erro: data
            });
        }

        return res.status(201).json({
            key: data.issueKey,
            id: data.issueId,
            status: data.currentStatus?.status
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: erro.message
        });
    }
});

module.exports = router;