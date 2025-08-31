# Pienempi kuva (alpine)
FROM node:18-alpine

WORKDIR /app

# Kopioi package.json ja package-lock.json
COPY package*.json ./

# Asenna kaikki riippuvuudet (sekä production että dev)
# Development-tilassa tarvitaan nodemon
RUN npm install

# Kopioi lähdekoodi
COPY . .

EXPOSE 3000

# Käynnistä sovellus
CMD ["npm", "start"]
