const express = require('express');
const app = express();
//hacerlo en otro archivo en caso de requerirlo
const db = require('./config/database');

app.get('/', async (req, res, next) => {
  //checar la conexion y funcionalidad de la bd, agregar datos a la bd
  return res.status(200).json({ message: 'Hola mundo' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});