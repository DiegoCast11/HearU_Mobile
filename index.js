const express = require('express');
const app = express();
//hacerlo en otro archivo en caso de requerirlo
const db = require('./config/database');

//routes
user = require('./routes/user');
rate = require('./routes/rate');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => {
  return res.status(200).json({ message: 'Hola mundo' });
});

app.use('/user', user);
app.use('/rate', rate);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});