const express = require('express');
const search = express.Router();
const db = require('../config/database');

search.get("/:item", async (req, res, next) => {
    const item = req.params.item;
    const query = `call search('${item}')`;
    try{
        const rows = await db.query(query);
        if (rows[0].length > 0) {
            return res.status(200).json({ code: 200, message: rows[0] });
        } else {
            return res.status(404).json({ code: 404, message: "No hay coincidencias" });
        }
}
    catch(e){
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = search;