const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {validateRental, Rental} = require("../models/rental");
const{Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const Fawn = require('fawn');
const {number} = require("joi");

Fawn.init("mongodb://localhost/vidly");
// Fawn.init("mongodb://127.0.0.1:27017/vidly");

router.get('/', async (req, res) => {
    const rentals = await Rental.find();
    if(rentals.length === 0){
        return res.status(404).send('is empty');
    }
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const {error} = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) res.status(404).send('There is no customer with the given id');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) res.status(404).send('There is no movie with the given id');

    let rental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie:{
            _id: movie._id,
            title:movie.title,
            genre:movie.genre,
            numberInStock:movie.numberInStock,
            dailyRentalRate:movie.dailyRentalRate,
        },
        releaseDate:req.body.releaseDate,
        returnDate:req.body.returnDate
    });

    // try {
    //      new Fawn.Task()
    //         .save('rentals', rental)
    //         .update('movies',{_id:movie._id},{
    //             $inc:{numberInStock:-1}
    //     })
    //     .run();
    //
    //     res.send(rental);
    // }catch (ex){
    //     res.status(500).send('Something failed...')
    // }
    // for(let numberRental = 0; numberRental < movie.numberInStock; numberRental++) {
    //     // if (movie.numberInStock > numberRental) {
    //         rental = await rental.save();
    //         res.send(rental);
    //
    //     return res.status(400).send('There is no movie in stock');
    // }
    for ( numberRental = 0; numberRental < movie.numberInStock; numberRental++) {
        rental = await rental.save();
        res.send(rental);
        if(movie.numberInStock === 0 || movie.numberInStock <= numberRental){
            console.log("there is no movie");
        }
        return;
    }return res.status(400).send('There is no movie in stock');
});

module.exports = router;