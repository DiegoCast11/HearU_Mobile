const express = require('express');
const rate = express.Router();
const db = require('../config/database');
//hacer get para obtener info de la cancion
//hacer post para agregar un rate
rate.get("/", async (req, res, next) => {
    const date = new Date();
    console.log(date)
    return res.status(200).json({ message: 'Hola mundo' });
});

rate.post("/:idCancion", async (req, res, next) => {
    const { nombreUsuario, score, descripcion} = req.body;
    const idCancion = req.params.idCancion;
    //obtener id album y autor mediante consulta sql de la cancion
    const getSongInfo = `CALL getSongInfo('${idCancion}')`;
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

    //agregar pubicacion a bd 
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