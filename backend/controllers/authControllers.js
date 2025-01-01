const db = require('../utilities/db');
const { checkData, emailCheck } = require('../utilities/authValidators');

/**
 * Sekce: Přihlášení
 * POST routa pro ověření hesla uživatele pomocí emailu.
 * Endpoint: /validateForgotPassword
 */
const loginUser = (req, res) => {

    const {email, password} = req.body;

    let validationErrors = [];

    checkData("email",email, res, validationErrors);
    checkData("password",password, res, validationErrors);

    if (validationErrors.length > 0) {
        return res.status(400).json({
            validation: false,
            errors: validationErrors
        });
    } else {

        emailCheck(db, null, email, password, res)
    }
};

/**
 * Sekce: Registrace
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /validateForgotPassword
 */
const registerUser = (req, res) => {

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
};

/**
 * Sekce: Zapomenuté heslo
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /validateForgotPassword
 */
const validateForgotPassword = (req, res) => {
    const { email } = req.body;
    let validationErrors = [];

    checkData("email",email, res, validationErrors);

    if (validationErrors.length > 0) {
        return res.status(400).json({
            validation: false,
            errors: validationErrors
        });
    } else {

        emailCheck(db, undefined, email, undefined, res)
    }
};

module.exports = {
    loginUser,
    registerUser,
    validateForgotPassword
};