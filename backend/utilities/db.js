const sqlite3 = require('sqlite3').verbose();

// Inicializace SQLite databáze
let db = new sqlite3.Database('data.db', (err) => {
    if (err) {
        console.error('Chyba při otevírání databáze: ', err.message);
    } else {
        console.log('Připojeno k SQLite databázi.');
    }
});

module.exports = db;