const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// yksinkertainen muisti (nollautuu kun kontti käynnistyy uudestaan)
let notes = [];
let nextId = 1;

app.use(express.json());
app.use(express.static("public"));

// API
app.get("/api/notes", (_req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "text vaaditaan" });
  const note = { id: nextId++, text, createdAt: new Date().toISOString() };
  notes.unshift(note);
  res.status(201).json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = notes.length;
  notes = notes.filter(n => n.id !== id);
  if (notes.length === before) return res.status(404).json({ error: "Ei löydy" });
  res.status(204).end();
});

// käynnistä (0.0.0.0 on tärkeä Dockerissa)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveri: http://0.0.0.0:${PORT}`);
});
