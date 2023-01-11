const config = require('config');
// require("dotenv").config();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const {func} = require("joi");
// const {val} = require("mongoose/lib/helpers/populate/SkipPopulateValue");

router.post('/',async (req,res)=> {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = jwt.sign({_id:user._id , isAdmin:user.isAdmin}, process.env.vidly_jwtPrivateKey);

    res.send(token);
});
//Information expert principle
function validate(req){
    const schema =Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;