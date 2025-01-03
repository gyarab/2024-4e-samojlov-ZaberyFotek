const express = require('express');
const { registerUser, validateForgotPassword, loginUser, resetPassword} = require('../controllers/authControllers');

// Vytvoření nového routeru
const router = express.Router();

// Definování POST rout
router.post('/loginUser', loginUser);
router.post('/registerUser', registerUser);
router.post('/validateForgotPassword', validateForgotPassword);
router.post('/resetPassword', resetPassword);

// Export routeru pro použití v jiných souborech
module.exports = router;