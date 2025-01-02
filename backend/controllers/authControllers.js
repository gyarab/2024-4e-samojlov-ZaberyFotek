const db = require('../utilities/db');
const { checkData, emailCheck, otpVerification} = require('../utilities/authValidators');

/**
 * Sekce: Přihlášení
 * POST routa pro ověření hesla uživatele pomocí emailu.
 * Endpoint: /loginUser
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
 * Endpoint: /registerUser
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

        emailCheck(db, undefined, email, undefined, res);
    }
};

/**
 * Sekce: Resetování hesla uživatele pomocí OTP
 * Ověření, zda email se nachází v databázi.
 * Endpoint: /resetPassword
 */
const resetPassword = (req, res) => {
    const { otpInput, password1, password2 } = req.body;
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

module.exports = {
    loginUser,
    registerUser,
    validateForgotPassword,
    resetPassword
};