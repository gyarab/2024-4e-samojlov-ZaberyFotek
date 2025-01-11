const express = require('express');
const { addPiecesData, getClips } = require('../controllers/pieceControllers');

// Vytvoření nového routeru
const router = express.Router();

// Definování POST rout
router.post('/addClip', addPiecesData);
router.post('/getClips', getClips);

// Export routeru pro použití v jiných souborech
module.exports = router;