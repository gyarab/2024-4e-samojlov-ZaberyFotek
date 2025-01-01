const db = require('../utilities/db');

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

        } else if (!dataType) {

            validationErrors.push({
                field: 'password',
                message: 'Heslo je povinné pole'
            });
        }
    }
}

/** Ověření, zda se email již nachází v databázi **/
const emailCheck = (db, username, email, password, res) => {

    db.get(sqlEmailCheck, [email], (err, row) => {

        if (err) {
            return res.status(500).json({validation: false, message: 'Chyba databáze'});
        }

        // Endpoint: /loginUser
        if (username === null) {

            // Kontrola, zda uživatel existuje a heslo odpovídá
            if (row && row.password === password) {
                return res.status(200).json({validation: true, message: 'Přihlášení proběhlo úspěšně'});
            } else {
                return res.status(401).json({validation: false, message: 'Neplatný email nebo heslo'});
            }
        } else {

            // Endpoint: /validateForgotPassword
            if (username === undefined && password === undefined) {

                if (!row) {
                    return res.status(409).json({validation: false, message: 'Tento email není zaregistrovaný'});
                }
                resetPasswordMessage(email, res, 1468);

                // Endpoint: /register
            } else {

                if (row) {
                    return res.status(409).json({validation: false, message: 'Tento email je již zaregistrovaný'});
                }
                addUserDB(username, email, password, res);
            }
        }
    });
}

/** Příslušné metody k Endpointu **/

/** Metoda pro přidání uživatele do tabulky USERS **/
const addUserDB = (username, email, password, res) => {

    const sqlInsert = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sqlInsert, [username, email, password], function (err) {

        if (err) {
            return res.status(500).json({validation: false, message: 'Chyba při přidávání uživatele do databáze'});
        }

        return res.status(200).json({validation: true, message: 'Registrace probíhla úspěšně'});
    });
}

/** Odeslání zpráva s odkazem pro obnovení hesla **/
const resetPasswordMessage = (email, res, OTP) => {

    // Knihovna pro odesílání e-mailů
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.PERSONAL_EMAIL,
            pass: process.env.PERSONAL_PASSWORD,
        },
    });

    console.log("Email:", process.env.PERSONAL_EMAIL);
    console.log("Password:", process.env.PERSONAL_PASSWORD);

    const emailConfig = {
        from: process.env.PERSONAL_EMAIL,
        to: email,
        subject: "Resetování hesla",
        html:

            `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Resetování hesla</title>
</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Vladimír Samojlov</a>
    </div>
    <p style="font-size:1.1em">Dobrý den,</p>
    <p>Použijte následující OTP k dokončení procesu obnovení hesla. OTP je platné po dobu 5 minut.</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">S pozdravem,<br />Vladimír Samojlov</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
   
    </div>
  </div>
</div>

</body>
</html>`,
    };

    transporter.sendMail(emailConfig, function (error, info) {
        if (error) {
            console.error("Email sending error:", error);  // Log the error
            return res.status(500).json({ validation: false, message: 'Chyba při odeslání zprávy', error: error.message });
        }
        return res.status(200).json({validation: true, message: 'Email byl úspěšně odeslán'});
    });
}

module.exports = {
    checkData,
    emailCheck
};