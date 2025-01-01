const express = require('express');

const cors = require('cors');

const sqlite3 = require('sqlite3').verbose();

//const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');

const app = express();

// Povolení požadavků z jiných domén
app.use(cors());

// Parsování příchozích JSON požadavků
app.use(express.json({limit: '10mb'}));

// Inicializace SQLite databáze
let db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Chyba při otevírání databáze: ', err.message);
    } else {
        console.log('Připojeno k SQLite databázi.');
    }
});

// Kontrola, zda email již existuje
const sqlEmailCheck = 'SELECT * FROM users WHERE email = ?';

/** Metoda pro zkontrolování příslušných údajů **/
const checkData = (type, dataType, res, validationErrors) => {

    if (type === "username") {

        // Počet slov ve vstupu Username
        const usernameWords = dataType.trim().split(/\s+/);

        if (!dataType || usernameWords.length < 2) {

            validationErrors.push({
                field: 'username',
                message: 'Uživatelské jméno musí obsahovat jméno a příjmení'
            });
        }
    } else if (type === "email") {

        // Ověření emailu, zda splňuje formát
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!dataType || !emailRegex.test(dataType)) {
            validationErrors.push({
                field: 'email',
                message: 'Zadaný email není ve správném formátu'
            });
        }

    } else if (type === "password") {

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(dataType)) {

            validationErrors.push({
                field: 'password',
                message: 'Heslo musí obsahovat minimálně osm znaků, včetně písmen (velká a malá), čísel a speciálních znaků'
            });

        } else if (!dataType){

            validationErrors.push({
                field: 'password',
                message: 'Heslo je povinné pole'
            });
        }
    }
}

/** Metoda pro přidání uživatele do tabulky USERS **/
const addUserDB = (username, email, password, res) => {

    const sqlInsert = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sqlInsert, [username, email, password], function(err) {

        if (err) {
            return res.status(500).json({ validation: false, message: 'Chyba při přidávání uživatele do databáze' });
        }

        return res.status(200).json({ validation: true, message: 'Registrace probíhla úspěšně' });
    });
}

/** Ověření, zda se email již nachází v databázi **/
const emailCheck = (db, username, email, password, res) => {

    db.get(sqlEmailCheck, [email], (err, row) => {

        if (err) {
            return res.status(500).json({ validation: false, message: 'Chyba databáze' });
        }
        if (row) {
            return res.status(409).json({ validation: false, message: 'Tento email je již zaregistrovaný' });

        } else {

            addUserDB(username, email, password, res);
        }
    });
}

/**
 * Sekce: Přihlášení
 * POST routa pro ověření hesla uživatele pomocí emailu.
 * Endpoint: /validateForgotPassword
 */
app.post('/validatePassword', (req, res) => {
    const {email, password} = req.body;

    checkData("email", email, res);
    checkData("password", password, res);

    // Dotaz na databázi, zda jsou přihlašovací údaje platné
    db.get(sqlEmailCheck, [email], (err, row) => {

        if (err) {

            return res.status(500).json({validation: false, message: 'Chyba databáze'});
        }

        // Kontrola, zda uživatel existuje a heslo odpovídá
        if (row && row.password === password) {
            return res.status(200).json({validation: true, message: 'Uživatel ověřen'});
        } else {
            return res.status(401).json({validation: false, message: 'Neplatný email nebo heslo'});
        }
    });
});

/**
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /validateForgotPassword
 */
app.post('/addUser', (req, res) => {
    const { username, email, password } = req.body;
    let validationErrors = [];

    checkData("username",username, res, validationErrors);
    checkData("email",email, res, validationErrors);
    checkData("password",password, res, validationErrors);

    if (validationErrors.length > 0) {
        return res.status(400).json({
            validation: false,
            errors: validationErrors
        });
    } else {

        emailCheck(db, username, email, password, res)
    }
});



/**
 * Sekce: Zapomenuté heslo
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /validateForgotPassword
 */
app.post('/validateForgotPassword', (req, res) => {
    const {email} = req.body;

    checkData("email", email, res);
});


// Spuštění serveru na portu 4000
app.listen(4000, () => {
    console.log('Server běží na portu 4000');
});
