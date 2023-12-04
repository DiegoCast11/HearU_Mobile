const express = require('express');
const post = express.Router();
const db = require('../config/database');

post.get("/:idPost", async (req, res, next) => {
    const idPost = req.params.idPost;
    const query = `call getPostInfo('${idPost}')`;
    const query2 = `call getPostComments('${idPost}')`;
    try{
        const rows = await db.query(query);
        if (rows[0].length > 0) {
            const rows2 = await db.query(query2);
            return res.status(200).json({ code: 200, message: {post: rows[0], comments: rows2[0]} });
        } else {
            return res.status(404).json({ code: 404, message: "No hay coincidencias" });
        }
} catch(e){
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

post.post("/:idPost", async (req, res, next) => {
    const username = req.user.nombreUsuario;
    const idPost = req.params.idPost;
    const {comment, comentarioPadre} = req.body;
    let query;
    if(!comentarioPadre){
        query = `call addComment('${username}', '${idPost}', '${comment}', null)`;
    } else{
        query = `call addComment('${username}', '${idPost}', '${comment}', ${comentarioPadre})`;
    }
    try{
        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Comentario agregado correctamente" });
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    }
});

module.exports = post;