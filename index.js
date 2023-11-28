const express = require('express');
const app = express();
//middlewares
const auth = require('./middleware/auth');
const corsMiddleware = require('./middleware/cors');
//routes
user = require('./routes/user');
rate = require('./routes/rate');
home = require('./routes/home');
favorites = require('./routes/favorites');
artist = require('./routes/artist');
album = require('./routes/album');
profile = require('./routes/profile');
search = require('./routes/search');
post = require('./routes/post');

app.use(corsMiddleware);
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
app.use('/artist', artist);
app.use('/album', album);
app.use('/profile', profile);
app.use('/search', search);
app.use('/post', post);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});