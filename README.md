# 🗒️ Notes App (Docker + MariaDB)

Yksinkertainen muistiinpanosovellus, joka ajetaan **Docker**-kontissa **MariaDB**-tietokannan kanssa.  
Käyttää **Sequelize ORM**:ää ja tarjoaa REST API:n sekä selain-UI:n.

---

## 📁 Projektirakenne

```
my-notes-app/
├─ package.json
├─ index.js
├─ Dockerfile
├─ docker-compose.yml
└─ public/
   └─ index.html
```

> Huom: `docker-compose.yml` **ei** sisällä `version:`-riviä (se on vanhentunut).

---

## 📦 Vaatimukset

- Docker Desktop (Windows/Mac) tai Docker Engine + Docker Compose
- Vapaa portti **3000** (web-sovellus)
- Vapaa portti **3306** (MariaDB)

---

## 🚀 Käynnistys Dockerilla

Projektikansiossa:

```bash
docker compose build
docker compose up
```

Ensimmäisellä kerralla MariaDB alustuu ja sovellus odottaa yhteyden valmistumista.

Avaa selaimessa:
👉 [http://localhost:3000](http://localhost:3000)

Pysäytys: `Ctrl + C`
Siivous:

```bash
docker compose down
```

---

## 🔧 Kehitys (automaattinen uudelleenkäynnistys)

`docker-compose.yml` käyttää **watch**-toimintoa development-tilassa.
Kun muokkaat koodia hostilla, kontti käynnistyy automaattisesti uudelleen.

Jos muutit **package.json** (riippuvuudet tms.), tee rebuild:

```bash
docker compose down
docker compose build
docker compose up
```

---

## 🌐 Sovelluksen käyttö

* Etusivu: `http://localhost:3000`
  * Kirjoita otsikko ja sisältö → **Lisää muistiinpano**
  * Poista napista **Poista**
* Data tallennetaan MariaDB-tietokantaan ja säilyy uudelleenkäynnistysten yli

---

## 🔌 API-rajapinta

* `GET /api/notes` → Palauttaa kaikki muistiinpanot (JSON)
* `POST /api/notes` → Luo uuden muistiinpanon
  **Body (JSON):**
  ```json
  { 
    "title": "Otsikko", 
    "content": "Sisältö tähän" 
  }
  ```
* `PUT /api/notes/:id` → Päivittää muistiinpanon
  **Body (JSON):**
  ```json
  { 
    "title": "Uusi otsikko", 
    "content": "Uusi sisältö" 
  }
  ```
* `DELETE /api/notes/:id` → Poistaa muistiinpanon id:n perusteella

### 🧪 Nopea testaus cURL:lla

```bash
# Hae kaikki muistiinpanot
curl http://localhost:3000/api/notes

# Luo uusi muistiinpano
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Testi\",\"content\":\"Moikka MariaDB 🌊\"}"

# Päivitä muistiinpano (esim. id=1)
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Päivitetty\",\"content\":\"Uusi sisältö\"}"

# Poista muistiinpano (esim. id=1)
curl -X DELETE http://localhost:3000/api/notes/1
```

---

## ❗ Vianetsintä

* **Portti 3000 varattu**
  Muuta porttikartoitusta `docker-compose.yml`:
  ```yaml
  ports:
    - "3001:3000"
  ```
  Tällöin avaa: `http://localhost:3001`.

* **MariaDB yhteysongelmat**
  Sovellus yrittää yhteyttä 20 kertaa. Jos ei onnistu:
  ```bash
  docker compose logs db
  docker compose logs web
  ```

* **Koodi ei päivity**
  Watch-toiminto päivittää automaattisesti. Jos ei toimi:
  ```bash
  docker compose down
  docker compose up --build
  ```

* **Tietokanta ei säily**
  Data säilyy `db_data` volumessa. Poista volume vain jos haluat tyhjentää:
  ```bash
  docker compose down -v
  ```

  docker compose down
  docker compose up --build

  ```

* **“nodemon not found”**
  Tee rebuild (riippuvuudet asennetaan buildissä):

  ```bash

  docker compose down
  docker compose build
  docker compose up

  ```

---

## 🧰 Aja ilman Dockeria (valinnainen)

```bash
npm install
npm run dev
# selain: http://localhost:3000
```

---

## 📌 MariaDB tietokanta

Sovellus käyttää **MariaDB 11** -tietokantaa **Sequelize ORM**:n kautta.

**Tietokannan rakenne:**
- Taulu: `notes`
- Kentät: `id` (AUTO_INCREMENT), `title`, `content`, `createdAt`, `updatedAt`

**Docker-ympäristössä:**
- Host: `db` (kontin nimi)
- Portti: `3306`
- Tietokanta: `notesdb`
- Käyttäjä: `appuser` / Salasana: `apppass`

Data säilyy Docker volumessa `db_data` ja säilyttää tiedot konttiuudelleenkäynnistysten yli.

---

## 🖼️ Kuvakaappaukset (palautusta varten)

Voit lisätä README:hen esim.:

![Etusivu](Screenshotdo.png)

---

## 🏗️ Tekninen toteutus

- **Backend:** Node.js + Express.js
- **ORM:** Sequelize
- **Tietokanta:** MariaDB 11
- **Frontend:** Vanilla JavaScript (HTML + CSS + JS)
- **Kontiteus:** Docker + Docker Compose
- **Development:** Watch mode automaattisella uudelleenkäynnistyksellä

Onnea matkaan! 💪
