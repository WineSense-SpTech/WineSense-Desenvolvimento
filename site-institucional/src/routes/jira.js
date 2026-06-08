const express = require("express");

const router = express.Router();

router.post("/contato", async (req, res) => {
    try {

        const { nome, email, pedido } = req.body;

        const credentials = Buffer.from(
            `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
        ).toString("base64");
        console.log("Projeto:", process.env.JIRA_PROJECT_KEY);
        const response = await fetch(
            `https://${process.env.JIRA_DOMAIN}.atlassian.net/rest/api/3/issue`,
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    fields: {
                        project: {
                            key: process.env.JIRA_PROJECT_KEY
                        },
                        summary: `[Contato] ${nome}`,
                        description: {
                            type: "doc",
                            version: 1,
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        {
                                            type: "text",
                                            text: `${nome} | ${email}\n\n${pedido}`
                                        }
                                    ]
                                }
                            ]
                        },
                        issuetype: {
                            name: process.env.JIRA_ISSUE_TYPE
                        }
                    }
                }) 
            }
        );

        const data = await response.json();

        console.log("Status:", response.status);
        console.log(data);

        if (!response.ok) {
            return res.status(502).json(data);
        }

        res.status(201).json(data);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: erro.message
        });
    }
});
module.exports = router;