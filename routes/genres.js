const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');


// const genreSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//         minlength:5,
//         maxlength:50
//     }
//
// });
//
// const Genre = mongoose.model('Genre', genreSchema);
//
// const genres = [
//     {id:1, name:'Action'},
//     {id:2, name:'Horror'},
//     {id:3, name:'Romance'},
//     ];


router.get('/',async (req,res)=>{
    const genre = await Genre.find().sort('name');
    if(genre.length === 0)
        return res.status(404).send('Empty array');

    res.send(genre);
    // res.send(genres);
});

router.get('/:id',async (req,res)=>{
    const genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(401).send('The genre with the given ID was not found');
    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name: req.body.name});
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id',async(req,res)=> {
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name},
        {new:true
        })

    if(!genre) return res.status(404).send('The genre with the given ID was not found');

    res.send(genre);

});

router.delete('/:id',[auth,admin],async (req,res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(404).send('The genre with the given ID was not found');

   res.send(genre)
})

router.delete('/', async (req,res)=>{
    const genre = await Genre.deleteMany();
    res.send("Deleted " + genre.deletedCount + " documents");
})

function validateGenre(genre){
    const schema =Joi.object({
        name: Joi.string().min(5).required()
    });
    return schema.validate(genre);
}
module.exports = router;
