const db = require('../utilities/db');
const {checkData,
    emailCheck,
    otpVerification,
    updateUserData} =
    require('../utilities/authValidators');

/**
 * Sekce: Přihlášení
 * POST routa pro ověření hesla uživatele pomocí emailu.
 * Endpoint: /loginUser
 */
const loginUser = (req, res) => {

    const {email, password} = req.body;

    let validationErrors = [];

    checkData("email", email, res, validationErrors);
    checkData("password", password, res, validationErrors);

    if (validationErrors.length > 0) {
        return res.status(400).json({
            validation: false,
            errors: validationErrors
        });
    } else {

        emailCheck(db, null, email, password, null, null, res)
    }
};

/**
 * Sekce: Registrace
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /registerUser
 */
const registerUser = (req, res) => {

    const {username, email, password, type, image} = req.body;
    let validationErrors = [];

    // Speciální případ - Google OAuth
    if (password === '-1') {

        emailCheck(db, username, email, password, type, image, res);
    } else {

        checkData("username", username, res, validationErrors);
        checkData("email", email, res, validationErrors);
        checkData("password", password, res, validationErrors);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                validation: false,
                errors: validationErrors
            });
        } else {

            emailCheck(db, username, email, password, type, image, res)
        }
    }
};

/**
 * Sekce: Zapomenuté heslo
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /validateForgotPassword
 */
const validateForgotPassword = (req, res) => {
    const {email} = req.body;
    let validationErrors = [];

    checkData("email", email, res, validationErrors);

    if (validationErrors.length > 0) {
        return res.status(400).json({
            validation: false,
            errors: validationErrors
        });
    } else {

        emailCheck(db, undefined, email, undefined, null, null, res);
    }
};

/**
 * Sekce: Resetování hesla uživatele pomocí OTP
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /resetPassword
 */
const resetPassword = (req, res) => {
    const {otpInput, password1, password2} = req.body;
    let validationErrors = [];

    checkData("otp", otpInput, res, validationErrors);
    checkData("password", password1, res, validationErrors);
    checkData("password", password2, res, validationErrors);

    if (password1 !== password2) {

        return res.status(400).json({
            validation: false,
            message: 'Zadaná hesla nejsou shodná'
        });
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({
            validation: false,
            errors: validationErrors
        });
    } else {

        otpVerification(db, null, null, password1, otpInput, res)
    }
};

/**
 * Sekce: Změna typu údajů uživatele
 * Endpoint: /changePersonalData
 */
const changePersonalData = (req, res) => {

    const {type, username, email, inputData} = req.body;
    let validationErrors = [];

    if (type === 'username') {

        checkData("username", inputData, res, validationErrors);

    } else {

        checkData("email", email, res, validationErrors);
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({
            validation: false,
            errors: validationErrors
        });
    } else {

        // Aktualizace dat uživatele na stránce Účet
        updateUserData(db, type, username, email, inputData, res);
    }
};

// /**
//  * Sekce: Získání všech dat o uživateli
//  * Endpoint: /changePersonalData
//  */
// const selectUserData = (req, res) => {
//
//     const {email} = req.body;
//
//     const sqlEmailCheck = 'SELECT * FROM user WHERE email = ?';
//
//     db.get(sqlEmailCheck, [email], (err, row) => {
//
//         if (err) {
//             return res.status(500).json({validation: false, message: 'Chyba databáze'});
//         }
//
//         if (!row) {
//             return res.status(404).json({ validation: false, message: 'User not found' });
//         }
//
//         return res.status(200).json({
//             validation: true,
//             user: row
//         });
//     });
// };

module.exports = {
    loginUser,
    registerUser,
    validateForgotPassword,
    resetPassword,
    changePersonalData,
    // selectUserData
};