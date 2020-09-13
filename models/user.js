const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({

    phoneNumber : {
        type : String,
        maxlength : 14,
        minlength : 10,
        required : [true, "Enter Your Phone Number"],
        unique : true,
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

    password : {
        type : String,
        maxlength : 255,
        minlength : 8,
        required : [true, "Enter Proper Password"]
    },

    customerOrProducerOrAdminId : {
        type : String,
        validate : {
            validator : (id) => {
                return mongoose.Types.ObjectId.isValid(id);
            },
            error : "Invalid object Id"
        }
    },

    role : {
        type : String,
        required : true,
        validate : {
            validator : (role) => {
                if(role === "admin" || role === "user" || role === "producer"){
                    return true;
                }
                return false;
            }
        }
    }

});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ cpaID : this.customerOrProducerOrAdminId , role : this.role },config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User',userSchema);


let userValidationSchema = Joi.object({
    ID : Joi.objectId().required(),
    password : Joi.string().max(255).min(8).required()
});

let userPutValidationSchema = Joi.object({
    password : Joi.string().max(255).min(8).required()
});


module.exports.User = User;
module.exports.userValidationSchema = userValidationSchema;
module.exports.userPutValidationSchema = userPutValidationSchema;