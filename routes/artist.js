const express = require('express');
const jwt = require('jsonwebtoken');
const artist = express.Router();
const db = require('../config/database');

artist.get("/:idAutor([0-9]{1,3})", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const idAutor = req.params.idAutor;
    const Autor = `SELECT * FROM Autores WHERE idAutor = '${idAutor}'`;
    const Canciones = `CALL getArtistSongs('${idAutor}', '${nombreUsuario}')`;
    const Albums = `SELECT * FROM Albumes WHERE idAutor = '${idAutor}' ORDER BY fechaLanzamiento DESC`;
    try{
        const rows = await db.query(Autor);
        const rows2 = await db.query(Canciones);
        const rows3 = await db.query(Albums);
        if (rows.length > 0) {
            return res.status(200).json({ code: 200, message: {autor: rows[0], canciones: rows2[0], albums: rows3[0]}});
        } else {
            return res.status(404).json({ code: 404, message: "Artista no encontrado" });
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = artist;