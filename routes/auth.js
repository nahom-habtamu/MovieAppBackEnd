const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', async(req,res) => {
    try {
        const { error } = authRequestValidate.validate(req.body);
        if(error){
            throw new Error(error.message);
        }
        else {
            const user = await User.findOne({ phoneNumber : req.body.phoneNumber});
            if(!user) {
                throw new Error('Incorrect Phone Number');
            }
            const checkedPassword = await bcrypt.compare(req.body.password, user.password);
            if(!checkedPassword){
                throw new Error('Incorrect Password');
            }

            const token = user.generateAuthToken();
            res.send(token);
        }
    } 
    catch (error) {
        res.status(400).send(error.message);
    }
});

const authRequestValidate = Joi.object({
    phoneNumber : Joi.string().min(10).max(14),
    password : Joi.string().min(8).max(255)
});


module.exports = router;