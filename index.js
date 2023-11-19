const express = require('express');
const app = express();
//middlewares
const auth = require('./middleware/auth');

//routes
user = require('./routes/user');
rate = require('./routes/rate');
home = require('./routes/home');
favorites = require('./routes/favorites');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => {
  return res.status(200).json({ message: 'Hola mundo' });
});

app.use('/user', user);
app.use(auth);
app.use('/rate', rate);
app.use('/home', home);
app.use('/favorites', favorites);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});