const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

//const bodyParser = require('body-parser');

// Import rout pro autentifikaci z authRoutes
const authRoutes = require('./routes/authRoutes');

// Inicializace aplikace Express
const app = express();

// Povolení požadavků z jiných domén
app.use(cors());

// Parsování příchozích JSON požadavků
app.use(express.json({limit: '10mb'}));

const env = require('dotenv').config();

// Použití rout pro autentifikaci uživatele
app.use('/auth', authRoutes);

// Spuštění serveru na portu 4000
app.listen(4000, () => {
    console.log('Server běží na portu 4000');
});