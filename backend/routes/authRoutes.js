const express = require('express');
const { registerUser, validateForgotPassword, loginUser, resetPassword, changePersonalData} = require('../controllers/authControllers');

// Vytvoření nového routeru
const router = express.Router();

// Definování POST rout
router.post('/loginUser', loginUser);
router.post('/registerUser', registerUser);
router.post('/validateForgotPassword', validateForgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/changePersonalData', changePersonalData);
// router.post('/selectUserData', selectUserData);

// Export routeru pro použití v jiných souborech
module.exports = router;