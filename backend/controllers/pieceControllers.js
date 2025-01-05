const db = require('../utilities/db');

/**
* Sekce: Přidání dat o všech částicích
* POST routa pro přidání dat o částicích do databáze.
* Endpoint: /addPiecesData
*/
const addPiecesData = (req, res) => {
    const {
        id, value, src, width, left, isSubmitted, arrow, duration, special,
        transition, cameraSize, arrowDirection
    } = req.body;

    // Zkontrolovat, zda záznam s tímto ID již existuje
    const checkIdQuery = `SELECT id FROM piece WHERE id = ?`;

    db.get(checkIdQuery, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Chyba při kontrole existence ID', details: err.message });
        }

        if (row) {
            // Pokud ID existuje, vrátíme chybu
            return res.status(400).json({ error: `Záznam s ID ${id} již existuje` });
        }

        // Pokud ID neexistuje, vložíme záznam do tabulky piece
        const insertPieceQuery = `
            INSERT INTO piece (id, value, src, width, left, isSubmitted, arrow, duration, special)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertPieceQuery, [
            id, value, src, width, left, isSubmitted, arrow, duration, special
        ], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Chyba vkládání dat do tabulky piece', details: err.message });
            }

            // Po úspěšném vložení do tabulky piece pokračujeme s přidáním souvisejících dat
            if (transition) {
                const insertTransitionQuery = `
                    INSERT INTO transition (piece_id, coordinateRes, transitionID)
                    VALUES (?, ?, ?)
                `;
                db.run(insertTransitionQuery, [
                    id, transition.coordinateRes, transition.transitionID
                ], function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Chyba vkládání dat do tabulky transition', details: err.message });
                    }

                    // Vkládání transition_idPieces
                    if (transition.idPieces) {
                        const insertTransitionIdPiecesQuery = `
                            INSERT INTO transition_idPieces (piece_id, key, value)
                            VALUES (?, ?, ?)
                        `;
                        for (let key in transition.idPieces) {
                            db.run(insertTransitionIdPiecesQuery, [
                                id, key, transition.idPieces[key]
                            ]);
                        }
                    }
                });
            }

            // Vložení dat do tabulky cameraSize
            const insertCameraSizeQuery = `
                INSERT INTO cameraSize (piece_id, currentIndex, height, width)
                VALUES (?, ?, ?, ?)
            `;
            db.run(insertCameraSizeQuery, [
                id, cameraSize.currentIndex, cameraSize.height, cameraSize.width
            ], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Chyba vkládání dat do tabulky cameraSize', details: err.message });
                }

                // Vložení dat do tabulky arrowDirection
                const insertArrowDirectionQuery = `
                    INSERT INTO arrowDirection (piece_id, x, y)
                    VALUES (?, ?, ?)
                `;
                db.run(insertArrowDirectionQuery, [
                    id, arrowDirection.x, arrowDirection.y
                ], function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Chyba vkládání dat do tabulky arrowDirection', details: err.message });
                    }

                    // Pokud vše proběhne v pořádku, vrátíme úspěšnou odpověď
                    res.status(200).json({ message: 'Data byla úspěšně vložena do tabulky' });
                });
            });
        });
    });
};

module.exports = {
    addPiecesData
};
