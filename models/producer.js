const Joi = require('joi');
const mongoose = require('mongoose');

const producerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [ true ,"Please Enter Producer Name" ]
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
    rating : {
        type : Number,
        required : [ true, "Please Enter The Rating Of The Producer"],
        maxlength : 5,
        minlength : 1,
        default : 1
    },

});

const Producer = mongoose.model('Producer', producerSchema);


const producerValidationSchema = Joi.object({
    name : Joi.string().min(3).required(),
    phoneNumber : Joi.string().min(10).max(14).required(),
    rating : Joi.number().min(2).max(5).required(),
});

module.exports.producerValidationSchema = producerValidationSchema;
module.exports.Producer = Producer;