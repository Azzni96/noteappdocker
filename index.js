const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 3000;

// DB-arvot compose-ympäristömuuttujista
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_NAME = process.env.DB_NAME || "notesdb";
const DB_USER = process.env.DB_USER || "appuser";
const DB_PASS = process.env.DB_PASS || "apppass";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
  logging: false
});

const Note = sequelize.define("Note", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: true },
  content: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: "notes", timestamps: true });

app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", async (_req, res) => {
  try {
    const notes = await Note.findAll({ order: [["updatedAt", "DESC"]] });
    res.json(notes);
  } catch (e) {
    console.error("GET /api/notes error:", e.message);
    res.status(500).json({ error: "Luku epäonnistui" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const title = (req.body?.title || "").trim();
    const content = (req.body?.content || "").trim();
    if (!title && !content) return res.status(400).json({ error: "Title tai content vaaditaan" });
    const note = await Note.create({ title, content });
    res.status(201).json(note);
  } catch (e) {
    console.error("POST /api/notes error:", e.message);
    res.status(500).json({ error: "Tallennus epäonnistui" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const note = await Note.findByPk(id);
    if (!note) return res.status(404).json({ error: "Ei löydy" });
    const title = (req.body?.title || "").trim();
    const content = (req.body?.content || "").trim();
    await note.update({ title, content });
    res.json(note);
  } catch (e) {
    console.error("PUT /api/notes/:id error:", e.message);
    res.status(500).json({ error: "Päivitys epäonnistui" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const count = await Note.destroy({ where: { id } });
    if (!count) return res.status(404).json({ error: "Ei löydy" });
    res.status(204).end();
  } catch (e) {
    console.error("DELETE /api/notes/:id error:", e.message);
    res.status(500).json({ error: "Poisto epäonnistui" });
  }
});

// --- UUSI: yhdistä MariaDB:hen usealla yrityksellä ---
async function connectWithRetry(retries = 20, delayMs = 1500) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`DB connect attempt ${i}/${retries}...`);
      await sequelize.authenticate();
      console.log("DB yhteys OK");
      await sequelize.sync();
      return;
    } catch (err) {
      console.error(`DB connect failed (${i}/${retries}):`, err.message);
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

(async () => {
  try {
    await connectWithRetry();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Serveri käynnissä: http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Lopullinen virhe, sovellus sammuu:", err);
    process.exit(1);
  }
})();
