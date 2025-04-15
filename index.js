const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// HIER DEIN MAKE.COM WEBHOOK EINTRAGEN
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/DEIN_WEBHOOK";

app.use(bodyParser.json());

// GET-Anfrage für Dropbox-Challenge
app.get("/", (req, res) => {
  const challenge = req.query.challenge;
  if (challenge) {
    console.log("Challenge erkannt:", challenge);
    return res.status(200).send(challenge);
  }
  res.status(200).send("OK");
});

// POST-Anfrage an Make.com weiterleiten
app.post("/", async (req, res) => {
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    res.status(200).send(text);
  } catch (error) {
    console.error("Fehler beim Weiterleiten:", error);
    res.status(500).send("Fehler beim Weiterleiten");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy läuft auf Port ${PORT}`);
});
