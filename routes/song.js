const express = require('express');
const song = express.Router();
const db = require('../config/database');

song.get("/:idCancion", async (req, res, next) => {
    const idCancion = req.params.idCancion;
    const userName = req.user.nombreUsuario;
    const songDetails = `call getSongDetails('${idCancion}')`;
    const songPosts = `call getSongPosts('${idCancion}', '${userName}')`;
    try{
        const rows = await db.query(songDetails);
        if (rows[0].length > 0) {
            const rows2 = await db.query(songPosts);
            return res.status(200).json({ code: 200, message: {song: rows[0], posts: rows2[0]} });
        } else {
            return res.status(404).json({ code: 404, message: "No hay coincidencias" });
        }
    } catch(e){
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = song;