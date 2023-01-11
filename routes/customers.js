const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customer');
// const {boolean} = require("joi");

    // const customer [
    // {isGold: true,name:'Lirak',phone:''049110071},
    // {isGold: true,name:'Argjend',phone:''049456121},
    // {isGold: true,name:'Rrapi',phone:''044216215}
    // ];

router.get('/',async (req,res)=>{
    const customer = await Customer.find({isGold:true}).sort('name');

    if(customer.length === 0)
        return res.status(404).send('Empty array');

    res.send(customer);
    // res.send(genres);
});

router.get('/:id',async (req,res)=>{
    const customer = await Customer.findById(req.params.id);

    if(!customer) return res.status(404).send('The genre with the given ID was not found');
    res.send(customer);
});

router.post('/',async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    });
    customer = await customer.save();

    res.send(customer);
});

router.put('/:id',async(req,res)=> {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name},
        {new:true
        })

    if(!customer) return res.status(404).send('The genre with the given ID was not found');

    res.send(customer);
});

router.delete('/:id',async (req,res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(404).send('The genre with the given ID was not found');

    res.send(customer)
})

router.delete('/',async (req,res)=>{
    const customer = await Customer.deleteMany();
    res.send("Deleted " + customer.deletedCount + " documents");
})


module.exports = router;