const express = require('express');
const { addPiecesData } = require('../controllers/pieceControllers');

// Vytvoření nového routeru
const router = express.Router();

// Definování POST rout
router.post('/addPiecesData', addPiecesData);

// Export routeru pro použití v jiných souborech
module.exports = router;