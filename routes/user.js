const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/database');

user.post("/signin", async (req, res, next) => {
    const { nombreUsuario, nombre, correo, contrasena } = req.body;

    if (nombreUsuario && nombre && correo && contrasena) {
        const checkUsername = `SELECT * FROM usuarios WHERE nombreUsuario = '${nombreUsuario}'`;
        const checkEmail = `SELECT * FROM usuarios WHERE correo = '${correo}'`;

        try{
            const existingUsername = await db.query(checkUsername);
            const existingEmail = await db.query(checkEmail);
            if (existingUsername.length > 0) {
                return res.status(409).json({ code: 409, message: "Lo sentimos, nombre de usuario en uso " });
            } else if (existingEmail.length > 0) {
                return res.status(409).json({ code: 409, message: "Correo ya esta registrado, quieres iniciar sesion con esta cuenta?" });
            }

            let query = "INSERT INTO usuarios(nombreUsuario, nombre, correo, contrasena) ";
            query += `VALUES ('${nombreUsuario}', '${nombre}', '${correo}', '${contrasena}')`;
            const rows = await db.query(query);

            if (rows.affectedRows == 1) {
                return res.status(201).json({ code: 201, message: "Usuario registrado correctamente" });
            } 
        } catch(e) {
            console.log(e);
            return res.status(500).json({ code: 500, message: "Ocurrió un error" });
        }  
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

user.post("/login", async (req, res, next) => {
    const { nombreUsuario, contrasena } = req.body;
    const query = `SELECT * FROM usuarios WHERE nombreUsuario = '${nombreUsuario}' AND contrasena = '${contrasena}'`;
    const rows = await db.query(query);

    if (nombreUsuario && contrasena) {
        if (rows.length == 1) {
            const token = jwt.sign({
                user_id: rows[0].id,
                nombreUsuario: rows[0].nombreUsuario
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token });
        } else {
            return res.status(401).json({ code: 401, message: "Usuario y/o contraseña incorrectos" });
        }
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});
module.exports = user;