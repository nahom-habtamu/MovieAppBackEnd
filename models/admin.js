const mongoose = require('mongoose');
const Joi = require('joi');

const adminSchema = new mongoose.Schema({

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

});

const Admin = mongoose.model('Admin',adminSchema);


let adminValidationSchema = Joi.object({
    fullName : Joi.string().required().min(3).max(50),
    phoneNumber : Joi.string().required().min(10).max(13),
});

module.exports.Admin = Admin;
module.exports.adminValidationSchema = adminValidationSchema;