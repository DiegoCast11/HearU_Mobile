const express = require('express');
const favorites = express.Router();
const db = require('../config/database');

favorites.post("/", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const { idCancion } = req.body;
    const query = `CALL addToFavorites('${nombreUsuario}', '${idCancion}')`;
    try{
        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Cancion agregada a favoritos" });
        } else {
            return res.status(404).json({ code: 404, message: "Cancion no encontrada" });
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

favorites.delete("/", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const { idCancion } = req.body;
    const query = `CALL removeFromFavorites('${nombreUsuario}', '${idCancion}')`;
    try{
        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Cancion eliminada de favoritos" });
        } else {
            return res.status(404).json({ code: 404, message: "Cancion no encontrada" });
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = favorites;