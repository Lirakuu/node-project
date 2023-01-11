const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: Number,
        minlength: 9
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer){
    const schema =Joi.object({
        name: Joi.string().min(5).required(),
        // isGold: Joi.boolean().required(),
        isGold: Joi.boolean().required(),
        phone: Joi.number().min(5).required()
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;