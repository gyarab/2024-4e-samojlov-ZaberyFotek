const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Případné vytvoření tabulek
require('./utilities/dbLoad');

// Import rout pro autentifikaci z authRoutes
const authRoutes = require('./routes/authRoutes');

// Import rout pro použití pieceRoutes
const pieceRoutes = require('./routes/pieceRoutes');

// Inicializace aplikace Express
const app = express();

// Povolení požadavků z jiných domén
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

// Nastavení limitu pro požadavky
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minut
    max: 100, // Limit 100 požadavků na IP během 15 minut
    message: "Překročili jste limit požadavků na server, zkuste to prosím později."
});

// Použití rate limiter pro všechny požadavky
app.use(limiter);

// Parsování příchozích JSON požadavků
app.use(express.json({ limit: '10mb' }));

const env = require('dotenv').config();

// Použití rout pro autentifikaci uživatele
app.use('/auth', authRoutes);

// Použití rout pro práci s jednotlivými klipy a částicemi
app.use('/data', pieceRoutes);

// Spuštění serveru na portu 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});