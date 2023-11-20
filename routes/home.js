const express = require('express');
const home = express.Router();
const db = require('../config/database');

home.get("/banner", async (req, res, next) => {
    const query = `SELECT * FROM artistasMasPopulares`;
    const rows = await db.query(query);
    console.log(rows);
    
    if (rows.length > 0) {
        return res.status(200).json({ code: 200, message: rows[0]});
    } else {
        return res.status(404).json({ code: 404, message: "No hay artistas populares" });
    }
});

home.get("/trending", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const query = `call getTrendingSongs('${nombreUsuario}')`;
    try{
        const rows = await db.query(query);
        if (rows[0].length > 0) {
            return res.status(200).json({ code: 200, message: rows[0] });
        } else {
            return res.status(404).json({ code: 404, message: "No hay canciones trending" });
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

home.get("/toprated", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const query = `call getTopRatedSongs('${nombreUsuario}')`;
    try{
        const rows = await db.query(query);
        if (rows[0].length > 0) {
            return res.status(200).json({ code: 200, message: rows[0] });
        } else {
            return res.status(404).json({ code: 404, message: "No hay canciones populares" });
        }
        } catch(e) {
            console.log(e);
            return res.status(500).json({ code: 500, message: "Ocurrió un error" });
        }
});

home.get("/recommended", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const query = `call GetRecommendedSongs('${nombreUsuario}')`;
    try {
        const rows = await db.query(query);
        console.log(rows);
        if (rows[0].length > 0) {
            return res.status(200).json({ code: 200, message: rows[0]});
        } else {
            return res.status(404).json({ code: 404, message: "No hay canciones recomendadas" });
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = home;
// url /home