const express = require('express');
const profile = express.Router();
const db = require('../config/database');

profile.get("/:userName", async (req, res, next) => {
    const userName = req.params.userName;
    try{
        const profile = `SELECT nombreUsuario, profilePic FROM Usuarios WHERE nombreUsuario = '${userName}'`;
        const followers = `CALL countFollowers('${userName}')`;
        const following = `CALL countFollowing('${userName}')`;
        const rates = `CALL getUserPublications('${userName}')`;
        const rows = await db.query(profile);
        if (rows.length > 0) {
            const rows2 = await db.query(followers);
            const rows3 = await db.query(following);
            const rows4 = await db.query(rates);
            return res.status(200).json({ code: 200, message: {profile: rows[0], followers: rows2[0], following: rows3[0], rates: rows4[0]}});
        } else {
            return res.status(404).json({ code: 404, message: "Usuario no encontrado" });
        }
    
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

profile.patch("/:userName", async (req, res, next) => {
    const userName = req.params.userName;
    const {profilePic} = req.body;
    if (userName && profilePic) {
        let query = `UPDATE Usuarios SET  profilePic = '${profilePic}' WHERE nombreUsuario = '${userName}'`;
        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Usuario actualizado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});
module.exports = profile;