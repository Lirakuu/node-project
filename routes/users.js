const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const Joi = require('joi');
const {User,validateUser} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require('config');
require("dotenv").config();

router.get('/me',auth,async(req,res) => {
    const user =  await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/',async (req,res)=> {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save();

    const token = jwt.sign({_id:user._id, isAdmin: user.isAdmin }, process.env.vidly_jwtPrivateKey);
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
});

module.exports = router;