const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({

    fullName : {
        type : String,
        required : [ true, "Enter Full Name"],
        maxlength : 50,
        minlength : 3
    },

    phoneNumber : {
        type : String,
        maxlength : 13,
        minlength : 10,
        required : [true, "Enter Your Phone Number"],
        validate : {
            validator : (pn) => {
                const pnRegexFull = /^[+][2][5][1][9][0-9]/;
                const pnRegexSmall = /^[0][9][0-9]/;
                if(pn.length === 13){
                    return pnRegexFull.test(pn);
                }
                else if(pn.length === 10){
                    return pnRegexSmall.test(pn);
                }
                else {
                    return false;
                }
            },
            error : "Invalid Phone Number"
        }
    },

    location : {
       type : [String],
       required : [true, "Input Proper Location"],
       maxlength : 2,
       minlength : 2,
    }

});

const Customer = mongoose.model('Customer',customerSchema);


let customerValidationSchema = Joi.object({
    fullName : Joi.string().required().min(3).max(50),
    phoneNumber : Joi.string().required().min(10).max(14),
    location : Joi.array().min(2).max(2).required()
});

module.exports.Customer = Customer;
module.exports.customerValidationSchema = customerValidationSchema;