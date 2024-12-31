const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

// Povolení požadavků z jiných domén
app.use(cors());

// Parsování příchozích JSON požadavků
app.use(express.json({ limit: '10mb' }));

// Inicializace SQLite databáze
let db = new sqlite3.Database('credentials.db', (err) => {
    if (err) {
        console.error('Chyba při otevírání databáze: ', err.message); // Zalogování chyb při připojení k databázi
    } else {
        console.log('Připojeno k SQLite databázi.');
    }
});

// POST routa pro ověření hesla
app.post('/validatePassword', (req, res) => {
    const { username, password } = req.body;

    // Kontrola, zda jsou poskytnuty uživatelské jméno a heslo
    if (!username || !password) {
        return res.status(400).json({ validation: false, message: 'Uživatelské jméno a heslo jsou povinné.' });
    }

    // Dotaz na ověření přihlašovacích údajů v databázi
    db.get('SELECT * FROM credentials WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error('Chyba databáze: ', err.message);
            return res.status(500).json({ validation: false, message: 'Chyba databáze' });
        }

        if (row) {
            // Odeslání odpovědi při úspěšném ověření
            res.status(200).json({ validation: true, message: 'Uživatel ověřen' });
        } else {
            // Odeslání odpovědi při neúspěšném ověření
            res.status(401).json({ validation: false, message: 'Neplatné uživatelské jméno nebo heslo' });
        }
    });
});

// Spuštění serveru na portu 4000
app.listen(4000, () => {
    console.log('Server běží na portu 4000');
});
