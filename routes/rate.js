const express = require('express');
const rate = express.Router();
const db = require('../config/database');

//get route to get song info for rate page
rate.get("/:idCancion([0-9]{1,3})", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const idCancion = req.params.idCancion;
    try{
        const query = `CALL getSongInfo('${idCancion}', '${nombreUsuario}')`;
        const rows = await db.query(query);
        if (rows[0].length > 0) {
            return res.status(200).json({ code: 200, message: rows[0][0] });
        } else {
            return res.status(404).json({ code: 404, message: "Song not found" });
        }
    
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }

});
// POST route for publishing a new rate with a song
rate.post("/:idCancion([0-9]{1,3})", async (req, res, next) => {
    const nombreUsuario = req.user.nombreUsuario;
    const { score, descripcion} = req.body;
    const idCancion = req.params.idCancion;
    //obtener id album y autor mediante consulta sql de la cancion
    const getSongInfo = `CALL getCancionInfo('${idCancion}')`;
    const rows = await db.query(getSongInfo);
    
    const idAlbum = rows[0][0].idAlbum;
    const idAutor = rows[0][0].idAutor;
    const fecha = new Date();
    const year = fecha.getFullYear();  // Obtener el año
    const month = fecha.getMonth() + 1;  // Obtener el mes (se suma 1 porque los meses comienzan desde 0)
    const day = fecha.getDate();  // Obtener el día del mes
    const hours = fecha.getHours();  // Obtener la hora
    const minutes = fecha.getMinutes();  // Obtener los minutos
    const seconds = fecha.getSeconds();  // Obtener los segundos
    const fechaPublicacion = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    try{
        const query = `CALL publishRate('${nombreUsuario}', '${fechaPublicacion}', '${score}', '${descripcion}', '${idAlbum}', '${idCancion}', '${idAutor}')`;
        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Rate publicado correctamente" });
        }
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = rate;