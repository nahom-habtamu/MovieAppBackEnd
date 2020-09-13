const express = require('express');
const config = require('config');
const connect = require('./connectToMongo');
connect('MovieAppDb');


if(!config.get("jwtPrivateKey")){
    console.error("FATAL ERROR : Private Key is not defined");
    process.exit(1);
};


const genres = require('./routes/genres');
const producers = require('./routes/producers');
const movies = require('./routes/movies');
const trailers = require('./routes/trailers');
const customers = require('./routes/customers');
const users = require('./routes/users');
const admins = require('./routes/admins');
const auth = require('./routes/auth');


const app = express();

// middlewares 
app.use(express.json());

// routes 
app.use('/api/genres', genres);
app.use('/api/producers', producers);
app.use('/api/movies', movies);
app.use('/api/trailers', trailers);
app.use('/api/customers', customers);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/admins', admins);


app.use(express.static('uploads'));



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('API running on port ' + port);
});