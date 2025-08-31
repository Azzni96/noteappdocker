# Pienempi kuva (alpine)
FROM node:18-alpine

WORKDIR /app

# Asenna vain tuotantoriippuvuudet
COPY package*.json ./
RUN npm install --omit=dev

# Kopioi lähdekoodi
COPY . .

EXPOSE 3000
# Käynnistä sovellus
CMD ["npm", "start"]
