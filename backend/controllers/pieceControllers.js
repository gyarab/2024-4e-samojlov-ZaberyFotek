const db = require('../utilities/db');

/**
 * Sekce: Přidání dat o všech částicích
 * POST routa pro přidání dat o částicích do databáze.
 * Endpoint: /addClip
 */
const addPiecesData = (req, res) => {

    const {user_id, name, description, pieces, src, poster} = req.body;

    console.log("DATA", user_id, name, description);

    // Kontrola povinných polí
    if (!user_id || !name || !pieces || !Array.isArray(pieces)) {
        return res.status(400).json({
            error: "Missing required fields: user_id, name, or pieces (must be an array)."
        });
    }

    const videoBuffer = Buffer.from(src.split(',')[1], 'base64');

    const createdAt = new Date().toISOString();

    // Transakční logika pro přidání klipu a jeho částic
    //db.run("BEGIN TRANSACTION");

    // Přidání klipu
    const insertClipQuery = `
      INSERT INTO clips (user_id, name, description, created_at, src, poster) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(insertClipQuery, [user_id, name, description, createdAt, videoBuffer, poster], function (err) {
        if (err) {
            console.error("Error adding clip:", err);
            //db.run("ROLLBACK");
            return res.status(500).json({error: "Failed to add clip."});
        }

        // ID vytvořeného klipu
        const clipId = this.lastID;

        // Vložení částic a jejich vazeb
        const insertPieceQuery = `
        INSERT INTO piece (value, src, width, left, isSubmitted, arrow, duration, special)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
        const insertTransitionQuery = `
        INSERT INTO transition (piece_id, coordinateRes, transitionID)
        VALUES (?, ?, ?)
      `;
        const insertTransitionIdPiecesQuery = `
        INSERT INTO transition_idPieces (piece_id, key, value)
        VALUES (?, ?, ?)
      `;
        const insertCameraSizeQuery = `
        INSERT INTO cameraSize (piece_id, currentIndex, height, width)
        VALUES (?, ?, ?, ?)
      `;
        const insertArrowDirectionQuery = `
        INSERT INTO arrowDirection (piece_id, x, y)
        VALUES (?, ?, ?)
      `;
        const insertClipPieceQuery = `
        INSERT INTO clip_pieces (clip_id, piece_id)
        VALUES (?, ?)
      `;

        let hasError = false;

        pieces.forEach((piece) => {
            const {
                value, src, width, left, isSubmitted, arrow, duration, special,
                transition, cameraSize, arrowDirection
            } = piece;

            //console.log(piece)

            // if (!value || !src || !width || !left || !arrow || !duration || !special) {
            //     hasError = true;
            //     console.error("Missing required piece fields.");
            //     return;
            // }

            // Přidání částice
            db.run(insertPieceQuery, [value, src, width, left, isSubmitted, arrow, duration, special], function (err) {
                if (err) {
                    console.error("Error adding piece:", err);
                    hasError = true;
                    return;
                }

                // ID vytvořené částice
                const pieceId = this.lastID;

                // Přidání přechodů (transition)
                if (transition) {
                    db.run(insertTransitionQuery, [pieceId, transition?.coordinateRes, transition?.transitionID], function (err) {
                        if (err) {
                            console.error("Error adding transition:", err);
                            hasError = true;
                            return;
                        }

                        // Přidání idPieces k přechodům
                        const transitionId = this.lastID;

                        if (transition.idPieces) {

                            Object.entries(transition.idPieces).forEach(([key, value]) => {

                                console.log("KEY", key, value)

                                if (key !== undefined && value !== undefined) {
                                    db.run(insertTransitionIdPiecesQuery, [transitionId, key, value], (err) => {
                                        if (err) {
                                            console.error("Error adding transition idPiece:", err);
                                            hasError = true;
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                // Přidání velikosti kamery (cameraSize)
                if (cameraSize) {
                    db.run(insertCameraSizeQuery, [pieceId, cameraSize?.currentIndex, cameraSize?.height, cameraSize?.width], (err) => {
                        if (err) {
                            console.error("Error adding camera size:", err);
                            hasError = true;
                        }
                    });
                }

                // Přidání směru šipky (arrowDirection)
                if (arrowDirection) {
                    db.run(insertArrowDirectionQuery, [pieceId, arrowDirection?.x, arrowDirection?.y], (err) => {
                        if (err) {
                            console.error("Error adding arrow direction:", err);
                            hasError = true;
                        }
                    });
                }

                // Vazba mezi klipem a částicí
                db.run(insertClipPieceQuery, [clipId, pieceId], (err) => {
                    if (err) {
                        console.error("Error linking piece to clip:", err);
                        hasError = true;
                    }
                });
            });
        });

        // Dokončení transakce
        if (hasError) {
            //db.run("ROLLBACK");
            return res.status(500).json({error: "Failed to add clip with pieces."});
        }

        // db.run("COMMIT", (err) => {
        //     if (err) {
        //         console.error("Error committing transaction:", err);
        //         return res.status(500).json({error: "Failed to commit transaction."});
        //     }
        //     res.status(201).json({message: "Clip and pieces added successfully.", clip_id: clipId});
        // });
        res.status(201).json({message: "Clip and pieces added successfully.", clip_id: clipId});
    });
};

/**
 * Sekce: Získání všech klipů daného uživatele
 * Endpoint: /getClips
*/
const getClips = (req, res) => {
    const { user_id } = req.body;

    console.log("ID", user_id);

    let query = `SELECT * FROM clips`;
    const params = [];

    if (user_id) {
        query += ` WHERE user_id = ?`;
        params.push(user_id);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Error fetching clips:", err);
            console.log(err);
            return res.status(500).json({ error: "Failed to fetch clips." });
        }

        const clipsData = rows.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            src: `data:video/mp4;base64,${row.src.toString('base64')}`,
        }));

        return res.status(200).json({ clips: clipsData });
    });
};

module.exports = {
    addPiecesData,
    getClips
};
