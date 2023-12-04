const express = require('express');
const feed = express.Router();
const db = require('../config/database');

feed.get("/", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const query = `call getFeed('${nombreUsuario}')`;
    try{
        const rows = await db.query(query);
        if (rows[0].length > 0) {
            return res.status(200).json({ code: 200, message: rows[0] });
        } else {
            return res.status(404).json({ code: 404, message: "No hay publicaciones de amigos en el feed." });
        }

    }catch(e){
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = feed;