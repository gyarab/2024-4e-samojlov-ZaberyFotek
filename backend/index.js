const express = require('express');

const cors = require('cors');

const sqlite3 = require('sqlite3').verbose();

//const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');

const app = express();

// Povolení požadavků z jiných domén
app.use(cors());

// Parsování příchozích JSON požadavků
app.use(express.json({ limit: '10mb' }));

// Inicializace SQLite databáze
let db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Chyba při otevírání databáze: ', err.message); // Zalogování chyb při připojení k databázi
    } else {
        console.log('Připojeno k SQLite databázi.');
    }
});

// POST routa pro ověření uživatele pomocí emailu
app.post('/validatePassword', (req, res) => {
    const { email, password } = req.body;

    // Kontrola, zda byly poskytnuty email a heslo
    if (!email || !password) {
        return res.status(400).json({ validation: false, message: 'Email a heslo jsou povinné' });
    }

    // Validace formátu emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ validation: false, message: 'Neplatný formát emailu' });
    }

    // Dotaz na databázi, zda jsou přihlašovací údaje platné
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Chyba databáze:', err.message);
            return res.status(500).json({ validation: false, message: 'Chyba databáze' });
        }

        // Kontrola, zda uživatel existuje a heslo odpovídá
        if (row && row.password === password) {
            return res.status(200).json({ validation: true, message: 'Uživatel ověřen' });
        } else {
            return res.status(401).json({ validation: false, message: 'Neplatný email nebo heslo' });
        }
    });
});


// Spuštění serveru na portu 4000
app.listen(4000, () => {
    console.log('Server běží na portu 4000');
});
