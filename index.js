const mongoose = require('mongoose');
// const Joi = require('joi');
require("dotenv").config();
const config = require('config');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();

console.log(process.env.vidly_jwtPrivateKey);
if (!config.has('jwtPrivateKey')) {
    console.error('FATAL ERORR: jwtPrivateKey is not defined.');
    process.exit(1);
}


mongoose.connect('mongodb://localhost/vidly')
    .then(()=>console.log('Connected to MongoDB...'))
    .catch((err)=>console.error('Could not connect to MongoDB...'))

app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);


const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`Listening on port ${port}...`));