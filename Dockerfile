# ----- TAHAP 1: BUILDER -----
# Tahap ini untuk menginstall semua dependensi (termasuk dev) dan kompilasi TS -> JS
FROM node:18-alpine AS builder

WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install SEMUA dependensi, termasuk devDependencies (seperti typescript, ts-node, nodemon)
RUN npm install

# Salin sisa kode sumber
COPY . .

# Kompilasi TypeScript ke JavaScript di folder /dist
RUN npm run build


# ----- TAHAP 2: PRODUCTION -----
# Tahap ini adalah image akhir yang akan digunakan, lebih kecil dan aman
FROM node:18-alpine

WORKDIR /app

# Salin package.json dan package-lock.json lagi
COPY package*.json ./

# Install HANYA dependensi untuk production
RUN npm install --omit=dev

# Salin hasil build JavaScript dari tahap 'builder'
COPY --from=builder /app/dist ./dist

# Port yang akan diekspos
EXPOSE 3000

# Perintah untuk menjalankan aplikasi JavaScript yang sudah di-build
# Untuk development, kita akan override command ini di docker-compose
CMD ["node", "dist/index.js"]