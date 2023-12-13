const express = require('express');
const album = express.Router();
const db = require('../config/database');
// Defining a GET route for fetching an album by its ID
album.get("/:idAlbum([0-9]{1,3})", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const idAlbum = req.params.idAlbum;
    const album = `CALL getAlbum('${idAlbum}')`;
    const canciones = `CALL getAlbumSongs('${idAlbum}', '${nombreUsuario}')`;
    try{
        const rows = await db.query(album);
        const rows2 = await db.query(canciones);
        if (rows[0].length > 0) {
            return res.status(200).json({ code: 200, message: {album: rows[0], canciones: rows2[0]}});
        } else {
            return res.status(404).json({ code: 404, message: "Album no encontrado" });
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = album;