#!/usr/bin/env node
/* Simple email sender using SendGrid.
   Run: npm install express cors body-parser @sendgrid/mail
   Start: node server/send-welcome.js
   Env required: SENDGRID_API_KEY, WELCOME_FROM_EMAIL
*/
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

const PORT = process.env.PORT || 3001;

if (!process.env.SENDGRID_API_KEY || !process.env.WELCOME_FROM_EMAIL) {
  console.warn('Warning: SENDGRID_API_KEY or WELCOME_FROM_EMAIL not set. Emails will fail.');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const msg = {
      to: email,
      from: process.env.WELCOME_FROM_EMAIL,
      subject: 'Welcome to SheTrades!',
      text: `Hi ${name || ''}!\n\nThanks for joining SheTrades. We're excited to have you on board.`,
      html: `<p>Hi ${name || ''}!</p><p>Thanks for joining <strong>SheTrades</strong>. We're excited to have you on board.</p><p>— The SheTrades Team</p>`,
    };

    await sgMail.send(msg);
    return res.json({ ok: true });
  } catch (err) {
    console.error('send-welcome error', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
});

app.listen(PORT, () => {
  console.log(`Welcome email server listening on http://localhost:${PORT}`);
});
