import express from 'express';

const router = express.Router();

router.post('/contato', async (req, res) => {
  const { nome, email, pedido } = req.body;

  const credentials = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString('base64');

  const response = await fetch(
    `https://${process.env.JIRA_DOMAIN}.atlassian.net/rest/api/3/issue`,
    {
      method: 'POST',
      headers: {
        Authorization:  `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project:     { key: process.env.JIRA_PROJECT_KEY },
          summary:     `[Contato] ${nome}`,
          description: {
            type: 'doc', version: 1,
            content: [{ type: 'paragraph', content: [{ type: 'text', text: `${nome} | ${email}\n\n${pedido}` }] }],
          },
          issuetype: { name: 'Task' },
        },
      }),
    }
  );

  const data = await response.json();
  res.status(response.ok ? 201 : 502).json({ ticket: data.key });
});

export default router;